'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudioService } from '@/types/service';

const DEFAULT_SERVICES: StudioService[] = [
  { id: 'srv-1', name: 'Traditional Candid Photography', category: 'Photography', rate: 25000, unit: 'Per Day' },
  { id: 'srv-2', name: 'Cinematic 4K Wedding Film', category: 'Videography', rate: 35000, unit: 'Per Day' },
  { id: 'srv-3', name: '4K Drone Aerial Coverage', category: 'Drone', rate: 12000, unit: 'Per Day' },
  { id: 'srv-4', name: 'Flush Mount Photobook (40 Pages)', category: 'Album', rate: 18000, unit: 'Per Book' },
  { id: 'srv-5', name: 'Teaser & Reel Edit (Vertical)', category: 'Editing', rate: 8000, unit: 'Per Reel' },
  { id: 'srv-6', name: 'Same-Day Edit Teaser Screening', category: 'Editing', rate: 15000, unit: 'Per Event' },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<StudioService[]>([]);
  const [editingService, setEditingService] = useState<StudioService | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vk_studio_services');
    if (saved) {
      try {
        setServices(JSON.parse(saved));
      } catch (e) {
        setServices(DEFAULT_SERVICES);
      }
    } else {
      setServices(DEFAULT_SERVICES);
      localStorage.setItem('vk_studio_services', JSON.stringify(DEFAULT_SERVICES));
    }
  }, []);

  const saveServicesToStorage = (updated: StudioService[]) => {
    setServices(updated);
    localStorage.setItem('vk_studio_services', JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this standalone service?')) {
      const updated = services.filter((s) => s.id !== id);
      saveServicesToStorage(updated);
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const exists = services.some((s) => s.id === editingService.id);
    let updated: StudioService[];
    if (exists) {
      updated = services.map((s) => (s.id === editingService.id ? editingService : s));
    } else {
      updated = [...services, editingService];
    }

    saveServicesToStorage(updated);
    setEditingService(null);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6 md:p-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-100">Standalone Services & Add-on Rates</h1>
          <p className="text-sm text-stone-400 mt-1">
            Manage individual rate cards for extra camera operators, drone pilots, photobooks, and editing add-ons without code.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() =>
              setEditingService({
                id: `srv-${Date.now()}`,
                name: 'New Service Add-on',
                category: 'Photography',
                rate: 10000,
                unit: 'Per Day',
              })
            }
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition"
          >
            + Add New Standalone Service
          </button>
          <Link
            href="/admin?settings=open" 
            className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-200 hover:bg-stone-800"
          >
            🌐Back to settings 
          </Link>
        </div>
      </div>

      {/* Services List Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-900/60 p-4">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-800 text-xs uppercase text-stone-400">
            <tr>
              <th className="py-3 px-4">Service Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Billing Unit</th>
              <th className="py-3 px-4">Standard Rate</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {services.map((srv) => (
              <tr key={srv.id} className="hover:bg-stone-800/40">
                <td className="py-3 px-4 font-semibold text-stone-200">{srv.name}</td>
                <td className="py-3 px-4">
                  <span className="rounded bg-stone-800 px-2.5 py-1 text-xs font-medium text-amber-400 border border-stone-700">
                    {srv.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-stone-400">{srv.unit || 'Per Day'}</td>
                <td className="py-3 px-4 font-bold text-amber-400">
                  ₹{(srv.rate || srv.basePrice || 0).toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <button
                    onClick={() => setEditingService(srv)}
                    className="rounded bg-stone-800 px-3 py-1 text-xs font-medium text-stone-300 hover:bg-stone-700"
                  >
                    Edit Rate
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id)}
                    className="rounded bg-rose-950/40 text-rose-400 border border-rose-800/50 px-3 py-1 text-xs font-medium hover:bg-rose-900/40"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveService}
            className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold text-amber-500">Configure Service Rate</h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="text-stone-400 hover:text-stone-100"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Service Name *</label>
              <input
                type="text"
                required
                value={editingService.name}
                onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                className="w-full rounded bg-stone-950 border border-stone-800 p-2 text-sm text-stone-100 outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Category</label>
                <select
                  value={editingService.category}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                  className="w-full rounded bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
                >
                  <option value="Photography">Photography</option>
                  <option value="Videography">Videography</option>
                  <option value="Drone">Drone</option>
                  <option value="Album">Album</option>
                  <option value="Editing">Editing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Billing Unit</label>
                <select
                  value={editingService.unit || 'Per Day'}
                  onChange={(e) => setEditingService({ ...editingService, unit: e.target.value as any })}
                  className="w-full rounded bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
                >
                  <option value="Per Day">Per Day</option>
                  <option value="Per Event">Per Event</option>
                  <option value="Per Book">Per Book</option>
                  <option value="Per Reel">Per Reel</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Standard Rate (₹) *</label>
              <input
                type="number"
                required
                value={editingService.rate || editingService.basePrice || 0}
                onChange={(e) => setEditingService({ ...editingService, rate: Number(e.target.value) })}
                className="w-full rounded bg-stone-950 border border-stone-800 p-2 text-sm text-stone-100 outline-none focus:border-amber-500 font-bold text-amber-400."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="rounded-lg border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400"
              >
                Save Rate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}