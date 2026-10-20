'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GalleryStream from '@/components/home/GalleryStream';
import PortraitStories from '@/components/home/PortraitStories';
import BehindTheLens from '@/components/home/BehindTheLens';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950 relative">
      
      {/* 🧭 NAVIGATION BAR */}
      <nav className="border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2.5 group touch-manipulation">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-stone-950 text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              VK
            </div>
            <div>
              <span className="text-base font-black tracking-wider text-stone-100 block group-hover:text-amber-400 transition">
                VK_CREATION STUDIO
              </span>
              <span className="text-[10px] text-amber-500/80 font-mono tracking-widest block uppercase -mt-0.5">
                Film And Portraits
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* 🔑 CLIENT PORTAL BUTTON (Mobile Par Clear Text With Icon) */}
            <Link
              href="/portal"
              className="bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 hover:border-amber-500/40 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95 whitespace-nowrap"
            >
              <span>🔑</span>
              <span>Client Portal</span>
            </Link>

            {/* 📅 BOOK DATE BUTTON */}
            <Link
              href="/builder"
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
            >
              <span>🗓️</span>
              <span>BOOK DATE →</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 👑 HERO SECTION & PLANNING CTA BANNER */}
      <section className="relative overflow-hidden pt-10 sm:pt-12 pb-10 border-b border-stone-800/60">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 text-center space-y-5 relative z-10">
          <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest font-mono">
            ✨ CRAFTING ROYAL WEDDING MEMORIES
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-stone-100 tracking-tight leading-tight">
            Crafting Timeless Royal Wedding<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-300 to-amber-500">
               FILMS & PORTRAITS ⭐
            </span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            <strong className="text-amber-400 font-semibold">Where Emotions Meet Royal Cinematography.</strong><br />
            Capturing unscripted candid moments, royal rituals & cinema-grade films across Indore, Udaipur, Goa & Pan-India.
          </p>

          {/* CALL TO ACTION BANNER */}
          <div className="pt-2 max-w-4xl mx-auto">
            <div className="bg-linear-to-r from-stone-900 via-amber-950/60 to-stone-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-10 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="space-y-1.5">
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full inline-block font-mono">
                  👑 RESERVE YOUR SPECIAL DATES
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-stone-100">
                  Planning Your Dream Wedding?
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
                  Don't let your wedding dates slip away! Check team availability, customize your shoot coverage, and reserve your dates inside your dedicated VIP portal.
                </p>
              </div>

              <Link
                href="/builder"
                className="inline-block bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-stone-950 font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-wider transition shadow-xl shadow-amber-500/20 active:scale-95 touch-manipulation"
              >
                📅 BOOK YOUR WEDDING DATE NOW →
              </Link>
            </div>
          </div>

          {/* 👑 STAT BADGES GRID */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto font-mono">
            <div className="relative group bg-linear-to-b from-stone-900 via-stone-950 to-stone-900 border border-amber-500/30 p-5 rounded-3xl transition shadow-xl">
              <div className="absolute top-2 right-3 text-lg">👑</div>
              <strong className="text-2xl sm:text-3xl font-black text-amber-400 block">300+</strong>
              <span className="text-[10px] text-stone-300 font-bold uppercase tracking-wider block pt-1">
                Weddings Shot
              </span>
            </div>

            <div className="relative group bg-linear-to-b from-stone-900 via-stone-950 to-stone-900 border border-emerald-500/30 p-5 rounded-3xl transition shadow-xl">
              <div className="absolute top-2 right-3 text-lg">⭐</div>
              <strong className="text-2xl sm:text-3xl font-black text-emerald-400 block">100%</strong>
              <span className="text-[10px] text-emerald-300/90 font-bold uppercase tracking-wider block pt-1">
                Happy Clients
              </span>
            </div>

            <div className="relative group bg-linear-to-b from-stone-900 via-stone-950 to-stone-900 border border-amber-500/30 p-5 rounded-3xl transition shadow-xl">
              <div className="absolute top-2 right-3 text-lg">🎥</div>
              <strong className="text-2xl sm:text-3xl font-black text-amber-400 block">4K HDR</strong>
              <span className="text-[10px] text-stone-300 font-bold uppercase tracking-wider block pt-1">
                Cinema Grade
              </span>
            </div>

            <Link
              href="/portal"
              className="relative group bg-linear-to-b from-amber-950/40 via-stone-950 to-amber-950/40 border-2 border-amber-500/60 hover:border-amber-300 p-5 rounded-3xl transition shadow-xl text-center w-full block cursor-pointer active:scale-95"
            >
              <div className="absolute top-2 right-3 text-lg">🔐</div>
              <strong className="text-lg sm:text-xl font-black text-amber-400 block uppercase tracking-tight">
                VIP Portal
              </strong>
              <span className="text-[9px] text-amber-300/90 font-extrabold uppercase tracking-widest block pt-1">
                Unlock Access
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 🖼️ PHOTOS STREAM SECTION */}
      <GalleryStream />

      {/* 👑 PORTRAIT STORIES & REELS SECTION */}
      <PortraitStories />

      {/* 🎬 NEW: BEHIND THE LENS / STUDIO AT WORK SHOWCASE */}
      <BehindTheLens />

      {/* 👑 COMPACT STUDIO LEADERSHIP & DIRECT CONTACT SECTION */}
      <section className="py-10 bg-stone-900/40 border-b border-stone-800/80">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 rounded-full inline-block">
              ✨ DIRECT STUDIO CONTACTS
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-stone-100 tracking-tight">
              Meet The Leadership
            </h2>
          </div>

          {/* ⚡ COMPACT 2-COLUMN GRID (MOBILE FIT) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 max-w-2xl mx-auto font-sans">
            
            {/* Omprakash Vishwakarma Card */}
            <div className="bg-stone-900/90 border border-amber-500/40 p-3 sm:p-4 rounded-2xl space-y-2 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[7px] sm:text-[9px] font-mono text-amber-400 font-extrabold uppercase tracking-wider bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 block w-max mb-1">
                  👑 FOUNDER
                </span>
                <strong className="text-xs sm:text-sm font-black text-stone-100 block leading-tight truncate">
                  OMPRAKASH
                </strong>
                <span className="text-[8px] sm:text-[10px] text-stone-400 block font-mono">Operations & Vision</span>
              </div>

              <a
                href="tel:+919753820740"
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-1.5 px-2 rounded-xl text-[10px] sm:text-xs flex items-center justify-center gap-1 font-mono transition shadow-md active:scale-95"
              >
                <span>📞</span>
                <span>9753820740</span>
              </a>
            </div>

            {/* Ashutosh Vishwakarma Card */}
            <div className="bg-stone-900/90 border border-amber-500/40 p-3 sm:p-4 rounded-2xl space-y-2 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[7px] sm:text-[9px] font-mono text-amber-400 font-extrabold uppercase tracking-wider bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 block w-max mb-1">
                  👑 DIRECTOR
                </span>
                <strong className="text-xs sm:text-sm font-black text-stone-100 block leading-tight truncate">
                  ASHUTOSH
                </strong>
                <span className="text-[8px] sm:text-[10px] text-stone-400 block font-mono">Head Operations</span>
              </div>

              <a
                href="tel:+919644213129"
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-1.5 px-2 rounded-xl text-[10px] sm:text-xs flex items-center justify-center gap-1 font-mono transition shadow-md active:scale-95"
              >
                <span>📞</span>
                <span>9644213129</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-8 font-mono text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <div className="space-y-1">
            <p className="text-stone-300 font-bold text-[11px]">VK_CREATION STUDIO — SARANGPUR/BIAORAMANDU</p>
            <p className="text-[10px]">📍 Ward 10 Chowk Mohalla, V.P.O. Biaoramandu, Sarangpur, DIST: Rajgarh, MP - 465697</p>
          </div>

          <div className="space-y-1 text-center sm:text-right">
            <p className="text-[10px] text-stone-600">
              © 2026 VK_CREATION LLP. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}