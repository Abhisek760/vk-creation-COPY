'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PackagePreset } from '@/types/package';
import { getStoredPackages, savePackageToStorage } from '@/lib/storage';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackagePreset[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackagePreset | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    price: 0,
    popular: false,
    deliverablesText: '',
    termsSummary: '',
  });

  useEffect(() => {
    const loaded = getStoredPackages();
    setPackages(loaded);
  }, []);

  const handleOpenCreateModal = () => {
    setEditingPkg(null);
    setFormData({
      name: '',
      tagline: '',
      price: 100000,
      popular: false,
      deliverablesText: '300+ Edited Photos\nHD Highlight Video\n1 Premium Album',
      termsSummary: '40% advance payment required upon booking.',
    });
    setIsModalOpen(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const deliverables = formData.deliverablesText.split('\n').filter((s) => s.trim() !== '');

    const newPackage: PackagePreset = {
      id: editingPkg ? editingPkg.id : `PKG-${Date.now()}`,
      name: formData.name,
      tagline: formData.tagline,
      price: Number(formData.price),
      popular: formData.popular,
      includedServices: editingPkg ? editingPkg.includedServices : [],
      deliverables,
      termsSummary: formData.termsSummary,
    };

    savePackageToStorage(newPackage);
    const updated = getStoredPackages();
    setPackages(updated);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6 md:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-stone-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-100">Package Preset Manager</h1>
          <p className="text-sm text-stone-400 mt-1">
            Configure standard studio packages (Silver, Gold, Luxury) for 1-click quotation creation.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleOpenCreateModal}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition"
          >
            + Create New Package Preset
          </button>
          <Link
            href="/admin"
            className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-200 hover:bg-stone-800"
          >
            ← Admin Dashboard
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="rounded-xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-stone-100">{pkg.name}</h3>
                <p className="text-xs text-stone-400">{pkg.tagline}</p>
              </div>
              {pkg.popular && (
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/40">
                  POPULAR
                </span>
              )}
            </div>

            <p className="text-3xl font-extrabold text-amber-500">
              ₹ {pkg.price.toLocaleString('en-IN')}
            </p>

            <div className="space-y-1 text-xs text-stone-300 border-t border-stone-800 pt-3">
              <span className="font-semibold text-stone-400 block mb-1">Deliverables:</span>
              {pkg.deliverables.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="text-xs text-stone-400 border-t border-stone-800 pt-3">
              <strong className="text-stone-300">Terms:</strong> {pkg.termsSummary}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSavePackage}
            className="w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-900 p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold text-stone-100">Configure Package Preset</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Wedding Package"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Tagline / Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Full 3-day coverage including pre-wedding"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Standard Package Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="rounded border-stone-800 bg-stone-950 text-amber-500 focus:ring-amber-500"
                    />
                    Mark as "Most Popular"
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Deliverables (One item per line)</label>
                <textarea
                  rows={4}
                  value={formData.deliverablesText}
                  onChange={(e) => setFormData({ ...formData, deliverablesText: e.target.value })}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Terms Summary</label>
                <input
                  type="text"
                  value={formData.termsSummary}
                  onChange={(e) => setFormData({ ...formData, termsSummary: e.target.value })}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-stone-800 bg-stone-950 px-4 py-2 text-xs text-stone-300 hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400"
              >
                Save Package Preset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}