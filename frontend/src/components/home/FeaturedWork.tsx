"use client";

export default function FeaturedWork() {
  const portfolio = [
    "Wedding Stories",
    "Pre Wedding",
    "Haldi Ceremony",
    "Mehendi Moments",
    "Reception Night",
    "Cinematic Films",
  ];

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden bg-[#0a0a0a] py-20 sm:py-24 lg:py-28"
    >
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-yellow-400/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.45em] text-yellow-400 sm:text-sm">
            Portfolio
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Featured Work
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            A glimpse into our most memorable celebrations, captured with
            elegance, creativity, and timeless storytelling.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {portfolio.map((item) => (
            <div
              key={item}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/30"
            >
              <div className="relative flex  items-center justify-center overflow-hidden bg-linear-to-br from-neutral-800 via-neutral-900 to-black">
                {/* Hover Glow */}aspect-[4/5]
                <div className="absolute inset-0 bg-yellow-400/0 transition-all duration-500 group-hover:bg-yellow-400/10" />

                {/* Decorative Circle */}
                <div className="absolute h-52 w-52 rounded-full bg-yellow-400/5 blur-3xl transition-all duration-500 group-hover:scale-125" />

                <span className="relative px-6 text-center text-lg font-semibold tracking-[0.18em] text-yellow-400 transition-transform duration-500 group-hover:scale-105 sm:text-xl">
                  {item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}