'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StorageRepository } from '@/lib/storageRepository';
import { CurrencyFormatter } from '@/lib/currency';

export default function ProposalPreviewPage() {
  const router = useRouter();
  const [proposal, setProposal] = useState<any>(null);

  useEffect(() => {
    const saved = StorageRepository.getItem<any>('vk_current_proposal', null);
    if (saved) {
      setProposal(saved);
    }
  }, []);

  if (!proposal) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-4">
          <p className="text-stone-400 text-sm">No proposal found. Please create a new quotation.</p>
          <Link
            href="/builder"
            className="inline-block px-4 py-2 bg-amber-500 text-stone-950 text-xs font-bold rounded-xl"
          >
            Go to Package Builder
          </Link>
        </div>
      </div>
    );
  }

  const handleBookAndLockDates = () => {
    const refId = proposal.id || proposal.bookingNumber || 'VKCREATION-392597';
    
    // LocalStorage fallback for VIP Portal access
    localStorage.setItem('last_booking_ref', refId);

    // 🚀 DIRECT REDIRECT TO CLIENT VIP PORTAL (NO LOOP TO /booking/payment)
    router.push(`/portal/${refId}`);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 md:p-10 space-y-6 max-w-4xl mx-auto font-sans">
      {/* Client Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-4 gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">VK Creation Studio</span>
          <h1 className="text-2xl font-extrabold text-stone-100 mt-0.5">Your Personalized Wedding Media Proposal</h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/builder"
            className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-800 transition"
          >
            Edit Proposal
          </Link>
          <button
            onClick={handleBookAndLockDates}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400 transition cursor-pointer active:scale-95"
          >
            Book & Lock Dates →
          </button>
        </div>
      </div>

      {/* Proposal Document Preview */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-10 space-y-8 shadow-2xl">
        <div className="border-b border-stone-800 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-black text-amber-500 font-mono">VK CREATION STUDIO</h2>
            <p className="text-xs text-stone-400">Luxury Wedding Photography & Cinematography</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-amber-400 font-bold block">
              Proposal Ref: {proposal.id || proposal.bookingNumber || 'VKCREATION-392597'}
            </span>
            <p className="text-[10px] text-stone-500 mt-0.5">
              {proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString('en-IN') : '2026-08-08'}
            </p>
          </div>
        </div>

        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 text-xs">
          <p className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Prepared For:</p>
          <h3 className="text-base font-extrabold text-stone-100">{proposal.clientName || 'Valued Client'}</h3>
          <p className="text-stone-300">📱 WhatsApp: {proposal.phone || proposal.clientPhone || 'N/A'}</p>
          <p className="text-stone-300">📍 Venue & Location: {proposal.venue || 'TBD Location'}, {proposal.city || ''}</p>
          <p className="text-stone-300 font-mono">📅 Event Date: {proposal.eventDate || 'TBD'}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider font-mono">Included Package & Add-ons</h3>
          
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex justify-between items-center text-xs">
            <div>
              <strong className="text-stone-100 block text-sm">{proposal.packageName || proposal.title || 'Selected Wedding Package'}</strong>
              <span className="text-stone-400 text-[11px]">Primary Photography & Film Coverage</span>
            </div>
            <span className="font-mono font-bold text-amber-400 text-sm">
              {CurrencyFormatter.formatINR(proposal.packageTotal || proposal.totalAmount || 0)}
            </span>
          </div>

          {proposal.addons && proposal.addons.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs text-stone-400 font-bold block">Selected Add-ons:</span>
              {proposal.addons.map((addon: any, idx: number) => (
                <div key={idx} className="bg-stone-950 p-3 rounded-xl border border-stone-800/80 flex justify-between text-xs">
                  <span className="text-stone-300">{addon.name || addon.title}</span>
                  <span className="font-mono text-stone-200">{CurrencyFormatter.formatINR(addon.rate || addon.basePrice || addon.price || 0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-stone-800 pt-6 flex justify-between items-center text-sm">
          <span className="font-bold text-stone-300">Total Investment Estimated:</span>
          <span className="text-2xl font-black text-amber-400 font-mono">
            {CurrencyFormatter.formatINR(proposal.grandTotal || proposal.totalAmount || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}