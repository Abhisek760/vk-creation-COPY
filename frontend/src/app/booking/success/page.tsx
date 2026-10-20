'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ShieldCheck, Copy, Sparkles, ArrowRight } from 'lucide-react';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Dynamic Booking Ref Fetching
  const bookingNumber = searchParams.get("bookingNumber") || "VKCREATION-310393";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (bookingNumber) {
      localStorage.setItem("last_booking_ref", bookingNumber);
    }
  }, [bookingNumber]);

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchPortal = () => {
    // Direct Portal Launch without asking Ref ID manually
    router.push(`/portal/${bookingNumber}`);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-stone-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        
        {/* Top Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-linear-to-r from-transparent via-amber-500 to-transparent" />

        {/* Success Icon */}
        <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block font-mono mb-1">
          VK_CREATION STUDIO
        </span>

        <h1 className="text-xl sm:text-2xl font-black text-white mb-2">
          Proposal Created!
        </h1>

        <p className="text-stone-400 text-xs leading-relaxed mb-5">
          Congratulations🎉 ! Aapke wedding proposal details save ho gaye hain. Niche diye gaye button par click karke direct apna VIP Portal open karein.
        </p>

        {/* Ref Number Display Card */}
        <div className="bg-stone-950 border border-stone-800 rounded-2xl p-3.5 mb-5 flex items-center justify-between text-left">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold block font-mono">
              Your Booking Ref ID
            </span>
            <span className="text-sm sm:text-base font-mono font-black text-amber-400 tracking-wider">
              {bookingNumber}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-stone-700"
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* ONE-CLICK ACTION BUTTON */}
        <button
          onClick={handleLaunchPortal}
          className="w-full bg-linear-to-r from-amber-500 to-amber-400 active:scale-[0.98] text-stone-950 font-black py-4 px-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/15 cursor-pointer text-xs uppercase tracking-wider mb-1"
        >
          <Sparkles className="w-4 h-4" />
          <span>VIEW BOOKING & PAY ADVANCE →</span>
        </button>

        {/* Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80" />
          <span>Is Reference ID ko future security login ke liye save rakhein.</span>
        </div>

      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 text-amber-400 flex items-center justify-center font-mono text-xs">
          ⏳ Loading Booking Details...
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}