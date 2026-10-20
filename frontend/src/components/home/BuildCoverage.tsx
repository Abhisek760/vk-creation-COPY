"use client";

import { useState } from "react";

export default function BuildCoverage() {
  const basePrice = 30000;
  const extraCameraPrice = 15000;

  const [cameraCount, setCameraCount] = useState(2);

  const totalPrice =
    basePrice + (cameraCount - 2) * extraCameraPrice;

  return (
    <section
      id="coverage"
      className="bg-[#111] py-24"
    >
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-neutral-900 p-10">

        <h2 className="text-center text-5xl font-bold text-white">
          Build Your Coverage
        </h2>

        <p className="mt-4 text-center text-gray-400">
          Customize your wedding coverage according to your needs.
        </p>

        {/* Camera Counter */}

        <div className="mt-14 flex items-center justify-between">

          <h3 className="text-2xl text-white">
            Camera Setup
          </h3>

          <div className="flex items-center gap-5">

            <button
              onClick={() =>
                setCameraCount(Math.max(2, cameraCount - 1))
              }
              className="h-12 w-12 rounded-full bg-yellow-400 text-2xl font-bold text-black"
            >
              -
            </button>

            <span className="text-2xl font-semibold text-white">
              {cameraCount} Cameras
            </span>

            <button
              onClick={() =>
                setCameraCount(cameraCount + 1)
              }
              className="h-12 w-12 rounded-full bg-yellow-400 text-2xl font-bold text-black"
            >
              +
            </button>

          </div>

        </div>

        {/* Price */}

        <div className="mt-16 border-t border-white/10 pt-10">

          <p className="text-gray-400">
            Estimated Price
          </p>

          <h2 className="mt-3 text-5xl font-bold text-yellow-400">
            ₹{totalPrice.toLocaleString("en-IN")}
          </h2>

        </div>

      </div>
    </section>
  );
}