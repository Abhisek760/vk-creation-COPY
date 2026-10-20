"use client";

import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Aman & Priya",
    location: "Bhopal",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop",
    review:
      "VK Creation captured every emotion beautifully. Every photo feels timeless and tells our wedding story perfectly. We couldn't have asked for a better team.",
  },
  {
    id: 2,
    name: "Rohit & Sneha",
    location: "Indore",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop",
    review:
      "From our pre-wedding shoot to the final delivery, everything was smooth and professional. The cinematic film exceeded every expectation.",
  },
  {
    id: 3,
    name: "Harsh & Neha",
    location: "Jabalpur",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop",
    review:
      "The entire experience was premium. Communication, creativity, punctuality, and final albums were simply outstanding. Highly recommended.",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#070707] py-20 sm:py-24 lg:py-28">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-16">
          <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-300 sm:text-xs">
            Testimonials
          </span>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Loved by Couples,
            <span className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Trusted for Memories
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
            Every wedding is unique. Our biggest achievement is the trust and
            happiness of the couples who chose us to preserve their most
            precious moments.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-amber-400/40 hover:bg-white/10 sm:p-8"
            >
              <div className="absolute right-6 top-6 text-amber-400/20 transition-transform duration-500 group-hover:scale-125">
                <Quote size={42} />
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-amber-400/30"
                />

                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {testimonial.name}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="mt-6 text-[15px] leading-7 text-gray-300 sm:text-base sm:leading-8">
                "{testimonial.review}"
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Rating */}
        <div className="mt-14 flex flex-col items-center justify-center text-center lg:mt-16">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={22}
                className="fill-amber-400 text-amber-400"
              />
            ))}
          </div>

          <h3 className="mt-4 text-2xl font-bold text-white">
            Rated 5.0 by Happy Couples
          </h3>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
            We believe wedding photography is more than taking pictures—it's
            about preserving emotions that families will cherish for
            generations.
          </p>
        </div>
      </div>
    </section>
  );
}