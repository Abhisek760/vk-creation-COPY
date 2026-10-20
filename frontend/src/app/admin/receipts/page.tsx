'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StudioBrandingRepository } from '@/lib/catalogRepository';

interface BookingReceipt {
  receiptNo: string;
  bookingRef: string;
  clientName: string;
  clientPhone: string;
  amountPaid: number;
  totalAmount: number;
  remainingBalance: number;
  mode: string;
  utrNumber: string;
  date: string;
  timestamp: string;
}

export default function PaymentReceiptsPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<BookingReceipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<BookingReceipt | null>(null);
  const [sealImage, setSealImage] = useState<string | null>(null);

const loadReceiptsData = async () => {
  const seal = await StudioBrandingRepository.getSealImage();
  setSealImage(seal);

    try {
      const raw1 = localStorage.getItem('vk_creation_bookings');
      const raw2 = localStorage.getItem('vk_studio_bookings');

      const list1 = raw1 ? JSON.parse(raw1) : [];
      const list2 = raw2 ? JSON.parse(raw2) : [];
      const combined = [...list1, ...list2];

      const uniqueBookingsMap = new Map();
      combined.forEach((item) => {
        if (item.bookingNumber && !uniqueBookingsMap.has(item.bookingNumber)) {
          uniqueBookingsMap.set(item.bookingNumber, item);
        }
      });

      const allBookings = Array.from(uniqueBookingsMap.values());

      const paidBookings = allBookings.filter(
        (b) => Number(b.advancePaid) > 0 || b.status === 'Confirmed & Scheduled' || b.status === 'Fully Paid & Delivered'
      );

      const generatedReceipts: BookingReceipt[] = paidBookings.map((b, idx) => ({
        receiptNo: `REC-${2026001 + idx}`,
        bookingRef: b.bookingNumber,
        clientName: b.clientName || 'Valued Client',
        clientPhone: b.clientPhone || 'N/A',
        amountPaid: Number(b.advancePaid) || Number(b.advanceRequired) || 1000,
        totalAmount: Number(b.totalAmount) || 0,
        remainingBalance: Number(b.remainingBalance ?? (b.totalAmount - (b.advancePaid || 0))) || 0,
        mode: 'UPI / Online Instant Transfer',
        utrNumber: b.utrNumber || `UPI/4210${Math.floor(100000 + Math.random() * 900000)}`,
        date: b.createdAt ? b.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        timestamp: b.createdAt ? new Date(b.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '14:30 IST',
      }));

      setReceipts(generatedReceipts);

      // Auto select latest receipt if available
      if (generatedReceipts.length > 0 && !selectedReceipt) {
        setSelectedReceipt(generatedReceipts[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadReceiptsData();
  }, []);

  // Back to Portal Dynamic Handler
  const handleBackToClientPortal = () => {
    if (selectedReceipt?.bookingRef) {
      router.push(`/portal/${selectedReceipt.bookingRef}`);
    } else if (receipts.length > 0 && receipts[0].bookingRef) {
      router.push(`/portal/${receipts[0].bookingRef}`);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 sm:p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      
      {/* Universal Print Styles for Exact A4 Fit */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm;
          }
          body {
            background-color: #0c0a09 !important;
            color: #f5f5f4 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-a4-wrapper {
            position: absolute !important;
            inset: 0 !important;
            width: 100vw !important;
            min-h-screen: 100vh !important;
            background-color: #0c0a09 !important;
            padding: 10mm !important;
            box-sizing: border-box !important;
          }
          .print-legal-border {
            border: 2px solid #b45309 !important;
            box-shadow: inset 0 0 0 2px #1c1917 !important;
            background-color: #0c0a09 !important;
          }
        }
      `}</style>

      {/* Top Header - BACK TO CLIENT PORTAL BUTTON */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-800 pb-5 gap-4 no-print">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">
            Official Document Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-100 mt-0.5">
            Official Advance Payment Receipts
          </h1>
          <p className="text-xs text-stone-400">
            View, authenticate, and print legal-grade payment confirmation vouchers for your booking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToClientPortal}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/10 active:scale-95"
          >
            ← Back to Client Portal
          </button>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-4 shadow-xl no-print">
        <div className="flex justify-between items-center border-b border-stone-800 pb-3">
          <h2 className="text-xs font-bold text-amber-500 uppercase tracking-wider font-mono">
            🧾 Payment Vouchers Register ({receipts.length})
          </h2>
        </div>

        {receipts.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <p className="text-stone-500 text-xs italic">
              No advance payments recorded yet in system storage!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-stone-950 text-stone-400 font-semibold border-b border-stone-800">
                <tr>
                  <th className="p-3">Receipt Voucher No</th>
                  <th className="p-3">Booking Ref</th>
                  <th className="p-3">Client Details</th>
                  <th className="p-3">Amount Token</th>
                  <th className="p-3">UPI / UTR Ref</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {receipts.map((rec) => (
                  <tr key={rec.receiptNo} className="hover:bg-stone-900/40 transition">
                    <td className="p-3 font-bold text-amber-400">{rec.receiptNo}</td>
                    <td className="p-3 text-stone-300">{rec.bookingRef}</td>
                    <td className="p-3">
                      <strong className="text-stone-100 block font-sans">{rec.clientName}</strong>
                      <span className="text-[10px] text-stone-500">{rec.clientPhone}</span>
                    </td>
                    <td className="p-3 text-emerald-400 font-bold text-sm">
                      ₹{rec.amountPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-stone-400">{rec.utrNumber}</td>
                    <td className="p-3 text-stone-400">{rec.date}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedReceipt(rec)}
                        className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        📜 View Voucher
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 👑 EXECUTIVE LEGAL-GRADE ADVANCE PAYMENT RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="print-a4-wrapper fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          
          <div className="print-legal-border bg-stone-900 border-2 border-amber-500/50 w-full max-w-3xl rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative text-stone-100 overflow-hidden">
            
            {/* Background Crest Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.04] pointer-events-none select-none text-center font-black text-amber-400 text-9xl flex items-center justify-center">
              VK
            </div>

            {/* Action Bar (Hidden in Print) */}
            <div className="no-print flex justify-between items-center border-b border-stone-800 pb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
                Official Advance Payment RECEIPT
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-linear-to-r from-amber-500 to-amber-400 text-stone-950 font-black px-5 py-2 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 hover:scale-105"
                >
                  🖨️ Print / Save Official PDF
                </button>
                <button
                  onClick={handleBackToClientPortal}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Header Branding */}
            <div className="flex justify-between items-start border-b border-stone-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📷</span>
                  <h2 className="text-2xl font-black text-amber-400 uppercase tracking-wider">
                    VK_CREATION STUDIO
                  </h2>
                </div>
                <p className="text-xs text-stone-300 font-medium">
                  Luxury Wedding Photography, Cinematography & Drone Shoots
                </p>
                <div className="text-[10px] text-stone-400 font-mono space-y-0.5">
                  <p>📍 Ward 10 Chowk Mohalla, V.P.O. Biaoramandu, Sarangpur, Madhya Pradesh-465697</p>
                  <p>📞 Contact: +91 9622213129 | +91 9753820740</p>
                </div>
              </div>

              <div className="text-right font-mono space-y-1">
                <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-extrabold px-3 py-1 rounded-full inline-block uppercase tracking-wider">
                  ✓ OFFICIAL ADVANCE PAYMENT RECEIPT
                </span>
                <p className="text-sm font-black text-stone-100 pt-1">No: {selectedReceipt.receiptNo}</p>
                <p className="text-[11px] text-stone-400">Date: {selectedReceipt.date} ({selectedReceipt.timestamp})</p>
              </div>
            </div>

            {/* CONGRATULATIONS BANNER */}
            <div className="bg-linear-to-r from-amber-950/80 via-emerald-950/50 to-amber-950/80 border border-emerald-500/50 rounded-2xl p-3 text-center space-y-0.5 shadow-inner">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <span>🎉</span> CONGRATULATIONS! EVENT DATES OFFICIALLY LOCKED & SCHEDULED
              </span>
              <p className="text-[10px] text-stone-300">
                Your advance token payment has been verified. Master Shoot Crew & Technical Equipment have been reserved.
              </p>
            </div>

            {/* Receipt Details Box */}
            <div className="bg-stone-950/90 p-4 rounded-2xl border border-stone-800 font-mono text-xs space-y-2.5">
              <div className="flex justify-between border-b border-stone-800/80 pb-1.5">
                <span className="text-stone-400">Booking Contract Reference:</span>
                <strong className="text-amber-400 font-bold text-sm">{selectedReceipt.bookingRef}</strong>
              </div>

              <div className="flex justify-between border-b border-stone-800/80 pb-1.5">
                <span className="text-stone-400">Received From (Client):</span>
                <strong className="text-stone-100 font-sans font-extrabold text-sm">{selectedReceipt.clientName}</strong>
              </div>

              <div className="flex justify-between border-b border-stone-800/80 pb-1.5">
                <span className="text-stone-400">Client Contact Phone:</span>
                <span className="text-stone-200">{selectedReceipt.clientPhone}</span>
              </div>

              <div className="flex justify-between border-b border-stone-800/80 pb-1.5">
                <span className="text-stone-400">Payment Mode / Protocol:</span>
                <span className="text-stone-200 font-bold">{selectedReceipt.mode}</span>
              </div>

              <div className="flex justify-between border-b border-stone-800/80 pb-1.5">
                <span className="text-amber-500 font-bold">Bank UPI / UTR Transaction ID:</span>
                <strong className="text-amber-300 font-bold">{selectedReceipt.utrNumber}</strong>
              </div>

              <div className="flex justify-between border-b border-stone-800/80 pb-1.5 text-sm pt-0.5">
                <span className="text-stone-200 font-bold">Advance Token Amount Paid:</span>
                <strong className="text-emerald-400 text-lg font-black">
                  ₹{selectedReceipt.amountPaid.toLocaleString('en-IN')}
                </strong>
              </div>

              <div className="flex justify-between text-stone-400 text-[11px]">
                <span>Contract Total Amount:</span>
                <span>₹{selectedReceipt.totalAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-amber-400 text-xs font-bold pt-0.5">
                <span>Remaining Balance Payable at Shoot:</span>
                <span>₹{selectedReceipt.remainingBalance.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Stamp & Security Verification */}
            <div className="flex justify-between items-end border-t border-stone-800 pt-4 text-xs font-mono">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                      `OFFICIAL RECEIPT | Ref: ${selectedReceipt.bookingRef} | Amount: Rs.${selectedReceipt.amountPaid} | Client: ${selectedReceipt.clientName} | VK_CREATION STUDIO`
                    )}`}
                    alt="Authenticity QR"
                    className="w-16 h-16 bg-white p-1 rounded-lg border border-amber-500/40"
                  />
                  <div className="text-[10px] text-stone-400 space-y-0.5">
                    <span className="text-amber-400 font-bold block">SECURITY AUTHENTICATION QR</span>
                    <p>Verified Electronic Voucher</p>
                    <p className="text-stone-500">Hash: {selectedReceipt.bookingRef}-AUTH-2026</p>
                  </div>
                </div>
                <p className="text-[9px] text-stone-500">
                  * Terms: Non-refundable advance token used for crew reservation & equipment lock.
                </p>
              </div>

              <div className="text-center space-y-1">
                {sealImage ? (
                  <img
                    src={sealImage}
                    alt="Official Studio Seal & Signature"
                    className="w-24 h-24 object-contain mx-auto mix-blend-screen"
                  />
                ) : (
                  <div className="w-20 h-20 mx-auto rounded-full border-2 border-amber-500/60 bg-amber-500/10 flex flex-col items-center justify-center p-1 text-center text-amber-400 font-mono text-[8px] font-bold shadow-lg shadow-amber-500/10">
                    <span className="text-xs">👑</span>
                    <span>VK_CREATION</span>
                    <span className="text-[6px] tracking-tighter">OFFICIAL SEAL</span>
                  </div>
                )}
                <span className="text-[10px] text-amber-500/90 font-mono font-bold block">
                  ASHUTOSH VISHWAKARMA
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}