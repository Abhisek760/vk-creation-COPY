'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TermsRepository, StudioBrandingRepository } from '@/lib/catalogRepository';
import { db } from '@/lib/firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

interface InstallmentRecord {
  id?: string;
  installment?: string;
  title?: string;
  description?: string;
  amount: number;
  status?: 'pending' | 'submitted' | 'paid';
  date?: string;
  paidAt?: string;
  utr?: string;
  utrNumber?: string;
}

interface BookingData {
  bookingNumber: string;
  clientName: string;
  clientPhone: string;
  eventDate: string;
  venue: string;
  totalAmount: number;
  advanceRequired: number;
  advancePaid: number;
  remainingBalance: number;
  status: string;
  utrNumber?: string;
  paymentSubmitted?: boolean;
  services: string[];
  installmentsHistory?: InstallmentRecord[];
  createdAt?: string;
}

export default function ClientVIPPortalPage() {
  const params = useParams();
  const bookingId = (params?.bookingNumber as string) || (params?.id as string) || 'VKCREATION-310393';

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isSyncingPayment, setIsSyncingPayment] = useState(false);
  
  const [termsList, setTermsList] = useState<string[]>([]);
  const [sealImage, setSealImage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 💳 DYNAMIC UPI & PAYEE INFO
  const [studioUpiId, setStudioUpiId] = useState('9753820740@upi');
  const [studioPayeeName, setStudioPayeeName] = useState('VK Creation Studio');

  const showVIPToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 10000);
  };

