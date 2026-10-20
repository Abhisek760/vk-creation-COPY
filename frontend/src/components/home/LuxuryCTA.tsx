"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";

export default function LuxuryCTA() {
  return (
    <section className="relative overflow-hidden bg-[#050505] py-20 sm:py-24 lg:py-28">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-112.5 w-112.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[170px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-linear-to-br from-[#161616] via-[#111111] to-[#070707] p-8 sm:rounded-[40px] sm:p-10 lg:p-16">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-amber-300 sm:px-5 sm:text-sm">
              <Sparkles className="h-4 w-4" />
              Limited Wedding Dates Available
            </div>

            {/* Heading */}
            <h2 className="mt-6 text-3xl font-bold leading-tight text-white sm:mt-8 sm:text-5xl lg:text-6xl">
              Let's Capture Your
              <span className="block bg-linear-to-r from-amber-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Forever Story
              </span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
              Every wedding is a once-in-a-lifetime celebration. Reserve your
              date today and let us preserve every smile, emotion, and memory
              with timeless photography and cinematic films.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/builder"
                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-linear-to-r from-amber-400 via-yellow-500 to-orange-500 px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:scale-[1.02] sm:w-auto sm:text-lg"
              >
                Build Your Package
                <ArrowRight className="h-5 w-5" />
              </Link>

              {/* 🚀 FIX: Redirecting directly to /builder instead of /booking */}
              <Link
                href="/builder"
                className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-all duration-300 hover:border-amber-400/40 hover:bg-white/10 sm:w-auto sm:text-lg"
              >
                <CalendarDays className="h-5 w-5" />
                Book Your Date
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-1 gap-8 border-t border-white/10 pt-10 sm:grid-cols-3 sm:gap-6">
              <div>
                <h3 className="text-3xl font-bold text-amber-400">300+</h3>
                <p className="mt-2 text-gray-400">Weddings Captured</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-amber-400">5★</h3>
                <p className="mt-2 text-gray-400">Client Satisfaction</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-amber-400">100%</h3>
                <p className="mt-2 text-gray-400">Premium Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}