'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ShootEvent {
  id: string;
  bookingRef: string;
  clientName: string;
  clientPhone: string;
  eventDate: string;
  venue: string;
  shootType: string;
  teamAssigned: string;
  status: string;
}

export default function AdminShootsPage() {
  const [shoots, setShoots] = useState<ShootEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Shoot Form State
  const [clientName, setClientName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [shootType, setShootType] = useState('Wedding Shoot');
  const [teamAssigned, setTeamAssigned] = useState('');

  // Load Shoots synced with actual bookings in LocalStorage
  const loadShootsData = () => {
    try {
      const storedBookings = JSON.parse(localStorage.getItem('vk_creation_bookings') || '[]');
      const manualShoots = JSON.parse(localStorage.getItem('vk_manual_shoots') || '[]');

      // Extract shoots from client bookings that have an event date
      const bookingShoots: ShootEvent[] = storedBookings
        .filter((b: any) => b.eventDate && b.eventDate !== 'TBD')
        .map((b: any, index: number) => ({
          id: `SHOOT-${101 + index}`,
          bookingRef: b.bookingNumber || `VKCREATION-${100 + index}`,
          clientName: b.clientName || 'Client',
          clientPhone: b.clientPhone || 'N/A',
          eventDate: b.eventDate,
          venue: b.venue || 'Indore',
          shootType: Array.isArray(b.services) ? b.services[0] : 'Full Coverage',
          teamAssigned: b.teamAssigned || 'Team Unassigned',
          status: b.status === 'Confirmed & Scheduled' ? 'Confirmed' : 'Scheduled',
        }));

      // Combine booking shoots with manually created ones
      setShoots([...bookingShoots, ...manualShoots]);
    } catch (e) {
      console.error('Error loading shoots:', e);
      setShoots([]);
    }
  };

  useEffect(() => {
    loadShootsData();
  }, []);

  const handleCreateManualShoot = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !eventDate) {
      alert('Kripya Client Name aur Event Date fill karein!');
      return;
    }

    const newShoot: ShootEvent = {
      id: `SHOOT-${Date.now().toString().slice(-4)}`,
      bookingRef: `MANUAL-${Math.floor(100 + Math.random() * 900)}`,
      clientName: clientName.trim(),
      clientPhone: 'Direct Entry',
      eventDate,
      venue: venue || 'Indore',
      shootType,
      teamAssigned: teamAssigned || 'Team Lead',
      status: 'Scheduled',
    };

    try {
      const existingManual = JSON.parse(localStorage.getItem('vk_manual_shoots') || '[]');
      localStorage.setItem('vk_manual_shoots', JSON.stringify([newShoot, ...existingManual]));
      
      setClientName('');
      setEventDate('');
      setVenue('');
      setTeamAssigned('');
      setShowAddModal(false);
      
      loadShootsData();
      alert('🎉 Shoot schedule add ho gaya!');
    } catch (err) {
      console.error('Error saving shoot:', err);
    }
  };

  const handleDeleteShoot = (id: string) => {
    if (!confirm('Kya aap is shoot schedule ko remove karna chahte hain?')) return;

    try {
      const manualShoots = JSON.parse(localStorage.getItem('vk_manual_shoots') || '[]');
      const updatedManual = manualShoots.filter((s: ShootEvent) => s.id !== id);
      localStorage.setItem('vk_manual_shoots', JSON.stringify(updatedManual));
      loadShootsData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-4 gap-4">
        <div>
          <span className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase tracking-widest">
            Production & Field Logistics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 mt-1">
            Shoot Schedules & Calendar
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage upcoming photography/videography events, venues, and crew assignments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin?settings=open"
            className="rounded-xl border border-stone-800 bg-stone-900 hover:border-stone-700 px-4 py-2 text-xs font-bold text-stone-300 transition"
          >
           🌐Back to settings 
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-stone-950 transition"
          >
            + Schedule Shoot
          </button>
        </div>
      </div>

      {/* Shoots Table */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 sm:p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-stone-800 pb-3">
          <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider">
            🎥 Scheduled Shoots ({shoots.length})
          </h2>
          <button
            onClick={loadShootsData}
            className="text-xs font-bold text-stone-400 hover:text-stone-200"
          >
            🔄 Sync
          </button>
        </div>

        {shoots.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <span className="text-4xl block">🎬</span>
            <p className="text-xs text-stone-400">No scheduled shoots found.</p>
            <p className="text-[11px] text-stone-600">
              Jab aap Admin Panel se event date ke saath booking confirm karenge ya "+ Schedule Shoot" daba kar manually enter karenge, tab shoots yahan show honge.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-162.5">
              <thead className="bg-stone-950 text-stone-400 font-semibold border-b border-stone-800">
                <tr>
                  <th className="p-3">Shoot ID</th>
                  <th className="p-3">Client Details</th>
                  <th className="p-3">Event Date & Venue</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Crew Assigned</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {shoots.map((shoot) => (
                  <tr key={shoot.id} className="hover:bg-stone-900/40 transition">
                    <td className="p-3 font-mono font-bold text-amber-400">{shoot.id}</td>
                    <td className="p-3">
                      <strong className="text-stone-200 block">{shoot.clientName}</strong>
                      <span className="text-stone-500 text-[10px]">{shoot.bookingRef}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-stone-200 font-medium block">📅 {shoot.eventDate}</span>
                      <span className="text-stone-500 text-[10px]">📍 {shoot.venue}</span>
                    </td>
                    <td className="p-3 text-stone-300">{shoot.shootType}</td>
                    <td className="p-3 font-mono text-stone-400">{shoot.teamAssigned}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-amber-500/10 text-amber-400 border-amber-500/30">
                        {shoot.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteShoot(shoot.id)}
                        className="bg-stone-900 hover:bg-rose-950 text-stone-500 hover:text-rose-400 p-1.5 rounded-lg text-xs transition"
                        title="Delete Schedule"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🎬 MANUAL SHOOT ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateManualShoot}
            className="bg-stone-900 border border-stone-700 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl relative text-stone-100"
          >
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="text-base font-bold text-amber-400">➕ Schedule New Shoot</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-100 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Event Date *</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Venue Location</label>
                <input
                  type="text"
                  placeholder="e.g. Sayaji Hotel, Indore"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Shoot Category</label>
                <select
                  value={shootType}
                  onChange={(e) => setShootType(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Wedding Shoot">Wedding Shoot</option>
                  <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                  <option value="Engagement / Ring Ceremony">Engagement / Ring Ceremony</option>
                  <option value="Corporate / Commercial Event">Corporate / Commercial Event</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Crew / Team Assigned</label>
                <input
                  type="text"
                  placeholder="e.g. Lead: Vinay + Drone: Rohit"
                  value={teamAssigned}
                  onChange={(e) => setTeamAssigned(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition"
              >
                Save Schedule
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-4 py-2.5 rounded-xl text-xs transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}