// 1️⃣ Config & Branding Loader
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUpi = localStorage.getItem('vk_studio_upi');
      const savedPayee = localStorage.getItem('vk_studio_payee_name');
      if (savedUpi) setStudioUpiId(savedUpi.trim());
      if (savedPayee) setStudioPayeeName(savedPayee.trim());
    }

    const loadBrandingData = async () => {
      try {
        const loadedTerms = await TermsRepository.getTerms();
        setTermsList(Array.isArray(loadedTerms) ? loadedTerms : []);

        const seal = await StudioBrandingRepository.getSealImage();
        setSealImage(seal);
      } catch (e) {
        console.error('Branding Load Error:', e);
      }
    };

    loadBrandingData();
  }, []);

  // 2️⃣ Realtime Cloud Firestore Sync Engine
  useEffect(() => {
    if (!bookingId) return;

    let unsub: (() => void) | null = null;

    try {
      unsub = onSnapshot(
        doc(db, 'bookings', bookingId.trim()),
        (docSnap) => {
          if (docSnap.exists()) {
            const matched = docSnap.data();
            const total = Number(matched.totalAmount) || 40000;
            const history: InstallmentRecord[] = Array.isArray(matched.installmentsHistory) ? matched.installmentsHistory : [];

            const calculatedPaid = history.length > 0 
              ? history.reduce((sum, inst) => sum + (Number(inst.amount) || 0), 0)
              : Number(matched.advancePaid) || 0;

            const remaining = Math.max(0, total - calculatedPaid);

            setBooking({
              bookingNumber: matched.bookingNumber || bookingId,
              clientName: matched.clientName || 'Valued Client',
              clientPhone: matched.clientPhone || 'N/A',
              eventDate: matched.eventDate || new Date().toISOString().split('T')[0],
              venue: matched.venue || 'Indore',
              totalAmount: total,
              advanceRequired: Number(matched.advanceRequired) || 0,
              advancePaid: calculatedPaid,
              remainingBalance: remaining,
              status: matched.status || 'Awaiting Payment',
              utrNumber: matched.utrNumber || '',
              paymentSubmitted: Boolean(matched.paymentSubmitted),
              services: Array.isArray(matched.services) ? matched.services : ['Custom Studio Coverage'],
              installmentsHistory: history,
              createdAt: matched.createdAt,
            });
          } else {
            // Local Storage Fallback if Cloud Doc missing
            const raw1 = localStorage.getItem('vk_creation_bookings');
            const raw2 = localStorage.getItem('vk_studio_bookings');
            const list1 = raw1 ? JSON.parse(raw1) : [];
            const list2 = raw2 ? JSON.parse(raw2) : [];
            const combined = [...list1, ...list2];

            const matched = combined.find(
              (b: any) => String(b.bookingNumber).trim().toLowerCase() === String(bookingId).trim().toLowerCase()
            );

            if (matched) {
              const total = Number(matched.totalAmount) || 40000;
              const history: InstallmentRecord[] = Array.isArray(matched.installmentsHistory) ? matched.installmentsHistory : [];
              const calculatedPaid = history.length > 0 
                ? history.reduce((sum, inst) => sum + (Number(inst.amount) || 0), 0)
                : Number(matched.advancePaid) || 0;
              const remaining = Math.max(0, total - calculatedPaid);

              setBooking({
                bookingNumber: matched.bookingNumber,
                clientName: matched.clientName || 'Valued Client',
                clientPhone: matched.clientPhone || 'N/A',
                eventDate: matched.eventDate || new Date().toISOString().split('T')[0],
                venue: matched.venue || 'Indore',
                totalAmount: total,
                advanceRequired: Number(matched.advanceRequired) || 0,
                advancePaid: calculatedPaid,
                remainingBalance: remaining,
                status: matched.status || 'Awaiting Payment',
                utrNumber: matched.utrNumber || '',
                paymentSubmitted: Boolean(matched.paymentSubmitted),
                services: Array.isArray(matched.services) ? matched.services : ['Custom Studio Coverage'],
                installmentsHistory: history,
                createdAt: matched.createdAt,
              });
            }
          }
        },
        (err) => {
          console.warn('Realtime Portal Firestore Sync Notice:', err);
        }
      );
    } catch (err) {
      console.error('Firestore Listen Error:', err);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [bookingId]);

  if (!booking) {
    return <div className="p-10 text-center text-stone-400 font-sans text-xs">Loading Client VIP Portal...</div>;
  }

  const isFullyPaid = booking.remainingBalance <= 0;
  const hasActiveAdvance = Number(booking.advanceRequired) > 0;
  const currentAdvanceToPay = booking.advanceRequired;

  const handleConfirmPayment = async () => {
    setIsSyncingPayment(true);
    try {
      showVIPToast('⚡ UPI Payment Detected! Syncing with Admin Panel...');

      const newStatus = `Payment Submitted (₹${currentAdvanceToPay.toLocaleString('en-IN')})`;

      const bookingRef = doc(db, 'bookings', booking.bookingNumber);
      await updateDoc(bookingRef, {
        paymentSubmitted: true,
        lastSubmittedAmount: currentAdvanceToPay,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      setShowPayModal(false);
      showVIPToast('📲 Payment Sent to Admin! Verification hone par receipt unlock ho jayegi.');
    } catch (err) {
      console.error(err);
      showVIPToast('❌ Connection Error. Kripya dobara try karein.');
    } finally {
      setIsSyncingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-3 sm:p-6 md:p-10 max-w-6xl mx-auto space-y-6 sm:space-y-8 relative font-sans overflow-x-hidden">
      
      {/* 🖨️ PERFECT PRINT OVERFLOW LOCK */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          div[class*="printable-a4-sheet"], div[class*="printable-a4-sheet"] * {
            visibility: visible !important;
          }
          div[class*="printable-a4-sheet"] {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10px !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
          }
          @page {
            size: A4 portrait;
            margin: 0mm;
          }
        }
      `}</style>

      <div className="portal-main-wrapper space-y-6 sm:space-y-8">
        
        {toastMessage && (
          <div className="fixed top-4 right-4 sm:top-5 sm:right-5 z-50 bg-stone-900 border border-amber-500/60 text-stone-100 text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 max-w-[90vw]">
            <span className="text-base sm:text-lg">👑</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Portal Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-800 pb-4 sm:pb-5 gap-3 sm:gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase tracking-widest block font-mono">
              VK_CREATION STUDIO — CLIENT PERSONAL PORTAL
            </span>
            <h1 className="text-xl sm:text-3xl font-black text-stone-100 mt-0.5">
              Welcome, {booking.clientName}
            </h1>
            <p className="text-xs text-stone-400">
              Your Booking Ref : <strong className="text-amber-400 font-bold">{booking.bookingNumber}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isFullyPaid ? (
              <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                ✓ 100% Fully Paid & Cleared
              </span>
            ) : booking.paymentSubmitted ? (
              <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-500/20 border border-amber-500/50 text-amber-300 animate-pulse">
                ⏳ Payment Submitted (Admin Verification Pending)
              </span>
            ) : (
              <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                ⚡ Active Account 
              </span>
            )}
          </div>
        </div>

        {/* 💳 DYNAMIC INSTALLMENTS SUMMARY BANNER */}
        <div className="bg-stone-900 border border-amber-500/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="space-y-1">
              <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest font-mono block">
                📊 PAYMENT LEDGER SUMMARY
              </span>
              <h2 className="text-base sm:text-xl font-black text-stone-100 leading-snug">
                Total Amount : <span className="text-stone-300 font-mono">₹{booking.totalAmount.toLocaleString('en-IN')}</span> | Paid: <span className="text-emerald-400 font-mono">₹{booking.advancePaid.toLocaleString('en-IN')}</span> | Remaining: <span className="text-amber-400 font-mono">₹{booking.remainingBalance.toLocaleString('en-IN')}</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-400">
                {isFullyPaid 
                  ? '🎉 All payments settled! Your full tax invoice is unlocked below.' 
                  : booking.paymentSubmitted
                  ? '⏳ Your payment has been sent to Admin for verification.'
                  : hasActiveAdvance
                  ? `Requested Advance Amount: ₹${currentAdvanceToPay.toLocaleString('en-IN')}`
                  : '⏳ Awaiting Next Advance Amount Request from Studio Admin.'}
              </p>
            </div>

            {!isFullyPaid && (
              <>
                {booking.paymentSubmitted ? (
                  <span className="w-full sm:w-auto text-center bg-amber-500/20 border border-amber-500/60 text-amber-300 font-bold px-4 py-2.5 rounded-xl text-xs uppercase font-mono animate-pulse">
                    ⏳ Verification Pending
                  </span>
                ) : hasActiveAdvance ? (
                  <button
                    onClick={() => setShowPayModal(true)}
                    className="relative group overflow-hidden shrink-0 inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-linear-to-r from-amber-500/90 via-amber-500 to-amber-600/90 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_18px_rgba(245,158,11,0.35)] hover:shadow-[0_0_28px_rgba(245,158,11,0.6)] active:scale-95 cursor-pointer border border-amber-400/60 whitespace-nowrap"
                  >
                    <span className="text-sm shrink-0">💵</span>
                    <span className="font-extrabold text-stone-950 tracking-wider">
                      PAY ADVANCE AMOUNT
                    </span>
                    <span className="font-mono bg-stone-950/90 text-amber-400 px-2 py-0.5 rounded-md text-[11px] font-black shrink-0 border border-amber-500/30">
                      ₹{currentAdvanceToPay.toLocaleString('en-IN')}
                    </span>
                  </button>
                ) : (
                  <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl sm:rounded-2xl bg-linear-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold shadow-lg shadow-amber-500/10 backdrop-blur-md animate-pulse">
                    <span className="text-sm shrink-0">⏳</span>
                    <span className="tracking-wide">
                      Waiting for Advance Amount Request...
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* DELIVERABLES HUB GRID */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xs font-bold text-amber-500 uppercase tracking-wider">
            📁 YOUR DELIVERABLES & EVENT HUB
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Receipts Box */}
            <div className="bg-stone-900/60 border border-stone-800 p-4 sm:p-5 rounded-2xl space-y-3 flex flex-col justify-between hover:border-amber-500/40 transition">
              <div className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-2xl sm:text-3xl block">🧾</span>
                  {booking.advancePaid <= 0 && (
                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      🔒 LOCKED
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-stone-100">Payment Receipts</h3>
                <p className="text-[11px] sm:text-xs text-stone-400">
                  {booking.advancePaid > 0 ? 'View individual payment receipts' : 'Unlocks after 1st advance payment verification.'}
                </p>
              </div>

              {booking.advancePaid > 0 ? (
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="text-xs font-bold text-amber-400 hover:underline text-left pt-2 cursor-pointer font-mono"
                >
                  VIEW RECEIPTS →
                </button>
              ) : (
                <span className="text-[10px] text-stone-600 font-bold block pt-2 font-mono">
                  🔒 Awaiting First Advance
                </span>
              )}
            </div>

            {/* Service Agreement Box */}
            <div className="bg-stone-900/60 border border-stone-800 p-4 sm:p-5 rounded-2xl space-y-3 flex flex-col justify-between hover:border-amber-500/40 transition">
              <div className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-2xl sm:text-3xl block">📜</span>
                  {booking.advancePaid <= 0 && (
                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      🔒 LOCKED
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-stone-100">Service Agreement</h3>
                <p className="text-[11px] sm:text-xs text-stone-400">
                  {booking.advancePaid > 0 ? 'Official printable legal contract document.' : 'Unlocks after advance payment verification.'}
                </p>
              </div>

              {booking.advancePaid > 0 ? (
                <button
                  onClick={() => setShowContractModal(true)}
                  className="text-xs font-bold text-amber-400 hover:underline text-left pt-2 cursor-pointer font-mono"
                >
                  VIEW CONTRACT →
                </button>
              ) : (
                <span className="text-[10px] text-stone-600 font-bold block pt-2 font-mono">
                  🔒 Awaiting Approval
                </span>
              )}
            </div>

            {/* Photo Gallery Box */}
            <div className={`p-4 sm:p-5 rounded-2xl space-y-3 flex flex-col justify-between border transition ${
              booking.advancePaid > 0 ? 'bg-stone-900/60 border-stone-800 hover:border-amber-500/40' : 'bg-stone-950/80 border-stone-800/80'
            }`}>
              <div className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-2xl sm:text-3xl block">🖼️</span>
                  {booking.advancePaid <= 0 && (
                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      🔒 LOCKED
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-stone-100">Photo Gallery & Selection</h3>
                <p className="text-[11px] sm:text-xs text-stone-400">
                  {booking.advancePaid > 0 ? 'Access preview photos & selection portal.' : 'Unlocks after advance payment verification.'}
                </p>
              </div>

              {booking.advancePaid > 0 ? (
                <a
                  href="https://photos.app.goo.gl"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-emerald-400 hover:underline block pt-2 font-mono"
                >
                  OPEN GALLERY →
                </a>
              ) : (
                <span className="text-[10px] text-stone-600 font-bold block pt-2 font-mono">
                  🔒 Pay First Advance
                </span>
              )}
            </div>

            {/* Tax Invoice Box */}
            <div className={`p-4 sm:p-5 rounded-2xl space-y-3 flex flex-col justify-between border transition ${
              isFullyPaid ? 'bg-stone-900/60 border-stone-800 hover:border-amber-500/40' : 'bg-stone-950/80 border-stone-800/80'
            }`}>
              <div className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-2xl sm:text-3xl block">📄</span>
                  {!isFullyPaid && (
                    <span className="bg-stone-800 text-stone-400 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      🔒 LOCKED
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-stone-100">Final Tax Invoice</h3>
                <p className="text-[11px] sm:text-xs text-stone-400">
                  {isFullyPaid ? 'Official full settlement tax bill.' : 'Issued upon 100% full payment settlement.'}
                </p>
              </div>

              {isFullyPaid ? (
                <Link
                  href={`/admin/invoices/${booking.bookingNumber}?mode=client`}
                  className="text-xs font-bold text-amber-400 hover:underline block pt-2 font-mono"
                >
                  VIEW FULL INVOICE →
                </Link>
              ) : (
                <span className="text-[10px] text-stone-600 font-bold block pt-2 font-mono">
                  🔒 Requires 100% Full Payment
                </span>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* 🧾 PRO PAYMENT RECEIPT MODAL */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0 font-sans">
          <div className="printable-a4-sheet bg-white text-slate-900 w-full max-w-2xl sm:max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-amber-300/80 relative print:shadow-none print:border-none print:w-full print:rounded-none my-auto">
            
            <div className="no-print bg-stone-900 text-stone-100 px-4 sm:px-6 py-2.5 flex justify-between items-center border-b border-amber-500/30">
              <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                Official Payment Receipt Voucher
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-amber-500 text-stone-950 font-black px-3 py-1 rounded-lg text-xs uppercase tracking-wider cursor-pointer hover:bg-amber-400 transition font-mono"
                >
                  🖨️ Save PDF
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="bg-stone-800 text-stone-300 font-bold px-3 py-1 rounded-lg text-xs cursor-pointer hover:bg-stone-700 transition font-mono"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 bg-white print:p-0">
              {/* Studio Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-amber-600/30 pb-2.5 gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-600 text-lg sm:text-xl">👑</span>
                    <h1 className="text-lg sm:text-2xl font-serif font-black text-slate-900 uppercase">
                      VK_Creation Studio
                    </h1>
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-700 tracking-wider uppercase">
                    Luxury Wedding Photography & Cinematography
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-slate-600">BiaoraMandu , Sarangpur, M.P. | 📞 +91 9644213129</p>
                </div>

                <div className="text-right space-y-0.5 shrink-0 font-mono">
                  <span className="bg-emerald-100 text-emerald-900 font-bold text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full uppercase border border-emerald-300">
                    ✓ Verified Voucher
                  </span>
                  <p className="text-xs font-black text-slate-900 pt-1">Ref: <span className="text-amber-700">{booking.bookingNumber}</span></p>
                  <p className="text-[9px] text-slate-500 font-medium">Issue Date: {new Date().toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              {/* Client Name & Venue */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center gap-2">
                <div>
                  <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase block font-mono">CLIENT NAME :</span>
                  <strong className="text-xs sm:text-sm font-extrabold text-slate-900">{booking.clientName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase block font-mono">CONTACT / LOCATION:</span>
                  <p className="font-semibold text-slate-800 text-[10px] sm:text-xs">Phone: +91 {booking.clientPhone} | {booking.venue}</p>
                </div>
              </div>

              {/* PAYMENT HISTORY TABLE */}
              <div className="space-y-1 font-mono">
                <h3 className="text-[10px] sm:text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-1 font-sans">
                  💳 PAYMENT INSTALLMENT HISTORY (भुगतान का विवरण)
                </h3>

                <div className="border border-slate-200 rounded-xl overflow-x-auto text-[10px] sm:text-xs shadow-sm">
                  <table className="w-full text-left min-w-125 sm:min-w-full">
                    <thead className="bg-slate-900 text-white font-extrabold uppercase tracking-wider text-[9px] sm:text-[10px]">
                      <tr>
                        <th className="p-2 sm:p-2.5">INST. #</th>
                        <th className="p-2 sm:p-2.5">PAYMENT DESCRIPTION</th>
                        <th className="p-2 sm:p-2.5">DATE</th>
                        <th className="p-2 sm:p-2.5">REFERENCE UTR</th>
                        <th className="p-2 sm:p-2.5 text-right">AMOUNT PAID</th>
                        <th className="p-2 sm:p-2.5 text-right">BALANCE DUE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                      {booking.installmentsHistory && booking.installmentsHistory.length > 0 ? (
                        (() => {
                          let runningAccumulator = 0;
                          return booking.installmentsHistory.map((inst, i) => {
                            const instAmt = Number(inst.amount) || 0;
                            runningAccumulator += instAmt;
                            const balAfterThisInst = Math.max(0, booking.totalAmount - runningAccumulator);

                            return (
                              <tr key={i} className="bg-white">
                                <td className="p-2 sm:p-2.5 font-extrabold text-amber-800">
                                  {inst.installment ? inst.installment.replace(/Token/g, 'Installment') : `Installment #${i + 1}`}
                                </td>
                                <td className="p-2 sm:p-2.5 font-semibold text-slate-800 font-sans">
                                  {inst.description || (i === booking.installmentsHistory!.length - 1 && booking.remainingBalance <= 0 ? 'Final Balance Settlement' : 'Advance Installment Amount')}
                                </td>
                                <td className="p-2 sm:p-2.5 text-slate-600">{inst.date || inst.paidAt || 'Confirmed'}</td>
                                <td className="p-2 sm:p-2.5 font-mono text-[9px] sm:text-[10px] text-slate-500">{inst.utr || inst.utrNumber || 'UPI/Verified'}</td>
                                <td className="p-2 sm:p-2.5 text-right font-mono font-black text-emerald-700 text-xs sm:text-sm">₹{instAmt.toLocaleString('en-IN')}</td>
                                <td className="p-2 sm:p-2.5 text-right font-mono font-black text-amber-900 text-xs sm:text-sm">₹{balAfterThisInst.toLocaleString('en-IN')}</td>
                              </tr>
                            );
                          });
                        })()
                      ) : (
                        <tr className="bg-white">
                          <td className="p-2 sm:p-2.5 font-extrabold text-amber-800">Installment #1</td>
                          <td className="p-2 sm:p-2.5 font-semibold text-slate-800 font-sans">Advance Installment Amount</td>
                          <td className="p-2 sm:p-2.5 text-slate-600">{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN') : 'Confirmed'}</td>
                          <td className="p-2 sm:p-2.5 font-mono text-[9px] sm:text-[10px] text-slate-500">{booking.utrNumber || 'UPI/Verified'}</td>
                          <td className="p-2 sm:p-2.5 text-right font-mono font-black text-emerald-700 text-xs sm:text-sm">₹{booking.advancePaid.toLocaleString('en-IN')}</td>
                          <td className="p-2 sm:p-2.5 text-right font-mono font-black text-amber-900 text-xs sm:text-sm">₹{booking.remainingBalance.toLocaleString('en-IN')}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FINANCIAL CALCULATION CARD */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold font-sans">Total Booking Amount (कुल राशि) :</span>
                  <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-800 font-bold border-t border-slate-200 pt-1">
                  <span className="font-sans">Total Paid So Far (कुल प्राप्त राशि) :</span>
                  <span className="font-mono text-xs sm:text-sm">- ₹{booking.advancePaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center font-black border-t-2 border-slate-300 pt-1.5 text-slate-900">
                  <span className="uppercase text-amber-900 text-[11px] sm:text-xs font-sans">Remaining Balance (बचा हुआ राशि ) :</span>
                  <span className={`font-mono text-xs sm:text-sm px-2.5 py-0.5 rounded-lg ${
                    booking.remainingBalance <= 0 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                      : 'bg-amber-100 text-amber-950 border border-amber-300'
                  }`}>
                    ₹{booking.remainingBalance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Seal & Footer */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <p className="text-[9px] text-slate-500 font-medium font-mono">*Official studio electronic voucher record.</p>

                <div className="text-center space-y-0.5 shrink-0 font-mono">
                  {sealImage ? (
                    <img
                      src={sealImage}
                      alt="Studio Official Seal"
                      className="w-10 h-10 object-contain mx-auto mb-0.5"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full border border-dashed border-amber-700 mx-auto flex flex-col items-center justify-center font-mono text-amber-900 font-bold leading-tight p-0.5 bg-amber-50 transform -rotate-6 mb-0.5">
                      <span className="text-[5px]">👑 VK_CREATION</span>
                      <span className="text-[5px] font-black">OFFICIAL</span>
                      <span className="text-[5px]">SEAL STAMP</span>
                    </div>
                  )}
                  <p className="text-[9px] font-extrabold text-slate-900 uppercase pt-0.5">
                    Ashutosh Vishwakarma
                  </p>
                  <span className="text-[7px] text-slate-600 block -mt-1 font-semibold">
                    Founder & Authorised Owner
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC LEGAL AGREEMENT CONTRACT MODAL */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0 font-sans">
          <div className="printable-a4-sheet bg-white text-slate-900 w-full max-w-2xl sm:max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-amber-300/80 relative print:shadow-none print:border-none print:w-full print:rounded-none my-auto">
            
            <div className="no-print bg-stone-900 text-stone-100 px-4 sm:px-6 py-2.5 flex justify-between items-center border-b border-amber-500/30">
              <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                Official Legal Service Agreement Contract
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-amber-500 text-stone-950 font-black px-3 py-1 rounded-lg text-xs uppercase tracking-wider cursor-pointer hover:bg-amber-400 transition font-mono"
                >
                  🖨️ Save Contract PDF
                </button>
                <button
                  onClick={() => setShowContractModal(false)}
                  className="bg-stone-800 text-stone-300 font-bold px-3 py-1 rounded-lg text-xs cursor-pointer hover:bg-stone-700 transition font-mono"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 bg-white print:p-0 text-xs">
              
              <div className="flex justify-between items-start border-b-2 border-amber-600/30 pb-2.5 gap-2">
                <div>
                  <h1 className="text-lg sm:text-2xl font-serif font-black text-slate-900 uppercase">
                    VK_Creation Studio
                  </h1>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-700 tracking-wider uppercase">
                    Official Wedding Photography & Cinematography Service Contract
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-slate-600 font-mono">BiaoraMandu, Sarangpur, M.P. | 📞 +91 9644213129</p>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className="bg-amber-100 text-amber-900 font-bold text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full uppercase border border-amber-300">
                    Official Contract
                  </span>
                  <p className="text-xs font-black text-slate-900 pt-1">Ref: <span className="text-amber-700">{booking.bookingNumber}</span></p>
                  <p className="text-[9px] text-slate-500 font-medium">Event Date: {booking.eventDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase block font-mono">CLIENT DETAILS (ग्राहक का विवरण):</span>
                  <strong className="text-xs sm:text-sm font-extrabold text-slate-900 block">{booking.clientName}</strong>
                  <p className="text-[10px] text-slate-700 font-mono">Phone: +91 {booking.clientPhone}</p>
                  <p className="text-[10px] text-slate-700">Location / Venue: {booking.venue}</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-0.5 font-mono">
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase block font-sans">CONTRACT VALUATION (राशि का विवरण):</span>
                  <p className="text-[10px] text-slate-700">Total Contract Value: <strong className="text-slate-900 font-bold">₹{booking.totalAmount.toLocaleString('en-IN')}</strong></p>
                  <p className="text-[10px] font-extrabold text-emerald-800">Total Paid So Far: ₹{booking.advancePaid.toLocaleString('en-IN')} ✅</p>
                  <p className="text-[10px] font-extrabold text-amber-900">Remaining Balance: ₹{booking.remainingBalance.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-[10px] sm:text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-1 font-mono">
                  ⚖️ TERMS & CONDITIONS CLAUSES (नियम एवं अनुबंध शर्तें):
                </h3>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-[9px] sm:text-[10px] text-slate-700 leading-relaxed">
                  {termsList && termsList.length > 0 ? (
                    termsList.map((clause, idx) => (
                      <p key={idx} className="border-b border-slate-200/80 pb-1 last:border-none">
                        <strong>{idx + 1}.</strong> {clause}
                      </p>
                    ))
                  ) : (
                    <p className="text-slate-400 italic text-center py-2">
                      No active legal terms set by studio admin in Terms Manager.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-end">
                <div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase block font-mono">CLIENT ACCEPTANCE:</span>
                  <strong className="text-xs font-extrabold text-slate-900 block">{booking.clientName}</strong>
                  <span className="text-[9px] font-bold text-emerald-800 block font-mono">✓ Digitally Signed & Accepted Contract</span>
                </div>

                <div className="text-center space-y-0.5 shrink-0 font-mono">
                  {sealImage ? (
                    <img src={sealImage} alt="Official Seal" className="w-10 h-10 object-contain mx-auto" />
                  ) : (
                    <div className="w-10 h-10 rounded-full border border-dashed border-amber-700 mx-auto flex flex-col items-center justify-center p-0.5 text-[5px] font-bold text-amber-900 bg-amber-50 transform -rotate-6">
                      <span>👑 VK_CREATION</span>
                      <span className="text-[6px] font-black">OFFICIAL</span>
                      <span>SEAL STAMP</span>
                    </div>
                  )}
                  <p className="text-[9px] font-extrabold text-slate-900 uppercase pt-0.5">Ashutosh Vishwakarma</p>
                  <span className="text-[7px] text-slate-600 block -mt-1 font-semibold">Founder & Authorised Owner</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 🚀 AUTOMATED & DYNAMIC UPI PAYMENT MODAL */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/40 w-full max-w-md rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl relative text-stone-100 text-center my-auto font-sans">
            <div className="flex justify-between items-start border-b border-stone-800 pb-3">
              <div className="text-left">
                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest block font-mono">
                  INSTANT UPI GATEWAY
                </span>
                <h3 className="text-lg sm:text-xl font-black text-stone-100">
                  Pay Advance Amount
                </h3>
              </div>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-stone-400 hover:text-stone-100 font-bold p-1 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800 text-left space-y-1 text-xs">
              <p className="text-stone-400">Client: <strong className="text-stone-200">{booking.clientName}</strong></p>
              <p className="text-stone-400">Ref ID: <strong className="text-amber-400 font-mono">{booking.bookingNumber}</strong></p>
              <div className="border-t border-stone-800 pt-2 mt-2 flex justify-between text-xs sm:text-sm font-bold">
                <span>Active Advance Amount:</span>
                <span className="text-amber-400 text-base sm:text-lg font-mono">
                  ₹{currentAdvanceToPay.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800 space-y-2.5">
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono">
                Scan QR via Any App (GPay / PhonePe / Paytm):
              </p>

              <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white rounded-2xl mx-auto flex items-center justify-center border-4 border-amber-500/60 p-2 shadow-xl relative group">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                    `upi://pay?pa=${studioUpiId}&pn=${encodeURIComponent(studioPayeeName)}&am=${currentAdvanceToPay}&cu=INR&tn=BookingRef_${booking.bookingNumber}`
                  )}`}
                  alt="Payment UPI QR"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <span className="text-[10px] text-stone-400 block mb-0.5 font-mono">Official Studio Merchant UPI ID:</span>
                <div className="bg-stone-900 border border-stone-800 p-2 rounded-xl flex items-center justify-between font-mono text-xs max-w-xs mx-auto">
                  <span className="text-amber-400 font-bold truncate pr-2">{studioUpiId}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(studioUpiId);
                      alert('📋 UPI ID Copied to Clipboard!');
                    }}
                    className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-lg font-bold text-[10px] shrink-0 border border-stone-700 cursor-pointer font-mono"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                disabled={isSyncingPayment}
                onClick={handleConfirmPayment}
                className="w-full bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-stone-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-50 font-mono"
              >
                {isSyncingPayment ? '⏳ Syncing Payment...' : '📲 Confirm Payment'}
              </button>

              <button
                onClick={() => setShowPayModal(false)}
                className="w-full bg-stone-800 hover:bg-stone-700 text-stone-400 font-bold py-2.5 rounded-2xl text-xs transition cursor-pointer font-mono"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}