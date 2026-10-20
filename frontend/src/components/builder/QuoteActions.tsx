"use client";

import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";

interface QuoteActionsProps {
  bookingNumber?: string;
  clientName?: string;
  onClose?: () => void;
}

export default function QuoteActions({
  bookingNumber = "VKCREATION-392597",
  clientName = "Valued Client",
  onClose,
}: QuoteActionsProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectPortalLaunch = () => {
    // 1. Save Last Ref ID in LocalStorage for memory fallback
    localStorage.setItem("last_booking_ref", bookingNumber);

    // 2. DIRECT PORTAL LAUNCH (NO REDIRECTION TO /booking)
    router.push(`/portal/${bookingNumber}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-stone-900 border border-amber-500/40 w-full max-w-md rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl relative text-stone-100 my-auto">
        
        {/* Crown Icon */}
        <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block font-mono">
            PROPOSAL CREATED SUCCESSFULLY
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Congratulations🎉 , {clientName}!
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Aapka wedding proposal details save ho gaya hai.
          </p>
        </div>

        {/* Ref ID Box */}
        <div className="bg-stone-950 border border-stone-800 rounded-2xl p-3.5 flex items-center justify-between text-left">
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
            type="button"
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-300 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer border border-stone-700"
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" />
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>

        {/* Workflow Info */}
        <div className="bg-stone-950/60 border border-stone-800 p-3.5 rounded-2xl text-left space-y-2 text-xs">
          <span className="text-[10px] font-bold text-amber-500 uppercase font-mono block">
            📋 NEXT STEPS FOR YOUR BOOKING:
          </span>
          <p className="text-stone-300 text-[11px] leading-relaxed">
            1. <strong>Direct Access:</strong> Niche diye gaye button par click karke seedhe apna Client VIP Portal kholein.
          </p>
          <p className="text-stone-300 text-[11px] leading-relaxed">
            2. <strong>Advance Payment:</strong> Studio Admin review ke baad Portal par advance payment options update karegi.
          </p>
        </div>

        {/* 🚀 DIRECT PORTAL LAUNCH BUTTON */}
        <button
          onClick={handleDirectPortalLaunch}
          type="button"
          className="w-full bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 active:scale-[0.98] text-stone-950 font-black py-4 px-5 rounded-2xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>🚀 VIEW BOOKING & PAY ADVANCE →</span>
        </button>

        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="text-xs text-stone-500 hover:text-stone-300 underline block mx-auto pt-1 cursor-pointer"
          >
            Done / Close
          </button>
        )}

      </div>
    </div>
  );
}