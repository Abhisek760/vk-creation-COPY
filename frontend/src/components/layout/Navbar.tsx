"use client";

import Link from "next/link";
import { Sparkles, UserCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Studio Logo */}
<Link href="/" className="flex items-center gap-3 group select-none">
  {/* 🎨 GLOWING ICON */}
  <div className="relative">
    <div className="absolute -inset-1 bg-linear-to-r from-amber-500 to-amber-600 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition duration-500" />
    
    <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-2xl border border-amber-300/50 group-hover:scale-105 transition duration-300">
      <span className="font-black text-stone-950 text-base sm:text-lg tracking-tighter">
        VK
      </span>
    </div>
  </div>

  {/* 🏷️ BRAND TEXT & TAGLINE */}
  <div className="flex flex-col justify-center">
    <div className="flex items-center gap-1.5">
      <span className="text-sm sm:text-base font-black tracking-wider text-white group-hover:text-amber-400 transition-colors">
        VK_CREATION
      </span>
      <span className="text-sm sm:text-base font-black tracking-wider text-amber-500">
        STUDIO
      </span>
    </div>
    
    <div className="flex items-center gap-1.5 mt-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-amber-400/90">
        FILMS & PORTRAITS
      </span>
    </div>
  </div>
</Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 🚀 FIX: CLIENT PORTAL BUTTON */}
          <Link
            href="/portal"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-400 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Client Portal</span>
          </Link>

          {/* 🚀 FIX: BOOK DATE BUTTON */}
          <Link
            href="/builder"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black uppercase tracking-wider transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Book Date →</span>
          </Link>
        </div>

      </div>
    </header>
  );
}