"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { packages } from "@/data/packages";

export default function Packages() {
  return (
    <section
      id="packages"
      className="relative overflow-hidden bg-black py-20 sm:py-24 lg:py-28"
    >
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-yellow-400/5 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.45em] text-yellow-400 sm:text-sm">
            Packages
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Choose Your Coverage
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Select one of our carefully designed wedding packages or build a
            completely customized photography experience that matches your
            celebration.
          </p>
        </div>

        {/* Package Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3 lg:mt-16 lg:gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="group flex h-full flex-col rounded-3xl border border-white/10 bg-neutral-900/90 p-7 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/40"
            >
              <h3 className="text-2xl font-bold text-yellow-400 sm:text-3xl">
                {pkg.title}
              </h3>

              <p className="mt-4 text-4xl font-bold text-white">
                {pkg.price}
              </p>

              <ul className="mt-8 flex-1 space-y-4">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <Check className="mt-1 h-5 w-5 shrink-0 text-yellow-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/builder"
                className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-yellow-400 px-6 py-3.5 font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-yellow-300"
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}