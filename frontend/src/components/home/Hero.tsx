"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#D4AF3720,transparent_70%)]" />

      {/* Additional Glow Effects */}
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-yellow-500/5 blur-[150px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 text-center sm:px-8 lg:px-10">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.45em] text-yellow-400 sm:text-sm">
          Luxury Wedding Photography
        </p>

        <h1 className="text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-8xl">
          Capturing
          <span className="block text-yellow-400">Forever Moments</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:mt-8 sm:text-lg sm:leading-8">
          Every wedding tells a unique story. We capture emotions,
          celebrations, and timeless memories with cinematic elegance that
          you'll cherish for generations.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row">
          {/* 🚀 FIX: Redirecting directly to /builder instead of /booking */}
          <Link
            href="/builder"
            className="w-full rounded-full bg-yellow-400 px-8 py-4 text-center font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-yellow-300 sm:w-auto"
          >
            Book Your Date
          </Link>

          <Link
            href="/builder"
            className="w-full rounded-full border border-yellow-400 px-8 py-4 text-center font-semibold text-yellow-400 transition-all duration-300 hover:bg-yellow-400 hover:text-black sm:w-auto"
          >
            View Packages
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce md:block">
        <div className="flex flex-col items-center">
          <span className="mb-2 text-[10px] uppercase tracking-[0.4em] text-gray-400">
            Scroll
          </span>

          <div className="h-10 w-px bg-yellow-400" />
        </div>
      </div>
    </section>
  );
}