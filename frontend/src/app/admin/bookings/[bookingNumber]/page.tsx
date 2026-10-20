'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getStoredBookings, saveBookingToStorage } from '@/lib/storage';
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

export default function BookingDetailsPage() {
  const params = useParams();
  const bookingNumber = params.bookingNumber as string;

  const [booking, setBooking] = useState<DetailedBooking | null>(null);

  useEffect(() => {
    const loaded = getStoredBookings();
    const found = loaded.find((b: any) => b.bookingNumber === bookingNumber || b.id === bookingNumber);

    if (found) {
      setBooking({
        ...found,
        stage: found.stage || found.status || 'Inquiry',
        status: found.status || found.stage || 'Inquiry',
        paymentStatus: found.paymentStatus || 'partially_paid',
        createdAt: found.createdAt || new Date().toISOString(),
      });
    } else {
      // Default fallback if navigating directly
      setBooking({
        id: bookingNumber,
        bookingNumber: bookingNumber || 'VKCREATION-2026-001',
        customerName: 'Rahul & Sneha Sharma',
        phone: '+91 9876543210',
        email: 'rahul@example.com',
        eventType: 'Grand Wedding & Reception',
        eventDate: '2026-11-15',
        venue: 'Sayaji Hotel',
        city: 'Indore',
        stage: 'Shoot Scheduled',
        status: 'Shoot Scheduled',
        paymentStatus: 'partially_paid',
        totalAmount: 180000,
        advancePaid: 75000,
        assignedTeam: ['Aman (Lead)', 'Rohan (Drone)', 'Priya (Candid)'],
        createdAt: new Date().toISOString(),
        milestones: [
          { id: 'm1', label: 'Advance Payment Received', completed: true },
          { id: 'm2', label: 'Pre-Shoot Briefing Executed', completed: true },
          { id: 'm3', label: 'Main Event Photo & Video Coverage', completed: false },
          { id: 'm4', label: 'Cinematic Teaser & Highlight Edit', completed: false },
          { id: 'm5', label: 'Flush Mount Photobook Print', completed: false },
        ],
      });
    }
  }, [bookingNumber]);

  if (!booking) {
    return <div className="min-h-screen bg-stone-950 p-10 text-stone-100">Loading booking details...</div>;
  }

 const currentStageIndex = BOOKING_LIFECYCLE.indexOf(booking.stage || 'Inquiry');

  const updateStage = (newStage: BookingLifecycleStage) => {
    const updated = { ...booking, stage: newStage, status: newStage };
    setBooking(updated);
    saveBookingToStorage(updated);
  };

  const toggleMilestone = (id: string) => {
    if (!booking.milestones) return;
    const updatedMilestones = booking.milestones.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m));
    const updated = { ...booking, milestones: updatedMilestones };
    setBooking(updated);
    saveBookingToStorage(updated);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6 md:p-10 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-stone-100">{booking.customerName}</h1>
            <span className="font-mono text-amber-500 font-bold bg-stone-900 border border-stone-800 px-3 py-1 rounded-lg text-sm">
              {booking.bookingNumber}
            </span>
          </div>
          <p className="text-sm text-stone-400 mt-1">
            {booking.eventType} • {booking.eventDate} • {booking.venue}, {booking.city}
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-200 hover:bg-stone-800 w-max"
        >
          ← Back to All Bookings
        </Link>
      </div>

      {/* Interactive Visual 10-Stage Timeline */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
        <h3 className="text-lg font-bold text-stone-200">10-Stage Production Lifecycle Timeline</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {BOOKING_LIFECYCLE.map((stg, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <button
                key={stg}
                onClick={() => updateStage(stg)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                  isCurrent
                    ? 'border-amber-500 bg-amber-500/20 text-amber-400 font-bold'
                    : isCompleted
                    ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                    : 'border-stone-800 bg-stone-950 text-stone-500 hover:text-stone-300'
                }`}
              >
                <span className="text-[10px] font-mono mb-1">Stage {idx + 1}</span>
                <span className="text-xs font-semibold leading-tight">{stg}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Milestones & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
            <h3 className="text-lg font-bold text-stone-200">Production Tasks & Deliverables Checklist</h3>
            <div className="space-y-3">
              {booking.milestones?.map((m) => (
                <label
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-stone-800 bg-stone-950 cursor-pointer hover:border-stone-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={m.completed}
                      onChange={() => toggleMilestone(m.id)}
                      className="rounded border-stone-800 text-amber-500 focus:ring-amber-500 h-4 w-4"
                    />
                    <span className={`text-sm ${m.completed ? 'line-through text-stone-500' : 'text-stone-200 font-medium'}`}>
                      {m.label}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${m.completed ? 'text-emerald-400' : 'text-amber-500'}`}>
                    {m.completed ? 'Completed ✓' : 'Pending'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Financials & Assigned Crew */}
        <div className="space-y-6">
          {/* Financial Breakdown */}
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
            <h3 className="text-lg font-bold text-stone-200">Financial Ledger</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-400">Total Agreed Contract:</span>
                <strong className="text-stone-100">Rs. {booking.totalAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Advance Paid:</span>
                <strong className="text-emerald-400">Rs. {(booking.advancePaid || 0).toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-800">
                <span className="text-stone-400 font-semibold">Pending Balance Due:</span>
                <strong className="text-rose-400 font-extrabold">
                  Rs. {(booking.totalAmount - (booking.advancePaid || 0)).toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
          </div>

          {/* Assigned Crew */}
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
            <h3 className="text-lg font-bold text-stone-200">Assigned Studio Crew</h3>
            <div className="space-y-2">
              {booking.assignedTeam?.map((member, idx) => (
                <div key={idx} className="rounded bg-stone-950 border border-stone-800 p-2.5 text-xs text-stone-300 font-medium">
                  👤 {member}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}