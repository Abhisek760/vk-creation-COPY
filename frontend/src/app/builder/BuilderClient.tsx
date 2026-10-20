'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SelectedService {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface PrebuiltPackage {
  id: string;
  title: string;
  price: number;
  description: string;
  serviceIds: string[];
}

export default function BuilderClient() {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  
  // Tab State
  const [builderTab, setBuilderTab] = useState<'packages' | 'custom'>('packages');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [showProposal, setShowProposal] = useState(false);

  // Default Master Services
  const defaultServices: SelectedService[] = [
    { id: 's1', name: 'Traditional Photography (Full Day)', price: 15000, category: 'Photography' },
    { id: 's2', name: 'Candid Photography (Full Day)', price: 25000, category: 'Photography' },
    { id: 's3', name: 'Traditional Cinematography / Video', price: 20000, category: 'Videography' },
    { id: 's4', name: 'Cinematic Teaser & Highlight Film', price: 35000, category: 'Videography' },
    { id: 's5', name: 'Drone Aerial Shoot', price: 10000, category: 'Special' },
    { id: 's6', name: 'Premium Photobook Album (40 Pages)', price: 12000, category: 'Album' },
  ];

  // Default Pre-built Packages
  const defaultPackages: PrebuiltPackage[] = [
    {
      id: 'pkg-silver',
      title: 'Silver Wedding Package',
      price: 35000,
      description: 'Traditional Photography + Traditional Videography',
      serviceIds: ['s1', 's3'],
    },
    {
      id: 'pkg-gold',
      title: 'Gold Cinematic Package',
      price: 70000,
      description: 'Candid Photography + Cinematic Teaser/Highlight + Photobook Album',
      serviceIds: ['s2', 's4', 's6'],
    },
    {
      id: 'pkg-platinum',
      title: 'Platinum Grand Royal Package',
      price: 110000,
      description: 'Complete Photography, Cinematography, Drone & Photobook Coverage',
      serviceIds: ['s1', 's2', 's3', 's4', 's5', 's6'],
    },
  ];

  const [availableServices, setAvailableServices] = useState<SelectedService[]>(defaultServices);
  const [packages, setPackages] = useState<PrebuiltPackage[]>(defaultPackages);

  useEffect(() => {
    try {
      const storedServices = localStorage.getItem('vk_master_services');
      if (storedServices) {
        setAvailableServices(JSON.parse(storedServices));
      }
      const storedPackages = localStorage.getItem('vk_master_packages');
      if (storedPackages) {
        setPackages(JSON.parse(storedPackages));
      }
    } catch (e) {
      console.error('Error loading custom services', e);
    }
  }, []);

  // Selection Logic
  const handleSelectPackage = (pkg: PrebuiltPackage) => {
    setSelectedPackageId(pkg.id);
    const matched = availableServices.filter((s) => pkg.serviceIds.includes(s.id));
    setSelectedServices(matched);
  };

  const handleToggleService = (service: SelectedService) => {
    setSelectedPackageId(null);
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const totalValuation = selectedServices.reduce((sum, item) => sum + item.price, 0);

  const handleGenerateProposal = () => {
    if (!clientName.trim()) {
      alert('Kripya pehle Client Full Name bharein.');
      return;
    }
    if (selectedServices.length === 0) {
      alert('Kripya Kam se kam ek Package ya Service select karein.');
      return;
    }
    setShowProposal(true);
  };

  const handleFinalSubmitBooking = () => {
    const bookingRef = `VKCREATION-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBookingObj = {
      bookingNumber: bookingRef,
      clientName: clientName,
      clientPhone: clientPhone,
      eventDate: eventDate || 'TBD',
      venue: venue || 'Indore',
      totalAmount: totalValuation,
      advanceRequired: 0,
      advancePaid: 0,
      remainingBalance: totalValuation,
      status: 'Pending Studio Review',
      createdAt: new Date().toISOString(),
      services: selectedServices.map((s) => s.name),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('vk_creation_bookings') || '[]');
      localStorage.setItem('vk_creation_bookings', JSON.stringify([newBookingObj, ...existing]));
    } catch (e) {
      console.error('Save Error', e);
    }

    alert(`🎉 Inquiry Submitted Successfully!\n\nBooking Reference: ${bookingRef}`);
    setShowProposal(false);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 md:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-stone-800 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">
            VK Creation Studio
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-stone-100">
            Package Estimator
          </h1>
        </div>

        <Link
          href="/"
          className="rounded-xl border border-stone-700 bg-stone-900 px-3 py-2 text-xs font-semibold text-stone-200"
        >
          ← Home
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Client Inputs */}
          <div className="bg-stone-900 border border-stone-800 p-4 sm:p-6 rounded-2xl space-y-4">
            <h2 className="text-xs sm:text-sm font-bold text-amber-500 uppercase tracking-wider">
              1. Client & Event Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1 font-medium">Client Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter name..."
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-medium">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 919876543210"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-medium">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-medium">Venue Location</label>
                <input
                  type="text"
                  placeholder="e.g. Indore"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 2. TAB SWITCHER AND SELECTION */}
          <div className="bg-stone-900 border border-stone-800 p-4 sm:p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3 gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-amber-500 uppercase tracking-wider">
                2. Choose Coverage
              </h2>

              {/* Pure Click Tabs */}
              <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs gap-1">
                <button
                  type="button"
                  onClick={() => setBuilderTab('packages')}
                  className={`px-3 py-2 rounded-lg font-bold transition ${
                    builderTab === 'packages' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
                  }`}
                >
                  📦 Packages
                </button>
                <button
                  type="button"
                  onClick={() => setBuilderTab('custom')}
                  className={`px-3 py-2 rounded-lg font-bold transition ${
                    builderTab === 'custom' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
                  }`}
                >
                  ⚡ Custom Choice
                </button>
              </div>
            </div>

            {/* TAB 1: Studio Packages */}
            {builderTab === 'packages' && (
              <div className="grid grid-cols-1 gap-3">
                {packages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handleSelectPackage(pkg)}
                      className={`w-full text-left p-4 rounded-xl border flex justify-between items-center transition ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-stone-100 ring-2 ring-amber-500/30'
                          : 'bg-stone-950 border-stone-800 text-stone-400'
                      }`}
                    >
                      <div className="pr-2">
                        <strong className="text-sm font-bold text-stone-100 block">{pkg.title}</strong>
                        <p className="text-xs text-stone-400">{pkg.description}</p>
                      </div>
                      <span className="text-sm font-mono font-bold text-amber-400 shrink-0">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB 2: Custom Choice */}
            {builderTab === 'custom' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableServices.map((service) => {
                  const isChecked = selectedServices.some((s) => s.id === service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleToggleService(service)}
                      className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition ${
                        isChecked
                          ? 'bg-amber-500/20 border-amber-500 text-stone-100 ring-2 ring-amber-500/30'
                          : 'bg-stone-950 border-stone-800 text-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold ${
                          isChecked ? 'bg-amber-500 text-stone-950 border-amber-500' : 'border-stone-700'
                        }`}>
                          {isChecked ? '✓' : ''}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-stone-100">{service.name}</p>
                          <span className="text-[10px] text-stone-500">{service.category}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                        ₹{service.price.toLocaleString('en-IN')}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Summary */}
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-4">
            <h2 className="text-xs sm:text-sm font-bold text-amber-500 uppercase tracking-wider">
              Proposal Summary
            </h2>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {selectedServices.length === 0 ? (
                <p className="text-xs text-stone-500 italic py-2">No items selected yet.</p>
              ) : (
                selectedServices.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-stone-300 border-b border-stone-800/60 pb-1.5 gap-2">
                    <span className="truncate flex-1">{item.name}</span>
                    <span className="font-mono text-amber-400 font-bold whitespace-nowrap">₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-stone-800 text-xs font-mono flex justify-between items-center">
              <span className="text-stone-400">Total Valuation:</span>
              <span className="text-base font-black text-amber-400">₹{totalValuation.toLocaleString('en-IN')}</span>
            </div>

            <button
              type="button"
              onClick={handleGenerateProposal}
              className="w-full bg-amber-500 text-stone-950 font-extrabold py-3.5 rounded-xl text-xs active:scale-95 transition"
            >
              Generate Proposal Quote →
            </button>
          </div>
        </div>
      </div>

      {/* Modal View */}
      {showProposal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 w-full max-w-2xl rounded-3xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h2 className="text-lg font-bold text-amber-400">Official Proposal Quote</h2>
              <button
                type="button"
                onClick={() => setShowProposal(false)}
                className="text-stone-400 hover:text-stone-100 font-bold p-1 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs bg-stone-950 p-4 rounded-xl border border-stone-800">
              <p>Client Name: <strong className="text-stone-100">{clientName}</strong></p>
              <p>Phone: <strong className="text-stone-300">{clientPhone || 'Not Provided'}</strong></p>
              <p>Total Amount: <strong className="text-amber-400 font-mono">₹{totalValuation.toLocaleString('en-IN')}</strong></p>
            </div>

            <button
              type="button"
              onClick={handleFinalSubmitBooking}
              className="w-full bg-amber-500 text-stone-950 font-black py-3.5 rounded-xl text-xs active:scale-95 transition"
            >
              🔒 Submit Booking Request to Studio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}