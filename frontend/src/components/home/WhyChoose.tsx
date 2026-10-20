"use client";

const reasons = [
  {
    title: "Premium Equipment",
    description:
      "Professional cameras, lenses, drones, and cinematic lighting to capture every moment with exceptional quality.",
    icon: "📸",
  },
  {
    title: "Cinematic Editing",
    description:
      "Every wedding film is crafted with cinematic storytelling, beautiful color grading, and emotional moments.",
    icon: "🎬",
  },
  {
    title: "On-Time Delivery",
    description:
      "Your memories matter. We follow a professional workflow to ensure timely delivery without compromising quality.",
    icon: "⏰",
  },
  {
    title: "Personalized Experience",
    description:
      "Every couple has a unique story. We understand your vision and capture memories that truly reflect your celebration.",
    icon: "❤️",
  },
];

export default function WhyChoose() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#0d0d0d] py-20 sm:py-24 lg:py-28"
    >
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-yellow-400/5 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.45em] text-yellow-400 sm:text-sm">
            Why Choose Us
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Why Choose VK Creation
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            We don't just capture weddings—we preserve emotions, celebrations,
            and timeless memories through premium photography and cinematic
            storytelling.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4 lg:mt-16 lg:gap-8">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="group rounded-3xl border border-white/10 bg-neutral-900/90 p-7 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/40"
            >
              <div className="text-5xl transition-transform duration-500 group-hover:scale-110">
                {reason.icon}
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white sm:text-2xl">
                {reason.title}
              </h3>

              <p className="mt-4 text-base leading-7 text-gray-400">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}