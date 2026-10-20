'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CatalogRepository, CustomServiceItem, PackageItem, StudioBrandingRepository } from '@/lib/catalogRepository';

export default function AdminPackagesManagerPage() {
  const [services, setServices] = useState<CustomServiceItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [sealImage, setSealImage] = useState<string | null>(null);

  // Service Form State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');

  // Package Form State
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgDesc, setPkgDesc] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [customInclusions, setCustomInclusions] = useState('');

  const loadData = async () => {
    const fetchedServices = await CatalogRepository.getServices();
    const fetchedPackages = await CatalogRepository.getPackages();
    const fetchedSeal = await StudioBrandingRepository.getSealImage();

    setServices(fetchedServices);
    setPackages(fetchedPackages);
    setSealImage(fetchedSeal);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🖊️ Handle Seal Image Upload
  const handleSealUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setSealImage(base64);
      await StudioBrandingRepository.saveSealImage(base64);
      alert('🎉 Studio Official Seal uploaded & synced to Cloud!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSeal = async () => {
    if (!confirm('Official seal image remove karein?')) return;
    await StudioBrandingRepository.removeSealImage();
    setSealImage(null);
  };

  // Handle Add/Update Custom Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !servicePrice) return;

    let updated: CustomServiceItem[] = [];
    if (editingServiceId) {
      updated = services.map((s) => {
        if (s.id === editingServiceId) {
          return {
            ...s,
            name: serviceName.trim(),
            price: Number(servicePrice),
            category: serviceCategory.trim() || 'General',
          };
        }
        return s;
      });
      alert('✅ Service updated successfully!');
    } else {
      const newItem: CustomServiceItem = {
        id: `s-${Date.now().toString().slice(-4)}`,
        name: serviceName.trim(),
        price: Number(servicePrice),
        category: serviceCategory.trim() || 'General',
      };
      updated = [...services, newItem];
      alert('✅ New Custom Service added!');
    }

    setServices(updated);
    await CatalogRepository.saveServices(updated);
    resetServiceForm();
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setServiceName('');
    setServicePrice('');
    setServiceCategory('');
  };

  const handleEditServiceClick = (s: CustomServiceItem) => {
    setEditingServiceId(s.id);
    setServiceName(s.name);
    setServicePrice(String(s.price));
    setServiceCategory(s.category);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom service?')) return;
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    await CatalogRepository.saveServices(updated);
  };

 // Handle Add/Update Package (FIXED: Strictly use user entered price)
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgTitle.trim() || !pkgPrice) return;

    // Direct input price without auto-calculation or rounding
    const finalPrice = Number(pkgPrice);

    const formattedDesc = customInclusions.trim()
      ? `${pkgDesc.trim()} | Extra Inclusions: ${customInclusions.trim()}`
      : pkgDesc.trim();

    let updated: PackageItem[] = [];

    if (editingPkgId) {
      updated = packages.map((p) => {
        if (p.id === editingPkgId) {
          return {
            ...p,
            title: pkgTitle.trim(),
            price: finalPrice, // 👈 Strictly saves exact 60000
            description: formattedDesc || 'Custom Package',
            serviceIds: selectedServiceIds,
          };
        }
        return p;
      });
      alert('✅ Package updated successfully!');
    } else {
      const newPkg: PackageItem = {
        id: `pkg-${Date.now().toString().slice(-4)}`,
        title: pkgTitle.trim(),
        price: finalPrice, // 👈 Strictly saves exact 60000
        description: formattedDesc || 'Custom Package',
        serviceIds: selectedServiceIds,
      };
      updated = [...packages, newPkg];
      alert('🎉 New Package created!');
    }

    setPackages(updated);
    await CatalogRepository.savePackages(updated);
    resetPackageForm();
  };

  const resetPackageForm = () => {
    setEditingPkgId(null);
    setPkgTitle('');
    setPkgPrice('');
    setPkgDesc('');
    setSelectedServiceIds([]);
    setCustomInclusions('');
  };

  const handleEditPkgClick = (pkg: PackageItem) => {
    setEditingPkgId(pkg.id);
    setPkgTitle(pkg.title);
    setPkgPrice(String(pkg.price));
    setPkgDesc(pkg.description);
    setSelectedServiceIds(pkg.serviceIds || []);
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Delete this package permanently?')) return;
    const updated = packages.filter((p) => p.id !== id);
    setPackages(updated);
    await CatalogRepository.savePackages(updated);
  };

  const toggleServiceSelection = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      setSelectedServiceIds(selectedServiceIds.filter((item) => item !== id));
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  const existingCategories = Array.from(new Set(services.map((s) => s.category))).filter(Boolean);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-800 pb-4 gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
            Studio Master Control (Cloud Firestore Active)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 mt-1">
            PACKAGE & EXTRA SERVICES EDITOR
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage packages, custom categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin?settings=open"
            className="rounded-xl border border-stone-800 bg-stone-900 hover:border-stone-700 px-4 py-2 text-xs font-bold text-stone-300 transition"
          >
            🌐 Back to settings 
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


        {/* edit PACKAGES */}
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider">
                {editingPkgId ? '✏️ Edit Package' : '📦 2. Create/Edit Package'}
              </h2>
              {editingPkgId && (
                <button type="button" onClick={resetPackageForm} className="text-[10px] text-amber-400 font-bold underline">
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSavePackage} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Wedding Package"
                  value={pkgTitle}
                  onChange={(e) => setPkgTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Package Fixed Price (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 125000"
                  value={pkgPrice}
                  onChange={(e) => setPkgPrice(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Traditional photography , Traditional videography ... etc"
                  value={pkgDesc}
                  onChange={(e) => setPkgDesc(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-bold">Select from Services Catalog:</label>
                <div className="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto bg-stone-950 p-2 rounded-xl border border-stone-800">
                  {services.map((s) => {
                    const isSelected = selectedServiceIds.includes(s.id);
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => toggleServiceSelection(s.id)}
                        className={`p-2 rounded-lg text-left flex justify-between items-center ${
                          isSelected ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300' : 'text-stone-400'
                        }`}
                      >
                        <span>{s.name}</span>
                        <span className="font-bold text-[10px]">{isSelected ? '✓ Included' : '+ Add'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Extra Services</label>
                <input
                  type="text"
                  placeholder="e.g. Free 16x24 Frame , Free Calendar"
                  value={customInclusions}
                  onChange={(e) => setCustomInclusions(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition"
              >
                {editingPkgId ? 'Update Package' : '+ Save Package'}
              </button>
            </form>
          </div>

          <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider border-b border-stone-800 pb-2">
              Configured Packages ({packages.length})
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex justify-between items-center text-xs"
                >
                  <div>
                    <strong className="text-stone-200 block">{pkg.title}</strong>
                    <p className="text-[10px] text-stone-500 max-w-xs truncate">{pkg.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-amber-400">₹{pkg.price.toLocaleString('en-IN')}</span>
                    <button onClick={() => handleEditPkgClick(pkg)} className="text-stone-400 hover:text-amber-400">✏️</button>
                    <button onClick={() => handleDeletePackage(pkg.id)} className="text-stone-600 hover:text-rose-400">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

                {/* CUSTOM SERVICES */}
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider">
                {editingServiceId ? '✏️ Edit Service Item' : '⚡ 1. CREATE/EDIT EXTRA SERVICES'}
              </h2>
              {editingServiceId && (
                <button
                  type="button"
                  onClick={resetServiceForm}
                  className="text-[10px] text-amber-400 font-bold underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 360 Booth / Live Stream"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15000"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Description *</label>
                  <input
                    type="text"
                    required
                    list="categories-list"
                    placeholder="Pick or type"
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                  <datalist id="categories-list">
                    {existingCategories.map((cat, i) => (
                      <option key={i} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition"
              >
                {editingServiceId ? 'Update Service' : '+ Save Custom Service'}
              </button>
            </form>
          </div>

          <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider border-b border-stone-800 pb-2">
              Services Catalog ({services.length})
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex justify-between items-center text-xs"
                >
                  <div>
                    <strong className="text-stone-200 block">{s.name}</strong>
                    <span className="text-[10px] text-amber-500 font-bold uppercase">{s.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-emerald-400">₹{s.price.toLocaleString('en-IN')}</span>
                    <button onClick={() => handleEditServiceClick(s)} className="text-stone-400 hover:text-amber-400">✏️</button>
                    <button onClick={() => handleDeleteService(s.id)} className="text-stone-600 hover:text-rose-400">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}