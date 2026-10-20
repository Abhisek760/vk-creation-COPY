'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CatalogRepository, CustomServiceItem, PackageItem } from '@/lib/catalogRepository';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function InteractiveProposalBuilderPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [customServices, setCustomServices] = useState<CustomServiceItem[]>([]);

  // 💑 Form States
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [bookedBy, setBookedBy] = useState<'groom' | 'bride' | 'other'>('groom');
  const [primaryContactPhone, setPrimaryContactPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');

  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  // Modal State
  const [submittedBookingRef, setSubmittedBookingRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
  const loadCatalogData = async () => {
    try {
      const pkgs = await CatalogRepository.getPackages();
      const services = await CatalogRepository.getServices();
      setPackages(pkgs);
      setCustomServices(services);
    } catch (error) {
      console.error('Error loading builder catalog:', error);
    }
  };

  loadCatalogData();
}, []);

  const selectedPackage = packages.find((p) => p.id === selectedPkgId);

  const calculateTotal = () => {
    let pkgTotal = selectedPackage ? selectedPackage.price : 0;
    let serviceTotal = selectedServiceIds.reduce((sum, id) => {
      const s = customServices.find((item) => item.id === id);
      return sum + (s ? s.price : 0);
    }, 0);
    return pkgTotal + serviceTotal;
  };

  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      setSelectedServiceIds(selectedServiceIds.filter((item) => item !== id));
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  // 🔤 Alphabet-Only Handlers for Names
  const handleGroomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyAlphabets = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setGroomName(onlyAlphabets);
  };

  const handleBrideNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyAlphabets = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setBrideName(onlyAlphabets);
  };

  // 📱 Number-Only Handler for WhatsApp Phone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNums = e.target.value.replace(/\D/g, '');
    if (onlyNums.length <= 10) {
      setPrimaryContactPhone(onlyNums);
    }
  };

  const getFormattedCoupleName = () => {
    const g = groomName.trim();
    const b = brideName.trim();

    if (g && b) return `${g} & ${b}`;
    if (g) return `${g} (Groom)`;
    if (b) return `${b} (Bride)`;
    return 'Valued Wedding Couple';
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🛑 Validations
    if (!groomName.trim()) {
      alert('⚠️ Kripya Dulhe (Groom) ka naam dalein.');
      return;
    }

    if (!brideName.trim()) {
      alert('⚠️ Kripya Dulhan (Bride) ka naam dalein.');
      return;
    }

    const cleanPhone = primaryContactPhone.trim();
    if (cleanPhone.length !== 10) {
      alert('⚠️ Kripya 10-digit ka WhatsApp Mobile Number enter karein.');
      return;
    }

    if (!venue.trim()) {
      alert('⚠️ Kripya Wedding Venue Location enter karein.');
      return;
    }

    setIsSubmitting(true);

    const newBookingRef = `VKCREATION-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalValuation = calculateTotal();
    const formattedCoupleName = getFormattedCoupleName();

    const selectedServiceNames: string[] = [];
    if (selectedPackage) selectedServiceNames.push(selectedPackage.title);
    selectedServiceIds.forEach((id) => {
      const s = customServices.find((item) => item.id === id);
      if (s) selectedServiceNames.push(s.name);
    });

    const newBooking = {
      bookingNumber: newBookingRef,
      clientName: formattedCoupleName,
      groomName: groomName.trim(),
      brideName: brideName.trim(),
      bookedBy: bookedBy,
      clientPhone: cleanPhone,
      eventDate: eventDate || 'TBD',
      venue: venue.trim(),
      totalAmount: totalValuation,
      advanceRequired: 0,
      advancePaid: 0,
      remainingBalance: totalValuation,
      status: 'Awaiting Client Payment',
      services: selectedServiceNames.length > 0 ? selectedServiceNames : ['Custom Photography Package'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // 🌐 1. FIREBASE FIRESTORE CLOUD DATABASE SAVE (Instantly Syncs to Admin Panel Across Devices)
      try {
        await setDoc(doc(db, 'bookings', newBookingRef), newBooking);
      } catch (fsErr) {
        console.warn('Firestore Cloud Save Notice:', fsErr);
      }

      // 💾 2. LOCAL STORAGE BACKUP
      const updateKey = (key: string) => {
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        localStorage.setItem(key, JSON.stringify([newBooking, ...stored]));
      };

      updateKey('vk_creation_bookings');
      updateKey('vk_studio_bookings');
      localStorage.setItem('last_booking_ref', newBookingRef);

      // Trigger custom storage event for local listeners
      window.dispatchEvent(new Event('vk_booking_updated'));

      setSubmittedBookingRef(newBookingRef);

      // Optional SMS Send
      fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          bookingRef: newBookingRef,
          groomName: groomName.trim(),
          brideName: brideName.trim(),
        }),
      }).catch((err) => console.error('SMS Error:', err));

    } catch (e) {
      console.error(e);
      alert('Error submitting proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (submittedBookingRef) {
      navigator.clipboard.writeText(submittedBookingRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDirectLaunchPortal = () => {
    if (submittedBookingRef) {
      router.push(`/portal/${submittedBookingRef}`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-3 sm:p-6 md:p-10 max-w-5xl mx-auto space-y-6 sm:space-y-8 font-sans">
      {/* Top Header */}
      <div className="border-b border-stone-800 pb-4 sm:pb-5">
        <span className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase tracking-widest block font-mono">
          VK_CREATION STUDIO
        </span>
        <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-stone-100 mt-1">
          Select Your Package And Extra Services
        </h1>
        <p className="text-[11px] sm:text-xs text-stone-400 mt-1 leading-relaxed">
          Select your customized wedding photography & film requirements to generate an instant quotation.
        </p>
      </div>

      <form onSubmit={handleSubmitProposal} className="space-y-6 sm:space-y-8">
        
        {/* STEP 1: COUPLE & EVENT DETAILS */}
        <div className="bg-stone-900 border border-stone-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-3 gap-2">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <span>💑</span> STEP 1: WEDDING COUPLE & BOOKING DETAILS
            </h2>
            <span className="text-[9px] sm:text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-mono self-start sm:self-auto">
              Couple Registration
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 text-xs">
            {/* Groom Name */}
            <div>
              <label className="block text-stone-300 font-bold mb-1">
                🤵 Groom's Name (Dulhe ka naam) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Abhishek"
                value={groomName}
                onChange={handleGroomNameChange}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Bride Name */}
            <div>
              <label className="block text-stone-300 font-bold mb-1">
                👰 Bride's Name (Dulhan ka naam) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Priya"
                value={brideName}
                onChange={handleBrideNameChange}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Who is Booking? */}
            <div>
              <label className="block text-stone-300 font-bold mb-1">
                📝 Booking Person Role *
              </label>
              <select
                value={bookedBy}
                onChange={(e: any) => setBookedBy(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              >
                <option value="groom">🤵 Groom (Dulha) Himself</option>
                <option value="bride">👰 Bride (Dulhan) Herself</option>
                <option value="other">👨‍👩‍👧 Relative / Friend</option>
              </select>
            </div>

            {/* Contact WhatsApp Phone */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-stone-300 font-bold">
                  📱 Primary WhatsApp Phone *
                </label>
                <span className="text-[10px] text-stone-400 font-mono">
                  {primaryContactPhone.length}/10 Digits
                </span>
              </div>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="e.g. 9753820740"
                value={primaryContactPhone}
                onChange={handlePhoneChange}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-stone-300 font-bold mb-1">
                📅 Event Date
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Venue Location */}
            <div>
              <label className="block text-stone-300 font-bold mb-1">
                📍 Primary Venue Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Indore / Biaora / Bhopal"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {(groomName || brideName) && (
            <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between font-mono text-xs gap-1">
              <span className="text-stone-400">Portal & Invoices Display Title:</span>
              <strong className="text-amber-400 font-bold text-xs sm:text-sm">
                ✨ {getFormattedCoupleName()}
              </strong>
            </div>
          )}
        </div>

        {/* STEP 2: CHOOSE PACKAGE */}
        <div className="bg-stone-900 border border-stone-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4 shadow-xl">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            📦 STEP 2: CHOOSE PACKAGE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {packages.map((pkg) => {
              const isSelected = selectedPkgId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkgId(isSelected ? null : pkg.id)}
                  className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-stone-100 shadow-lg shadow-amber-500/10'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="space-y-1">
                    <strong className="block text-stone-100 text-sm sm:text-base">{pkg.title}</strong>
                    <p className="text-[11px] sm:text-xs text-stone-400 leading-relaxed">{pkg.description}</p>
                  </div>

                  <div className="flex justify-between items-center border-t border-stone-800/80 pt-3">
                    <span className="text-amber-400 font-mono font-bold text-sm sm:text-base">
                      ₹{pkg.price.toLocaleString('en-IN')}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      isSelected ? 'bg-amber-500 text-stone-950 border-amber-400' : 'border-stone-800 text-stone-500'
                    }`}>
                      {isSelected ? '✓ Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 3: CUSTOM ADD-ON SERVICES */}
        <div className="bg-stone-900 border border-stone-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4 shadow-xl">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            ⚡ STEP 3: IF WANT ADD-ON EXTRA SERVICES
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customServices.map((service) => {
              const isSelected = selectedServiceIds.includes(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex justify-between items-center text-xs ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-stone-100'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="pr-2">
                    <strong className="text-stone-200 block text-xs sm:text-sm">{service.name}</strong>
                    <span className="text-[9px] sm:text-[10px] text-amber-500/80 font-bold uppercase">{service.category}</span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="font-mono font-bold text-emerald-400 text-xs sm:text-sm">₹{service.price.toLocaleString('en-IN')}</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                      isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-500'
                    }`}>
                      {isSelected ? '✓ Added' : '+ Add'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 4: BOTTOM VALUATION BAR */}
        <div className="bg-stone-900 border-2 border-amber-500/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-2xl">
          <div className="text-center sm:text-left space-y-0.5">
            <span className="text-[10px] text-amber-400 font-mono uppercase tracking-widest block">
              Estimated Total
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              ₹{calculateTotal().toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] sm:text-[11px] text-stone-400">Includes all selected packages & choice service inclusions.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs uppercase tracking-wider transition shadow-xl shadow-amber-500/20 active:scale-95 whitespace-nowrap cursor-pointer font-mono"
          >
            {isSubmitting ? '⌛ Syncing with Cloud Hub...' : '🚀 Submit Request & Launch Portal →'}
          </button>
        </div>
      </form>

      {/* 🌟 PREFERRED POP-UP MODAL */}
      {submittedBookingRef && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-amber-500/40 w-full max-w-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center space-y-4 sm:space-y-5 shadow-2xl relative text-stone-100 my-auto">
            
            {/* Checkmark Icon */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-500 uppercase tracking-widest block font-mono">
                PROPOSAL CREATED SUCCESSFULLY
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-white mt-1">
                Congratulations🎉 , {getFormattedCoupleName()}!
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Aapke wedding proposal details Cloud database par save ho gaye hain.
              </p>
            </div>

            {/* Ref Number Box */}
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between text-left">
              <div>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-500 font-bold block font-mono">
                  YOUR BOOKING REF ID
                </span>
                <span className="text-xs sm:text-base font-mono font-black text-amber-400 tracking-wider">
                  {submittedBookingRef}
                </span>
              </div>
              <button
                onClick={handleCopy}
                type="button"
                className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer border border-stone-700 font-mono"
              >
                <span>{copied ? 'Copied!' : '📋 Copy'}</span>
              </button>
            </div>

            {/* Guidance */}
            <div className="bg-stone-950/60 border border-stone-800 p-3 sm:p-3.5 rounded-2xl text-left space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-amber-500 uppercase font-mono block">
                📋 NEXT STEPS FOR YOUR BOOKING:
              </span>
              <p className="text-stone-300 text-[10px] sm:text-[11px] leading-relaxed">
                1. <strong>Direct Launch:</strong> Niche button par click karke apna VIP Portal kholein.
              </p>
              <p className="text-stone-300 text-[10px] sm:text-[11px] leading-relaxed">
                2. <strong>Admin Live Alert:</strong> Aapki request Admin Control Center ko notify kar di gayi hai.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDirectLaunchPortal}
              className="w-full bg-linear-to-r from-amber-500 to-amber-400 text-stone-950 font-black py-4 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition font-mono cursor-pointer"
            >
              🚀 LAUNCH VIP CLIENT PORTAL NOW →
            </button>

          </div>
        </div>
      )}

    </div>
  );
}