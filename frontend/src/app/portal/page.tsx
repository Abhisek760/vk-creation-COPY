"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Sparkles, ArrowLeft, MessageCircle } from "lucide-react";

export default function PortalLoginPage() {
  const router = useRouter();
  // Default state empty rakha hai taaki naye client ke liye auto-fill na ho
  const [bookingRef, setBookingRef] = useState("");

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRef.trim()) {
      alert("Kripya apna Booking Reference ID bharein!");
      return;
    }
    router.push(`/portal/${bookingRef.trim()}`);
  };

  // Automated WhatsApp Help Message
  const whatsappHelpUrl = `https://wa.me/919644213129?text=${encodeURIComponent(
    "Hello Ashutosh Sir (VK Creation Studio), Main apna Booking Reference Number bhool gaya hu. Kripya mujhe mera Ref ID send karein."
  )}`;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-8 text-center shadow-2xl relative">
        
        <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400">
          <Lock className="w-6 h-6" />
        </div>

        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block font-mono mb-1">
          VK_CREATION VIP ACCESS
        </span>
        <h1 className="text-xl font-black text-white mb-2">
          Security Verification
        </h1>
        <p className="text-stone-400 text-xs mb-6">
          Apna Booking Reference Number daal kar confidential Client Portal unlock karein.
        </p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              type="text"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              placeholder="e.g. VKCREATION-310393"
              className="w-full bg-stone-950 border border-stone-700 text-amber-400 font-mono font-bold text-center text-sm py-3.5 px-4 rounded-xl focus:border-amber-500 focus:outline-none uppercase placeholder:text-stone-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-stone-950 font-black py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>UNLOCK CLIENT PORTAL →</span>
          </button>
        </form>

        {/* WhatsApp Recovery Section */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 hover:text-stone-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          <a
            href={whatsappHelpUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-amber-400 hover:underline font-bold bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 text-[11px]"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Forgot Ref ID? WhatsApp Us</span>
          </a>
        </div>

      </div>
    </div>
  );
}