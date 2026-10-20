'use client';

import React from 'react';

interface ReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    bookingNumber: string;
    clientName: string;
    clientPhone?: string;
    eventDate?: string;
    totalAmount: number;
    advancePaid: number;
    remainingBalance: number;
    utrTransactionId?: string;
    dateOfPayment?: string;
  };
}

export default function AdvanceReceiptModal({
  isOpen,
  onClose,
  bookingData,
}: ReceiptProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = bookingData.dateOfPayment || new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      
      {/* 👑 LUXURY A4 CONTAINER (PDF Ready & Printable) */}
      <div className="bg-white text-stone-900 w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-amber-200 relative print:shadow-none print:border-none print:w-full print:max-w-none print:rounded-none">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-stone-900 text-stone-100 px-6 py-4 flex justify-between items-center print:hidden border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Official Advance Token Receipt
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              🖨️ Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* 📜 LUXURY A4 PAPER CONTENT */}
        <div className="p-8 sm:p-12 space-y-8 bg-[radial-gradient(#f5f5f4_1px,transparent_1px)] bg-size:[16px_16px] print:bg-white print:p-8">
          
          {/* Header Strip & Studio Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-amber-600/30 pb-6 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-amber-600 text-xl">👑</span>
                <h1 className="text-2xl font-serif font-black tracking-wider text-stone-900 uppercase">
                  VK_Creation Studio
                </h1>
              </div>
              <p className="text-[11px] text-stone-600 font-medium tracking-wide uppercase">
                Luxury Wedding Photography & Cinematography
              </p>
              <p className="text-[10px] text-stone-500 font-mono">
                Ward 10 Chowk Mohalla, Biaoramandu, Sarangpur, M.P. | +91 9644213129
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                ✓ Payment Verified & Locked
              </span>
              <p className="text-xs font-mono font-bold text-stone-800 pt-1">
                Receipt Ref: <span className="text-amber-700">{bookingData.bookingNumber}</span>
              </p>
              <p className="text-[11px] font-mono text-stone-500">Date: {currentDate}</p>
            </div>
          </div>

          {/* Announcement Banner */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-center space-y-0.5">
            <h2 className="text-xs font-bold text-amber-900 uppercase tracking-widest font-mono">
              🎉 Official Event Slot Booking Confirmed
            </h2>
            <p className="text-[11px] text-stone-600">
              Your advance token payment has been verified. Master Shoot Crew & Technical Equipment reserved.
            </p>
          </div>

          {/* Key Particulars */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest border-b border-stone-200 pb-1">
              Transaction & Client Particulars
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] text-stone-400 font-mono uppercase block">Received From (Client):</span>
                <strong className="text-sm font-bold text-stone-800 block">{bookingData.clientName || 'Groom & Bride'}</strong>
                <span className="text-[11px] text-stone-500 font-mono">📞 {bookingData.clientPhone || 'Verified Contact'}</span>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] text-stone-400 font-mono uppercase block">Payment Method & UTR:</span>
                <strong className="text-xs font-mono font-bold text-stone-800 block">
                  {bookingData.utrTransactionId || 'UPI / Online Instant Transfer'}
                </strong>
                <span className="text-[11px] text-emerald-700 font-medium">Verified Electronic Voucher</span>
              </div>
            </div>
          </div>

          {/* Payment Financial Breakdown */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-stone-100 border-b border-stone-200 text-stone-600 font-mono uppercase">
                <tr>
                  <th className="p-3.5">Financial Summary Item</th>
                  <th className="p-3.5 text-right">Valuation Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="p-3.5 font-medium text-stone-700">Contract Total Valuation</td>
                  <td className="p-3.5 text-right font-mono font-bold text-stone-800">
                    ₹{bookingData.totalAmount?.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="bg-amber-50/50">
                  <td className="p-3.5 font-bold text-amber-900">
                    Advance Token Payment Received (Confirmed)
                  </td>
                  <td className="p-3.5 text-right font-mono font-black text-emerald-700 text-sm">
                    ₹{bookingData.advancePaid?.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="p-3.5 font-bold text-stone-800">
                    Remaining Balance Payable At Shoot Event
                  </td>
                  <td className="p-3.5 text-right font-mono font-black text-amber-800 text-sm">
                    ₹{bookingData.remainingBalance?.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Seals & Verification */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center text-xl">
                🔒
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-stone-700 uppercase">
                  Verified Digital Document
                </p>
                <p className="text-[9px] text-stone-400 leading-tight max-w-xs">
                  *Non-refundable advance token used explicitly for shoot crew reservation & gear lock.
                </p>
              </div>
            </div>

            {/* Official Studio Stamp Seal */}
            <div className="text-center space-y-1">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-600/60 mx-auto flex flex-col items-center justify-center p-2 text-[8px] font-mono text-amber-800 font-bold bg-amber-50/50 transform -rotate-6">
                <span>👑 VK_CREATION</span>
                <span className="text-[10px] font-black">OFFICIAL</span>
                <span>SEAL STAMP</span>
              </div>
              <p className="text-[10px] font-mono font-bold text-stone-700 uppercase pt-1">
                Ashutosh Vishwakarma
              </p>
              <span className="text-[9px] text-stone-400 block -mt-1">Authorized Signatory</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}