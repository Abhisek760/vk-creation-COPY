'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { DocumentRepository } from '@/lib/documentRepository';
import { CurrencyFormatter } from '@/lib/currency';
import { EmptyState } from '@/components/common/EmptyState';

interface StudioReceiptType {
  receiptNumber: string;
  bookingNumber: string;
  clientName: string;
  clientPhone?: string;
  amountPaid: number;
  paymentDate: string;
  paymentMode: string;
  transactionRef: string;
}

export default function ReceiptDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const receiptNumber = params?.receiptNumber as string;
  const isClientMode = searchParams.get('mode') === 'client';

  const [receipt, setReceipt] = useState<StudioReceiptType | null>(null);

  useEffect(() => {
    if (receiptNumber) {
      const found: any = DocumentRepository.getReceipt(receiptNumber);
      setReceipt(found);
    }
  }, [receiptNumber]);

  if (!receipt) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4">
        <EmptyState
          title="Payment Receipt Not Found"
          description={`No receipt voucher matching "${receiptNumber}" was found.`}
          actionLabel={isClientMode ? "Back to Portal" : "Back to Receipts"}
          onAction={() => router.push(isClientMode ? `/portal/${receiptNumber}` : '/admin/receipts')}
        />
      </div>
    );
  }

  const handleBackNavigation = () => {
    if (isClientMode) {
      router.push(`/portal/${receipt.bookingNumber}`);
    } else {
      router.push('/admin/receipts');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-3 sm:p-6 md:p-10 space-y-4 sm:space-y-6 max-w-4xl mx-auto font-sans">
      
      {/* 🖨️ PERFECT SINGLE-PAGE PRINT & MOBILE CSS */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }
          *, *::before, *::after {
            box-shadow: none !important;
            text-shadow: none !important;
          }
          html, body {
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .printable-sheet {
            background-color: #ffffff !important;
            background: #ffffff !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 10mm 12mm !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
          }
        }
      `}</style>

      {/* Action Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-4 gap-3">
        <div>
          <span className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase tracking-widest block font-mono">
            {isClientMode ? 'VK Creation Studio — VIP Portal' : 'Financial Receipt Voucher'}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-100 mt-0.5">
            Payment Receipt #{receipt.receiptNumber}
          </h1>
        </div>

        <div className="flex gap-2.5 items-center self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-stone-950 transition shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            🖨️ Print / Save PDF
          </button>

          <button
            onClick={handleBackNavigation}
            className="rounded-xl border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-800 transition cursor-pointer"
          >
            {isClientMode ? '← Back to Portal' : '← Back to Receipts'}
          </button>
        </div>
      </div>

      {/* Printable Receipt Voucher */}
      <div className="printable-sheet bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 print:bg-white print:text-black print:border-none print:p-0">
        
        {/* Header Section */}
        <div className="flex justify-between items-start border-b border-stone-800 print:border-gray-300 pb-4 sm:pb-6 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-amber-500 print:text-amber-700 uppercase tracking-wider">
              👑 VK CREATION STUDIO
            </h2>
            <p className="text-[10px] sm:text-xs text-stone-400 print:text-gray-600 mt-0.5">
              Official Payment Voucher (भुगतान रसीद)
            </p>
            <p className="text-[9px] text-stone-500 print:text-gray-500 hidden sm:block">
              Biaoramandu, Sarangpur, M.P. | 📞 +91 9644213129
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 print:bg-emerald-100 print:text-emerald-900 print:border-emerald-300 uppercase">
              ✓ Payment Confirmed
            </span>
            <p className="text-xs font-mono text-stone-300 print:text-gray-800 pt-1.5">
              Receipt #: <strong>{receipt.receiptNumber}</strong>
            </p>
            <p className="text-[10px] sm:text-xs text-stone-400 print:text-gray-600">
              Date: {receipt.paymentDate}
            </p>
          </div>
        </div>

        {/* Client & Transaction Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs bg-stone-950 print:bg-gray-50 p-3.5 sm:p-4 rounded-xl border border-stone-800/80 print:border-gray-200">
          <div className="space-y-0.5">
            <span className="text-[10px] text-stone-500 print:text-gray-500 uppercase font-bold block">Received From : </span>
            <strong className="text-stone-100 print:text-black text-sm block">{receipt.clientName}</strong>
            <p className="text-stone-400 print:text-gray-700 text-xs">Phone: {receipt.clientPhone || 'N/A'}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-stone-500 print:text-gray-500 uppercase font-bold block">Booking Reference:</span>
            <strong className="text-amber-400 print:text-amber-700 font-mono text-sm block">{receipt.bookingNumber}</strong>
            <p className="text-stone-400 print:text-gray-700 text-xs">Payment Mode: {receipt.paymentMode}</p>
            <p className="text-stone-400 print:text-gray-700 text-xs font-mono">Txn Ref: {receipt.transactionRef}</p>
          </div>
        </div>

        {/* Amount Summary */}
        <div className="border-t border-b border-stone-800 print:border-gray-300 py-3 sm:py-4 flex justify-between items-center text-xs sm:text-sm bg-stone-950/40 print:bg-amber-50/50 px-3 rounded-lg">
          <span className="font-bold text-stone-300 print:text-black">
            Amount Received (प्राप्त राशि):
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 print:text-emerald-700 font-mono">
            {CurrencyFormatter.formatINR(receipt.amountPaid)}
          </span>
        </div>

        {/* Footer Authorization */}
        <div className="pt-2 flex justify-between items-end text-[10px] text-stone-500 print:text-gray-500">
          <div>
            <p className="font-bold text-stone-400 print:text-gray-700 uppercase">VK_CREATION STUDIO OFFICIAL RECEIPT</p>
            <p className="text-[9px]">*This is an electronic ledger record for booking token settlement.</p>
          </div>

          <div className="text-center shrink-0">
            <p className="text-[10px] font-extrabold text-stone-200 print:text-black uppercase">ASHUTOSH VISHWAKARMA</p>
            <span className="text-[8px] text-stone-500 print:text-gray-600 block">Authorized Signatory</span>
          </div>
        </div>

      </div>
    </div>
  );
}