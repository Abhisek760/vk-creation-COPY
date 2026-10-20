'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { BookingLifecycleStage, DetailedBooking } from '@/types/booking';

const BOOKING_LIFECYCLE: BookingLifecycleStage[] = [
  'Inquiry',
  'Quotation Sent',
  'Confirmed',
  'Advance Received',
  'Shoot Scheduled',
  'Editing',
  'Ready for Delivery',
  'Delivered',
  'Closed',
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<DetailedBooking[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // 🔄 REALTIME FIRESTORE DATABASE LISTENER
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'bookings'), (snapshot) => {
        const fetched: DetailedBooking[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetched.push({
            id: docSnap.id,
            bookingNumber: data.bookingNumber || docSnap.id,
            customerName: data.clientName || data.customerName || 'Valued Client',
            phone: data.clientPhone || data.phone || 'N/A',
            email: data.email || 'N/A',
            eventType: data.eventType || 'Wedding Photography',
            eventDate: data.eventDate || new Date().toISOString().split('T')[0],
            venue: data.venue || 'Main Venue',
            city: data.city || 'Indore',
            stage: data.stage || data.status || 'Inquiry',
            status: data.status || data.stage || 'Inquiry',
            paymentStatus: data.paymentStatus || (Number(data.remainingBalance) <= 0 ? 'paid' : 'partially_paid'),
            totalAmount: Number(data.totalAmount) || 0,
            advancePaid: Number(data.advancePaid) || 0,
            remainingBalance: Number(data.remainingBalance ?? data.totalAmount) || 0,
            paymentSubmitted: Boolean(data.paymentSubmitted),
            lastPaymentType: data.lastPaymentType || 'advance',
            assignedTeam: data.assignedTeam || ['Studio Lead'],
            createdAt: data.createdAt || new Date().toISOString(),
          } as DetailedBooking & { paymentSubmitted?: boolean; lastPaymentType?: string; remainingBalance?: number });
        });

        // Fallback to LocalStorage if Firestore is empty
        if (fetched.length === 0) {
          const raw1 = localStorage.getItem('vk_creation_bookings');
          const raw2 = localStorage.getItem('vk_studio_bookings');
          const combined = [...(raw1 ? JSON.parse(raw1) : []), ...(raw2 ? JSON.parse(raw2) : [])];

          if (combined.length > 0) {
            setBookings(combined.map((b: any) => ({
              id: b.bookingNumber || 'VK-001',
              bookingNumber: b.bookingNumber || 'VK-001',
              customerName: b.clientName || b.customerName || 'Valued Client',
              phone: b.clientPhone || b.phone || 'N/A',
              email: b.email || 'N/A',
              eventType: b.eventType || 'Wedding Photography',
              eventDate: b.eventDate || new Date().toISOString().split('T')[0],
              venue: b.venue || 'Indore',
              city: b.city || 'Indore',
              stage: b.status || 'Inquiry',
              status: b.status || 'Inquiry',
              paymentStatus: (Number(b.remainingBalance) <= 0) ? 'paid' : 'partially_paid',
              totalAmount: Number(b.totalAmount) || 0,
              advancePaid: Number(b.advancePaid) || 0,
              remainingBalance: Number(b.remainingBalance ?? b.totalAmount) || 0,
              paymentSubmitted: Boolean(b.paymentSubmitted),
              createdAt: b.createdAt || new Date().toISOString(),
            } as DetailedBooking)));
          }
        } else {
          setBookings(fetched);
        }
      });

      return () => unsub();
    } catch (err) {
      console.error("Firestore Listen Error:", err);
    }
  }, []);

  const todayDateStr = new Date().toISOString().split('T')[0];

  const todaysBookings = bookings.filter((b) => b.eventDate === todayDateStr);
  const upcomingShoots = bookings.filter((b) => b.eventDate > todayDateStr);
  const pendingPaymentAlerts = bookings.filter((b: any) => b.paymentSubmitted || b.status?.includes('Needs Verification') || b.status?.includes('Auto-Detected'));

  // 👑 ADMIN VERIFICATION HANDLER FOR ADVANCE / REMAINING BALANCE
  const handleVerifyPayment = async (bookingItem: any) => {
    setIsProcessing(bookingItem.bookingNumber);
    try {
      const isBalanceClear = bookingItem.lastPaymentType === 'balance' || Number(bookingItem.remainingBalance) <= 30000;
      
      const newAdvancePaid = isBalanceClear ? bookingItem.totalAmount : (bookingItem.advancePaid || bookingItem.advanceRequired || 10000);
      const newRemaining = Math.max(0, bookingItem.totalAmount - newAdvancePaid);
      const newStatus = isBalanceClear ? 'Confirmed & Fully Cleared' : 'Confirmed & Scheduled';
      const newStage = isBalanceClear ? 'Closed' : 'Advance Received';

      // 1. Update Firestore Realtime
      try {
        const bookingRef = doc(db, 'bookings', bookingItem.bookingNumber);
        await updateDoc(bookingRef, {
          advancePaid: newAdvancePaid,
          remainingBalance: newRemaining,
          paymentSubmitted: false,
          status: newStatus,
          stage: newStage,
          paymentStatus: newRemaining <= 0 ? 'paid' : 'partially_paid',
          updatedAt: new Date().toISOString(),
        });
      } catch (fsErr) {
        console.warn("Firestore update fallback:", fsErr);
      }

      // 2. LocalStorage Sync Backup
      const updateKey = (key: string) => {
        const raw = localStorage.getItem(key);
        if (!raw) return;
        const list = JSON.parse(raw);
        const updated = list.map((b: any) => {
          if (String(b.bookingNumber).trim().toLowerCase() === String(bookingItem.bookingNumber).trim().toLowerCase()) {
            return {
              ...b,
              advancePaid: newAdvancePaid,
              remainingBalance: newRemaining,
              paymentSubmitted: false,
              status: newStatus,
              stage: newStage,
            };
          }
          return b;
        });
        localStorage.setItem(key, JSON.stringify(updated));
      };

      updateKey('vk_creation_bookings');
      updateKey('vk_studio_bookings');

      alert(`✅ Payment Verified! Ref ${bookingItem.bookingNumber} is now ${newStatus}.`);
    } catch (err) {
      console.error(err);
      alert('❌ Error verifying payment.');
    } finally {
      setIsProcessing(null);
    }
  };

  const advanceStage = async (id?: string) => {
    if (!id) return;
    const target = bookings.find((b) => b.id === id || b.bookingNumber === id);
    if (!target) return;

    const currentStage = target.stage || 'Inquiry';
    const currentIndex = BOOKING_LIFECYCLE.indexOf(currentStage as BookingLifecycleStage);
    const nextStage =
      currentIndex >= 0 && currentIndex < BOOKING_LIFECYCLE.length - 1
        ? BOOKING_LIFECYCLE[currentIndex + 1]
        : BOOKING_LIFECYCLE[0];

    try {
      const bookingRef = doc(db, 'bookings', target.bookingNumber);
      await updateDoc(bookingRef, {
        stage: nextStage,
        status: nextStage,
      });
    } catch (e) {
      console.warn("Firestore fallback", e);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const nameMatch = (b.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const refMatch = (b.bookingNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = (b.phone || '').includes(searchQuery);

    const matchesSearch = nameMatch || refMatch || phoneMatch;
    const matchesStage = stageFilter === 'ALL' || b.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 md:p-10 space-y-8 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-stone-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500 font-mono">
            VK_CREATION STUDIO — MANAGEMENT SUITE
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-stone-100 mt-0.5">
            Booking & Payment Dashboard
          </h1>
          <p className="text-xs md:text-sm text-stone-400 mt-1">
            Realtime client payments verification, shoot lifecycle tracking, and calendar schedules.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex rounded-xl border border-stone-800 bg-stone-900 p-1 text-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg px-3 py-1.5 font-bold transition ${
                viewMode === 'list' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`rounded-lg px-3 py-1.5 font-bold transition ${
                viewMode === 'calendar' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Shoot Calendar
            </button>
          </div>
          <Link
            href="/builder"
            className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/10"
          >
            + Create Proposal
          </Link>
        </div>
      </div>

      {/* ⚡ REALTIME PAYMENT VERIFICATION ALERTS BOX (IF ANY PENDING) */}
      {pendingPaymentAlerts.length > 0 && (
        <div className="bg-amber-950/40 border-2 border-amber-500/80 rounded-2xl p-5 space-y-3 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></span>
              <h2 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider font-mono">
                🚨 Client Payment Verification Required ({pendingPaymentAlerts.length})
              </h2>
            </div>
            <span className="text-[10px] text-amber-300 font-mono">Realtime Auto-Detected</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingPaymentAlerts.map((b: any) => (
              <div key={b.bookingNumber} className="bg-stone-900 border border-stone-800 p-4 rounded-xl flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <span className="text-amber-400 font-bold font-mono block">{b.bookingNumber}</span>
                  <strong className="text-stone-100 text-sm block">{b.customerName}</strong>
                  <p className="text-stone-400">
                    Payment Type: <span className="text-emerald-400 font-bold uppercase">{b.lastPaymentType || 'UPI'}</span>
                  </p>
                  <p className="text-stone-400">
                    Total: ₹{b.totalAmount?.toLocaleString('en-IN')} | Remaining: ₹{(b.remainingBalance ?? b.totalAmount)?.toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  disabled={isProcessing === b.bookingNumber}
                  onClick={() => handleVerifyPayment(b)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isProcessing === b.bookingNumber ? 'Syncing...' : '✓ Approve & Unlock Portal'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's & Upcoming Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Bookings */}
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-amber-500/20 pb-2">
            <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2 font-mono">
              <span>🔴</span> TODAY'S SCHEDULED SHOOTS ({todaysBookings.length})
            </h2>
            <span className="text-xs font-mono text-amber-300">{todayDateStr}</span>
          </div>
          {todaysBookings.length === 0 ? (
            <p className="text-xs text-stone-500 py-2">No shoots scheduled for today.</p>
          ) : (
            todaysBookings.map((b) => (
              <div key={b.id} className="flex justify-between items-center text-xs bg-stone-900 p-3 rounded-xl border border-stone-800">
                <div>
                  <strong className="text-stone-200 text-sm block">{b.customerName}</strong>
                  <span className="text-stone-400">{b.eventType} • {b.venue}</span>
                </div>
                <Link href={`/admin/bookings/${b.bookingNumber}`} className="text-amber-400 font-bold hover:underline">
                  View →
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Upcoming Shoots */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-stone-800 pb-2">
            <h2 className="text-sm font-bold text-stone-200 flex items-center gap-2 font-mono">
              <span>📅</span> UPCOMING SHOOTS PIPELINE ({upcomingShoots.length})
            </h2>
          </div>
          {upcomingShoots.length === 0 ? (
            <p className="text-xs text-stone-500 py-2">No upcoming shoots scheduled.</p>
          ) : (
            upcomingShoots.map((b) => (
              <div key={b.id} className="flex justify-between items-center text-xs bg-stone-950 p-3 rounded-xl border border-stone-800">
                <div>
                  <strong className="text-stone-200 block">{b.customerName}</strong>
                  <span className="text-stone-400">{b.eventType} • {b.eventDate}</span>
                </div>
                <span className="rounded-md bg-stone-800 px-2 py-0.5 text-[10px] text-amber-400 font-semibold border border-stone-700">
                  {b.stage}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search client name, ref number or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80 rounded-xl border border-stone-800 bg-stone-900 px-4 py-2.5 text-xs text-stone-100 outline-none focus:border-amber-500"
        />

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <span className="text-xs text-stone-500 font-medium font-mono">Filter Stage:</span>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-stone-200 outline-none focus:border-amber-500"
          >
            <option value="ALL">All Stages</option>
            {BOOKING_LIFECYCLE.map((stg) => (
              <option key={stg} value={stg}>
                {stg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="overflow-x-auto rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-800 text-[11px] uppercase text-stone-400 font-mono">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Event & Venue</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Current Lifecycle Stage</th>
                <th className="py-3 px-4">Financial Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {filteredBookings.map((b: any) => (
                <tr key={b.bookingNumber} className="hover:bg-stone-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-amber-500">{b.bookingNumber}</td>
                  <td className="py-3 px-4 font-bold text-stone-200">{b.customerName}</td>
                  <td className="py-3 px-4 text-stone-300">
                    <div>{b.eventType}</div>
                    <div className="text-stone-500 text-[10px]">{b.venue}, {b.city}</div>
                  </td>
                  <td className="py-3 px-4 text-amber-400 font-semibold font-mono">{b.eventDate}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => advanceStage(b.id || b.bookingNumber)}
                      className="rounded-full px-3 py-1 text-[11px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-800 hover:border-amber-500 transition cursor-pointer"
                    >
                      {b.stage} ➔
                    </button>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <strong className="text-stone-100 block">₹{b.totalAmount?.toLocaleString('en-IN')}</strong>
                    <span className={`text-[10px] font-bold ${
                      (b.remainingBalance ?? 0) <= 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {(b.remainingBalance ?? 0) <= 0 ? '✓ Paid Full' : `Bal: ₹${(b.remainingBalance ?? b.totalAmount)?.toLocaleString('en-IN')}`}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/bookings/${b.bookingNumber}`}
                      className="rounded-lg bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:bg-stone-700 transition"
                    >
                      Details & Timeline →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
          <h2 className="text-base font-bold text-stone-200 font-mono">Shoot Calendar Matrix</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bookings.map((b) => (
              <div key={b.bookingNumber} className="rounded-2xl border border-stone-800 bg-stone-950 p-4 space-y-2">
                <span className="rounded-lg bg-amber-950 px-2.5 py-1 text-xs text-amber-400 font-mono font-bold border border-amber-800 inline-block">
                  📅 {b.eventDate}
                </span>
                <h3 className="font-bold text-stone-100 text-sm">{b.customerName}</h3>
                <p className="text-xs text-stone-400">{b.eventType} @ {b.venue}</p>
                <div className="pt-2 flex justify-between items-center text-xs border-t border-stone-800">
                  <span className="text-amber-500 font-semibold">{b.stage}</span>
                  <Link href={`/admin/bookings/${b.bookingNumber}`} className="text-stone-300 hover:underline">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}