'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StorageRepository } from '@/lib/storageRepository';
import { CurrencyFormatter } from '@/lib/currency';

export default function BookingPaymentPage() {
  const router = useRouter();
  const [proposal, setProposal] = useState<any>(null);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Bank Transfer'>('UPI');
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const currentProposal = StorageRepository.getItem<any>('vk_current_proposal', null);
    if (currentProposal) {
      setProposal(currentProposal);
    }
  }, []);

  const totalAmount = proposal?.grandTotal || 0;
  const advanceAmount = Math.round(totalAmount * 0.3); // 30% Advance Token

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      alert('Kripya payment Transaction Ref / UTR ID enter karein.');
      return;
    }

    setIsSubmitting(true);

    const bookingRef = `VKCREATION-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newBooking = {
      bookingNumber: bookingRef,
      clientName: proposal?.clientName || 'Valued Client',
      phone: proposal?.phone || '',
      email: proposal?.email || '',
      venue: proposal?.venue || 'Indore',
      eventDate: proposal?.eventDate || '2026-11-20',
      packageName: proposal?.packageName || 'Custom Wedding Package',
      totalAmount: totalAmount,
      advancePaid: advanceAmount,
      remainingBalance: totalAmount - advanceAmount,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage Repository
    StorageRepository.saveBooking(newBooking);
    StorageRepository.recordPayment({
      bookingNumber: bookingRef,
      amount: advanceAmount,
      paymentMode: paymentMode,
      transactionRef: transactionRef,
    });

    // Redirect to Client Success Page
    router.push(`/portal/${bookingRef}`);
  };

  if (!proposal) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-3xl">📋</div>
          <h2 className="text-xl font-bold text-stone-100">Koi Active Proposal Nahi Mila</h2>
          <p className="text-xs text-stone-400">
            Booking proceed karne ke liye pehle apna customized wedding package select karein.
          </p>
          <Link
            href="/builder"
            className="inline-block px-5 py-2.5 bg-amber-500 text-stone-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition"
          >
            Create Proposal →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 md:p-10 space-y-8 max-w-4xl mx-auto">
      {/* Client Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
            VK Creation Studio
          </span>
          <h1 className="text-3xl font-extrabold text-stone-100 mt-1">
            Lock Your Event Dates
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Pay 30% advance token to confirm your booking for {proposal.clientName}.
          </p>
        </div>

        <Link
          href="/builder/preview"
          className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-800 self-start sm:self-auto"
        >
          ← Back to Proposal
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-amber-500 uppercase tracking-wider">
            Booking Breakdown
          </h2>

          <div className="space-y-3 text-xs border-b border-stone-800 pb-4">
            <div className="flex justify-between">
              <span className="text-stone-400">Client Name:</span>
              <strong className="text-stone-100">{proposal.clientName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Selected Package:</span>
              <strong className="text-stone-100">{proposal.packageName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Event Date:</span>
              <strong className="text-amber-400">{proposal.eventDate}</strong>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-stone-300">
              <span>Total Estimated Investment:</span>
              <span className="font-mono">{CurrencyFormatter.formatINR(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-bold text-sm pt-2 border-t border-stone-800/80">
              <span>30% Advance Required to Lock:</span>
              <span className="font-mono">{CurrencyFormatter.formatINR(advanceAmount)}</span>
            </div>
            <p className="text-[10px] text-stone-500 pt-1">
              *Remaining 70% balance event ke time aur final drive delivery ke dauran pay karna hoga.
            </p>
          </div>
        </div>

        {/* Payment Transfer Section */}
        <form onSubmit={handleConfirmBooking} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-bold text-amber-500 uppercase tracking-wider">
            Pay Advance Token
          </h2>

          <div className="space-y-3 text-xs">
            <label className="block text-stone-400 font-bold">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMode('UPI')}
                className={`p-3 rounded-xl border font-bold text-center transition ${
                  paymentMode === 'UPI'
                    ? 'bg-amber-500 text-stone-950 border-amber-400'
                    : 'bg-stone-950 text-stone-400 border-stone-800'
                }`}
              >
                📲 UPI / QR Code
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('Bank Transfer')}
                className={`p-3 rounded-xl border font-bold text-center transition ${
                  paymentMode === 'Bank Transfer'
                    ? 'bg-amber-500 text-stone-950 border-amber-400'
                    : 'bg-stone-950 text-stone-400 border-stone-800'
                }`}
              >
                🏦 Bank Transfer
              </button>
            </div>
          </div>

          {/* Bank / UPI Details Box */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1 text-xs">
            {paymentMode === 'UPI' ? (
              <>
                <p className="text-stone-400">Official UPI ID:</p>
                <p className="font-mono text-amber-400 font-bold text-sm">vkcreation@upi</p>
                <p className="text-[10px] text-stone-500 pt-1">Google Pay / PhonePe / Paytm se scan karke pay karein.</p>
              </>
            ) : (
              <>
                <p className="text-stone-400">Account Name: <strong>VK Creation Studio</strong></p>
                <p className="text-stone-400">Bank: <strong>HDFC Bank</strong></p>
                <p className="text-stone-400">A/C No: <strong className="font-mono text-stone-200">50200012345678</strong></p>
                <p className="text-stone-400">IFSC Code: <strong className="font-mono text-stone-200">HDFC0001234</strong></p>
              </>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <label className="block text-stone-300 font-bold">
              Transaction Reference / UTR Number *
            </label>
            <input
              type="text"
              placeholder="e.g. 123456789012"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 p-3 rounded-xl text-stone-100 font-mono outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {isSubmitting ? 'Confirming Booking...' : 'Confirm Booking & Access Portal →'}
          </button>
        </form>
      </div>
    </div>
  );
}