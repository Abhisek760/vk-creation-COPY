'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PaymentLedger } from '@/types/payment';
import { PaymentRepository } from '@/lib/paymentRepository';

export default function BookingPaymentHistoryPage() {
  const params = useParams();
  const bookingNumber = params.bookingNumber as string;

  const [ledger, setLedger] = useState<PaymentLedger | null>(null);

  useEffect(() => {
    if (bookingNumber) {
      const data = PaymentRepository.getLedgerByBookingNumber(bookingNumber);
      setLedger(data);
    }
  }, [bookingNumber]);

  if (!ledger) {
    return (
      <div className="min-h-screen bg-stone-950 p-10 text-stone-100 flex flex-col items-center justify-center">
        <p className="text-stone-400 text-sm">Payment ledger not found for booking reference {bookingNumber}.</p>
        <Link href="/admin/payments" className="mt-4 text-amber-500 font-bold hover:underline">
          ← Back to All Payments
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6 md:p-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-stone-100">{ledger.customerName}</h1>
            <span className="font-mono text-amber-500 font-bold bg-stone-900 border border-stone-800 px-3 py-1 rounded-lg text-sm">
              {ledger.bookingNumber}
            </span>
          </div>
          <p className="text-sm text-stone-400 mt-1">
            {ledger.eventType} • Event Date: {ledger.eventDate} • Due Date: {ledger.dueDate}
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href={PaymentRepository.generateWhatsAppReminderLink(ledger)}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 transition"
          >
            💬 Send WhatsApp Payment Request
          </a>
          <Link
            href="/admin/payments"
            className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-200 hover:bg-stone-800"
          >
            ← Back to Payments
          </Link>
        </div>
      </div>

      {/* Contract & Balance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-1">
          <span className="text-xs font-semibold text-stone-400 uppercase">Total Agreed Contract</span>
          <p className="text-2xl font-extrabold text-stone-100">₹{ledger.totalContractAmount.toLocaleString('en-IN')}</p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-1">
          <span className="text-xs font-semibold text-stone-400 uppercase">Total Realized Payments</span>
          <p className="text-2xl font-extrabold text-emerald-400">₹{ledger.paidAmount.toLocaleString('en-IN')}</p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-1">
          <span className="text-xs font-semibold text-stone-400 uppercase">Remaining Outstanding Balance</span>
          <p className="text-2xl font-extrabold text-rose-400">₹{ledger.remainingBalance.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
        <h2 className="text-lg font-bold text-stone-200">Tranche Payment Log History</h2>

        {ledger.transactions.length === 0 ? (
          <p className="text-xs text-stone-500 py-4">No payments recorded yet for this booking.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-800 text-xs uppercase text-stone-400">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Tranche Type</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {ledger.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-amber-500">{tx.receiptNumber}</td>
                    <td className="py-3 px-4 text-xs font-medium text-stone-200">{tx.trancheType}</td>
                    <td className="py-3 px-4 text-xs font-mono text-stone-400">{tx.paymentDate}</td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-stone-800 px-2.5 py-1 text-xs font-semibold text-stone-300">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-stone-400">{tx.transactionRef || 'N/A'}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">₹{tx.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}