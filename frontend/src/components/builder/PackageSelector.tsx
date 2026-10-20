'use client';

import React, { useState, useEffect } from 'react';
import { PackagePreset } from '@/types/package';
import { getStoredPackages, savePackageToStorage } from '@/lib/storage';

interface PackageSelectorProps {
  onSelectPackage: (pkg: PackagePreset) => void;
}

const DEFAULT_PACKAGES: PackagePreset[] = [
  {
    id: 'PKG-SILVER',
    name: 'Silver Package',
    tagline: 'Ideal for intimate 1-2 day wedding ceremonies',
    price: 85000,
    includedServices: [
      { serviceId: 'srv-1', serviceName: 'Traditional Photography', daysOrUnits: 2, rate: 15000 },
      { serviceId: 'srv-2', serviceName: 'Traditional Videography', daysOrUnits: 2, rate: 15000 },
      { serviceId: 'srv-3', serviceName: 'Cinematic Teaser (3-5 min)', daysOrUnits: 1, rate: 25000 },
    ],
    deliverables: ['300+ Edited High-Res Photos', 'HD Wedding Highlights Film', '1 Standard Photobook (40 Sheets)'],
    termsSummary: '40% advance required upon booking. Travel/stay provided by client if outside Indore.',
  },
  {
    id: 'PKG-GOLD',
    name: 'Gold Package',
    tagline: 'Our most popular comprehensive coverage',
    price: 150000,
    popular: true,
    includedServices: [
      { serviceId: 'srv-1', serviceName: 'Candid Photography', daysOrUnits: 2, rate: 25000 },
      { serviceId: 'srv-2', serviceName: 'Cinematic Wedding Film', daysOrUnits: 2, rate: 35000 },
      { serviceId: 'srv-3', serviceName: 'Drone Aerial Shoot', daysOrUnits: 1, rate: 15000 },
      { serviceId: 'srv-4', serviceName: 'Traditional Photography', daysOrUnits: 2, rate: 15000 },
    ],
    deliverables: ['500+ Edited Photos', '4K Cinematic Teaser + Full Length Film', '2 Premium Flush Mount Albums', 'Cloud Gallery Access'],
    termsSummary: '40% advance required upon booking. Full raw data transferred post event.',
  },
  {
    id: 'PKG-LUXURY',
    name: 'Luxury Royal Package',
    tagline: 'Grand multi-day destination wedding package',
    price: 250000,
    includedServices: [
      { serviceId: 'srv-1', serviceName: 'Pre-Wedding Shoot & Film', daysOrUnits: 1, rate: 40000 },
      { serviceId: 'srv-2', serviceName: 'Candid Photography', daysOrUnits: 3, rate: 25000 },
      { serviceId: 'srv-3', serviceName: 'Cinematic Film + Drone', daysOrUnits: 3, rate: 45000 },
      { serviceId: 'srv-4', serviceName: 'Traditional Photography', daysOrUnits: 3, rate: 15000 },
    ],
    deliverables: ['Unlimited Edited Photos', '4K Film + Reel Edits', '3 Luxury Leather photobooks', 'Same Day Edit Teaser'],
    termsSummary: '50% advance required. Travel, accommodation & logistics included or billed on actuals.',
  },
];

export const PackageSelector: React.FC<PackageSelectorProps> = ({ onSelectPackage }) => {
  const [packages, setPackages] = useState<PackagePreset[]>([]);

  useEffect(() => {
    const loaded = getStoredPackages();
    if (loaded.length === 0) {
      setPackages(DEFAULT_PACKAGES);
      DEFAULT_PACKAGES.forEach(savePackageToStorage);
    } else {
      setPackages(loaded);
    }
  }, []);

  return (
    <div className="space-y-4 rounded-xl border border-stone-800 bg-stone-900/60 p-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-stone-200">1-Click Package Templates</h3>
          <p className="text-xs text-stone-400">Select a pre-built package or customize individual services below.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all ${
              pkg.popular
                ? 'border-amber-500 bg-amber-950/20 shadow-lg shadow-amber-500/10'
                : 'border-stone-800 bg-stone-950 hover:border-stone-700'
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 right-4 rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-bold text-stone-950 uppercase">
                Most Popular
              </span>
            )}

            <div>
              <h4 className="text-base font-bold text-stone-100">{pkg.name}</h4>
              <p className="text-xs text-stone-400 mt-0.5">{pkg.tagline}</p>
              <p className="mt-3 text-2xl font-extrabold text-amber-500">
                ₹ {pkg.price.toLocaleString('en-IN')}
              </p>

              <div className="mt-4 space-y-1 text-xs text-stone-300">
                <span className="font-semibold text-stone-400 block mb-1">Key Deliverables:</span>
                {pkg.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="text-amber-500 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onSelectPackage(pkg)}
              className="mt-5 w-full rounded-lg bg-amber-500 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400 transition"
            >
              Apply Package Preset
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageSelector;