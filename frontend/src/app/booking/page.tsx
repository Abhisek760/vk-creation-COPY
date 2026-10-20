'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2, ShieldCheck, Copy } from 'lucide-react';

export default function BookingPage() {
  const router = useRouter();
  
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedBookingRef, setBookingRef] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Kripya apna name aur phone number fill karein!');
      return;
    }

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newRef = `VKCREATION-${randomNum}`;
    setBookingRef(newRef);

    const newBooking = {
      bookingNumber: newRef,
      clientName,
      clientPhone,
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      venue: venue || 'Location Pending',
      totalAmount: 40000,
      advanceRequired: 0,
      advancePaid: 0,
      remainingBalance: 40000,
      status: 'Awaiting Admin Review',
      services: ['Wedding Coverage'],
      createdAt: new Date().toISOString(),
    };

    const existing1 = JSON.parse(localStorage.getItem('vk_creation_bookings') || '[]');
    const existing2 = JSON.parse(localStorage.getItem('vk_studio_bookings') || '[]');

    localStorage.setItem('vk_creation_bookings', JSON.stringify([newBooking, ...existing1]));
    localStorage.setItem('vk_studio_bookings', JSON.stringify([newBooking, ...existing2]));
    localStorage.setItem('last_booking_ref', newRef);

    setShowSuccessModal(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedBookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchPortal = () => {
    router.push(`/portal/${generatedBookingRef}`);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 sm:p-8 font-sans max-w-4xl mx-auto space-y-6">
      
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">
          VK_CREATION STUDIO
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Book Your Date
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm">
          Apni wedding coverage details fill karke request submit karein.
        </p>
      </div>

      <form onSubmit={handleSubmitRequest} className="bg-stone-900 border border-stone-800 p-5 sm:p-8 rounded-3xl space-y-5 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-stone-400 font-bold block mb-1">Your Name / Groom & Bride</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Abhishek & Priya"
              className="w-full bg-stone-950 border border-stone-800 text-white text-xs sm:text-sm rounded-xl p-3 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs text-stone-400 font-bold block mb-1">Phone Number (WhatsApp)</label>
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="e.g. 9644213129"
              className="w-full bg-stone-950 border border-stone-800 text-white text-xs sm:text-sm rounded-xl p-3 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs text-stone-400 font-bold block mb-1">Event Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 text-white text-xs sm:text-sm rounded-xl p-3 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-stone-400 font-bold block mb-1">Venue / City</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Indore / Bhopal"
              className="w-full bg-stone-950 border border-stone-800 text-white text-xs sm:text-sm rounded-xl p-3 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-stone-950 font-black py-4 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-amber-500/10"
        >
          <span>🚀 SUBMIT REQUEST & LAUNCH PORTAL →</span>
        </button>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/40 w-full max-w-md rounded-3xl p-6 text-center space-y-5 shadow-2xl relative text-stone-100 my-auto">
            
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block font-mono">
                PROPOSAL CREATED SUCCESSFULLY
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Congratulations🎉 , {clientName}!
              </h2>
            </div>

            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-3.5 flex items-center justify-between text-left">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold block font-mono">
                  Your Booking Ref ID
                </span>
                <span className="text-sm sm:text-base font-mono font-black text-amber-400 tracking-wider">
                  {generatedBookingRef}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer border border-stone-700"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={handleLaunchPortal}
              className="w-full bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 active:scale-[0.98] text-stone-950 font-black py-4 px-5 rounded-2xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>🚀 VIEW BOOKING & PAY ADVANCE →</span>
            </button>

            <div className="flex items-center justify-center gap-1 text-[10px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Direct access enabled. Manual Ref ID enter nahi karna padega.</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}