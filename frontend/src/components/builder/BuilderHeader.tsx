"use client";

import Link from "next/link";
import { Camera, Eye, Sparkles } from "lucide-react";

export default function BuilderHeader() {
  return (
    <section className="mb-10 sm:mb-12">
      {/* Badge */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2">
          <Camera className="h-4 w-4 text-yellow-400" />

          <span className="text-xs font-medium uppercase tracking-[0.25em] text-yellow-300 sm:text-sm">
            VK Creation • Wedding Booking
          </span>
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Build Your
          <span className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Wedding Coverage
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
          Select your photography services, customize your package, view live
          pricing, and continue to booking—all in one simple experience.
        </p>
      </div>

      {/* Highlights */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-gray-300">
          <Sparkles className="h-4 w-4 text-yellow-400" />
          Live Pricing
        </div>

        <div className="rounded-full border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-gray-300">
          Instant Quote
        </div>

        <div className="rounded-full border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-gray-300">
          Secure Booking
        </div>
      </div>

      {/* Action */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/builder/preview"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-[1.02] sm:w-auto"
        >
          <Eye size={18} />
          Preview Quote
        </Link>
      </div>
    </section>
  );
}