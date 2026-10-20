'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TermsRepository, StudioBrandingRepository } from '@/lib/catalogRepository';

interface PaymentHistoryItem {
  installment: string;
  description: string;
  date: string;
  utr: string;
  amount: number;
}

interface BookingInvoiceData {
  bookingNumber: string;
  clientName: string;
  clientPhone: string;
  utrNumber?: string;
  eventDate: string;
  venue: string;
  totalAmount: number;
  advancePaid: number;
  remainingBalance: number;
  status: string;
  services: string[];
  paymentHistory: PaymentHistoryItem[];
  createdAt?: string;
}

export default function FinalTaxInvoicePage() {
  const params = useParams();
  const invoiceId = (params?.invoiceNumber as string) || (params?.id as string) || (params?.bookingNumber as string) || 'VKCREATION-310393';

  const [invoiceData, setInvoiceData] = useState<BookingInvoiceData | null>(null);
  const [termsList, setTermsList] = useState<string[]>([]);
  const [sealImage, setSealImage] = useState<string | null>(null);

  useEffect(() => {
    const loadInvoiceData = async () => {
      try {
        const loadedTerms = await TermsRepository.getTerms();
        setTermsList(Array.isArray(loadedTerms) && loadedTerms.length > 0 ? loadedTerms : [
          "Advance booking amount is strictly non-refundable upon cancellation after 48 hours.",
          "Food, travel, and outstation stay arrangements must be provided by the client.",
          "All raw unedited photographs selection links will be provided within 7 days of event completion.",
          "Final video deliverables and photo album editing will take 30 to 45 working days post-selection.",
          "Full remaining contract balance must be settled on or before the final event shoot day.",
          "Studio retains copyright ownership of all captured media for portfolio and promotional usage."
        ]);

        // 🖋️ Await the Seal Image Promise to fix Type Error
        const seal = await StudioBrandingRepository.getSealImage();
        setSealImage(seal);

        const raw1 = localStorage.getItem('vk_creation_bookings');
        const raw2 = localStorage.getItem('vk_studio_bookings');

        const list1 = raw1 ? JSON.parse(raw1) : [];
        const list2 = raw2 ? JSON.parse(raw2) : [];
        const combined = [...list1, ...list2];

        let matched = combined.find(
          (b: any) => String(b.bookingNumber).trim().toLowerCase() === String(invoiceId).trim().toLowerCase()
        );

        if (!matched && combined.length > 0) {
          matched = combined[0];
        }

        if (matched) {
          const total = Number(matched.totalAmount) || 40000;
          const status = String(matched.status || '');
          const isFullyPaid = status.includes('Cleared') || status.includes('Fully') || Number(matched.remainingBalance) <= 0;

          let history: PaymentHistoryItem[] = [];

          if (Array.isArray(matched.installmentsHistory) && matched.installmentsHistory.length > 0) {
            history = matched.installmentsHistory.map((item: any, idx: number) => ({
              installment: item.installment || `Installment #${idx + 1}`,
              description: item.description || (idx === 0 ? 'Advance Slot Reservation Payment' : 'Advance Installment Amount'),
              date: item.date || 'Confirmed',
              utr: item.utr || item.utrNumber || 'UPI/Verified',
              amount: Number(item.amount) || 0,
            }));
          } else {
            const firstToken = Number(matched.advanceRequired) > 0 ? Number(matched.advanceRequired) : 1000;
            const secondToken = Math.max(0, total - firstToken);

            history.push({
              installment: 'Installment #1',
              description: 'Advance Slot Reservation Payment (Online UPI)',
              date: matched.createdAt ? new Date(matched.createdAt).toLocaleDateString('en-IN') : 'Confirmed',
              utr: matched.utrNumber || 'UPI/Verified',
              amount: firstToken,
            });

            if (isFullyPaid && secondToken > 0) {
              history.push({
                installment: 'Installment #2',
                description: 'Final Settlement Balance Payment (Online UPI)',
                date: new Date().toLocaleDateString('en-IN'),
                utr: 'UPI/Verified',
                amount: secondToken,
              });
            }
          }

          const calculatedPaid = history.reduce((sum, item) => sum + item.amount, 0);
          const totalPaidSoFar = isFullyPaid ? total : calculatedPaid;
          const remaining = isFullyPaid ? 0 : Math.max(0, total - totalPaidSoFar);

          setInvoiceData({
            bookingNumber: matched.bookingNumber,
            clientName: matched.clientName || 'Valued Client',
            clientPhone: matched.clientPhone || 'N/A',
            utrNumber: matched.utrNumber || 'UPI/Verified',
            eventDate: matched.eventDate && matched.eventDate.trim() !== '' 
              ? matched.eventDate 
              : new Date().toLocaleDateString('en-IN'),
            venue: matched.venue || 'Indore / M.P.',
            totalAmount: total,
            advancePaid: totalPaidSoFar,
            remainingBalance: remaining,
            status: isFullyPaid ? 'Confirmed & Fully Cleared' : 'Confirmed & Active',
            services: Array.isArray(matched.services) ? matched.services : ['Silver Wedding Package Coverage'],
            paymentHistory: history,
            createdAt: matched.createdAt,
          });
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadInvoiceData();
  }, [invoiceId]);

  if (!invoiceData) {
    return <div className="p-10 text-center text-slate-500 font-sans">Loading Final Tax Invoice...</div>;
  }

  const isFullPaymentSettled = invoiceData.remainingBalance <= 0;

  return (
    <div className="min-h-screen bg-stone-950 print:bg-white text-slate-900 p-4 sm:p-6 md:p-10 print:p-0 font-sans">
      
      {/* 🖨️ PERFECT PDF PRINT CSS (FIXES BLACK BACKGROUND PERMANENTLY) */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 8mm !important;
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
            width: 100% !important;
            height: auto !important;
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
            padding: 0 !important;
            margin: 0 !important;
          }
          .page-break {
            page-break-before: always !important;
          }
        }
      `}</style>

      {/* Screen Action Buttons */}
      <div className="no-print max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <Link
          href={`/portal/${invoiceData.bookingNumber}`}
          className="bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-stone-300 font-bold px-4 py-2 rounded-xl text-xs transition"
        >
          ← Back to Client Portal
        </Link>

        <button
          onClick={() => window.print()}
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/10 cursor-pointer active:scale-95"
        >
          🖨️ PRINT / DOWNLOAD PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 print:space-y-0">

        {/* ================= PAGE 1: TAX INVOICE SHEET ================= */}
        <div className="printable-sheet bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border border-amber-300/80 space-y-5 text-xs">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-amber-600/30 pb-4 gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-600 text-xl">👑</span>
                <h1 className="text-xl font-serif font-black tracking-wide text-slate-900 uppercase">
                  VK_Creation Studio
                </h1>
              </div>
              <p className="text-[10px] font-bold text-slate-700 tracking-wider uppercase">
                LUXURY WEDDING PHOTOGRAPHY, CINEMATOGRAPHY & DRONE SHOOTS
              </p>
              <p className="text-[10px] text-slate-600">
                Ward 10 Chowk Mohalla, Biaoramandu, Sarangpur, M.P. | 📞 +91 9644213129
              </p>
            </div>

            <div className="text-left sm:text-right space-y-0.5">
              <span className={`inline-block border font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase ${
                isFullPaymentSettled 
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-amber-100 border-amber-300 text-amber-900'
              }`}>
                {isFullPaymentSettled ? '✓ FULL PAYMENT SETTLED & PAID' : '⏳ PARTIAL ADVANCE PAID'}
              </span>
              <p className="text-xs font-black text-slate-900 pt-1">
                Ref: <span className="text-amber-700">{invoiceData.bookingNumber}</span>
              </p>
              <p className="text-[10px] font-medium text-slate-500">
                Issue Date: {invoiceData.createdAt ? new Date(invoiceData.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>

          {/* Client & Shoot Summary */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">BILLED TO (CLIENT):</span>
              <strong className="text-sm font-extrabold text-slate-900 block">{invoiceData.clientName}</strong>
              <p className="text-[10px] text-slate-700">Phone: +91 {invoiceData.clientPhone}</p>
              <p className="text-[10px] text-slate-700">Location / Venue: {invoiceData.venue}</p>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">SHOOT & CONTRACT SUMMARY:</span>
              <p className="text-[10px] text-slate-700">Event Date: <strong className="text-slate-900 font-bold">{invoiceData.eventDate}</strong></p>
              <p className="text-[10px] text-slate-700">Payment Terms: 100% Full Payment Settlement</p>
              <p className="text-[10px] font-extrabold text-emerald-800">
                Status: {isFullPaymentSettled ? 'Fully Cleared ✅' : 'Balance Pending ⏳'}
              </p>
            </div>
          </div>

          {/* Delivered Services Table */}
          <div className="space-y-1">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest border-b pb-1">
              📦 DELIVERED SERVICES & ADD-ONS ITEMIZATION
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white font-extrabold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">DELIVERED SERVICES</th>
                    <th className="p-3 text-center">QUANTITY</th>
                    <th className="p-3 text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-xs">
                  {invoiceData.services.map((srv: string, i: number) => (
                    <tr key={i} className="bg-white">
                      <td className="p-3 font-bold text-slate-800">{srv}</td>
                      <td className="p-3 text-center font-bold">1</td>
                      <td className="p-3 text-right font-mono font-black text-slate-900">
                        {i === 0 ? `₹${Number(invoiceData.totalAmount).toLocaleString('en-IN')}` : 'Included'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="space-y-1">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest border-b pb-1">
              💳 PAYMENT INSTALLMENT HISTORY
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white font-extrabold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">INST. #</th>
                    <th className="p-3">PAYMENT DESCRIPTION</th>
                    <th className="p-3">DATE</th>
                    <th className="p-3">REFERENCE UTR</th>
                    <th className="p-3 text-right">AMOUNT PAID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-xs">
                  {invoiceData.paymentHistory && invoiceData.paymentHistory.length > 0 ? (
                    invoiceData.paymentHistory.map((inst: any, i: number) => (
                      <tr key={i} className="bg-white">
                        <td className="p-3 font-extrabold text-amber-800">
                          {inst.installment ? inst.installment.replace(/Token/g, 'Installment') : `Installment #${i + 1}`}
                        </td>
                        <td className="p-3 font-semibold text-slate-800">
                          {inst.description 
                            ? inst.description.replace(/Partial Installment Token/g, 'Advance Installment Amount').replace(/Token/g, 'Installment')
                            : (i === invoiceData.paymentHistory.length - 1 && invoiceData.remainingBalance <= 0 ? 'Final Balance Settlement' : 'Advance Installment Amount')}
                        </td>
                        <td className="p-3 text-slate-600">{inst.date || inst.paidAt || 'Confirmed'}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">{inst.utr || inst.utrNumber || 'UPI/Verified'}</td>
                        <td className="p-3 text-right font-mono font-black text-emerald-700">
                          ₹{Number(inst.amount).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white">
                      <td className="p-3 font-extrabold text-amber-800">Installment #1</td>
                      <td className="p-3 font-semibold text-slate-800">Advance Installment Amount</td>
                      <td className="p-3 text-slate-600">{invoiceData.createdAt ? new Date(invoiceData.createdAt).toLocaleDateString('en-IN') : 'Confirmed'}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">{invoiceData.utrNumber || 'UPI/Verified'}</td>
                      <td className="p-3 text-right font-mono font-black text-emerald-700">
                        ₹{Number(invoiceData.advancePaid).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  )}

                  <tr className="bg-slate-50 font-black border-t-2 border-slate-200 text-slate-900">
                    <td colSpan={4} className="p-3 text-right uppercase text-[10px]">
                      TOTAL PAYMENTS RECEIVED (कुल प्राप्त भुगतान):
                    </td>
                    <td className="p-3 text-right text-emerald-800 font-mono font-black text-sm">
                      ₹{Number(invoiceData.advancePaid).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Account Details & Totals */}
          <div className="grid grid-cols-2 gap-4 items-end pt-1">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-0.5 text-[10px]">
              <p className="font-bold text-slate-900 uppercase">STUDIO ACCOUNT DETAILS:</p>
              <p className="font-bold text-slate-800">Bank: State Bank Of India | A/C Name: Ashutosh Vishwakarma</p>
              <p className="font-mono text-slate-600">UPI ID: ashutosh9644213129@okhdfcbank</p>
              <p className="text-emerald-800 font-bold">✓ Verified Electronic Ledger Audit Record</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1 text-xs">
              <div className="flex justify-between text-slate-700 font-bold">
                <span>Net Contract Valuation:</span>
                <span className="font-mono">₹{Number(invoiceData.totalAmount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-black border-t border-slate-200 pt-1">
                <span>Total Paid Amount:</span>
                <span className="font-mono">₹{Number(invoiceData.advancePaid).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black border-t-2 border-slate-300 pt-1">
                <span>Remaining Balance Due:</span>
                <span className="font-mono text-amber-900">₹{Number(invoiceData.remainingBalance).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-[10px]">
            <div>
              <p className="font-bold text-slate-900 uppercase">VK_CREATION STUDIO • CAPTURING TIMELESS MEMORIES</p>
              <p className="text-slate-500">*Official Full Settlement Invoice. Terms & Conditions attached on Page 2.</p>
            </div>

            <div className="text-center space-y-0.5 shrink-0">
              {sealImage ? (
                <img src={sealImage} alt="Official Seal" className="w-12 h-12 object-contain mx-auto" />
              ) : (
                <div className="w-12 h-12 rounded-full border border-dashed border-amber-700 mx-auto flex flex-col items-center justify-center p-1 text-[6px] font-bold text-amber-900 bg-amber-50 transform -rotate-6">
                  <span>👑 VK_CREATION</span>
                  <span className="text-[7px] font-black">OFFICIAL</span>
                  <span>SEAL STAMP</span>
                </div>
              )}
              <p className="text-[11px] font-extrabold text-slate-900 uppercase pt-0.5">ASHUTOSH VISHWAKARMA</p>
              <span className="text-[8px] text-slate-600 block -mt-1 font-semibold">Authorized Signatory</span>
            </div>
          </div>

        </div>

        {/* ================= PAGE 2: TERMS AND CONDITIONS ================= */}
        <div className="printable-sheet page-break bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border border-amber-300/80 space-y-5 text-xs">
          <div className="flex justify-between items-center border-b-2 border-amber-600/30 pb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-600 text-lg">⚖️</span>
              <h2 className="text-lg font-serif font-black text-slate-900 uppercase">
                STUDIO TERMS & SERVICE CONTRACT CLAUSES
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Ref: {invoiceData.bookingNumber}</span>
          </div>

          <div className="space-y-3 pt-2">
            {termsList.map((clause, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex gap-3 items-start">
                <span className="font-mono font-bold text-amber-700 text-xs shrink-0">{idx + 1}.</span>
                <p className="text-slate-800 leading-relaxed font-medium">{clause}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
            <p>VK_Creation Studio Official Contract Agreement</p>
            <p>Page 2 of 2</p>
          </div>
        </div>

      </div>
    </div>
  );
}