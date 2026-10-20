'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GalleryRepository, DEFAULT_GALLERY_PHOTOS } from '@/lib/catalogRepository';

export default function AdminGalleryManagerPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  useEffect(() => {
    setPhotos(GalleryRepository.getPhotos());
  }, []);

  // 📂 Direct File Upload Handler (Phone Gallery / File Selector)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ Image size 5MB se choti honi chahiye.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const updated = [base64String, ...photos];
      setPhotos(updated);
      GalleryRepository.savePhotos(updated);
      alert('✅ Phone gallery se photo upload ho gayi hai!');
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhotoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const updated = [newPhotoUrl.trim(), ...photos];
    setPhotos(updated);
    GalleryRepository.savePhotos(updated);
    setNewPhotoUrl('');
    alert('✅ Photo link added to Memory Stream!');
  };

  const handleDeletePhoto = (index: number) => {
    if (!confirm('Delete this photo from memory stream?')) return;
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    GalleryRepository.savePhotos(updated);
  };

  const handleReset = () => {
    if (!confirm('Reset memory stream to default photos?')) return;
    setPhotos(DEFAULT_GALLERY_PHOTOS);
    GalleryRepository.savePhotos(DEFAULT_GALLERY_PHOTOS);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-800 pb-4 gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
            HOMEPAGE SHOWCASE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 mt-1">
            Google Photos Memory Stream Manager
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage photo stream displayed in the animated widget on studio homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="bg-stone-900 border border-stone-800 text-stone-400 text-xs font-bold px-3 py-2 rounded-xl hover:border-amber-500/40 transition"
          >
            🔄 Reset Defaults
          </button>
          <Link
            href="/admin?settings=open"
            className="rounded-xl border border-stone-800 bg-stone-900 hover:border-stone-700 px-4 py-2 text-xs font-bold text-stone-300 transition"
          >
            🌐Back to settings 
          </Link>
        </div>
      </div>

      {/* 📸 ADD PHOTO SECTION (FILE UPLOAD + URL LINK BOTH OPTIONS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* OPTION 1: Upload From Gallery / Phone */}
        <div className="bg-stone-900 border-2 border-dashed border-amber-500/40 p-5 rounded-2xl space-y-3 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span>📱</span> UPLOAD FROM PHONE / DEVICE GALLERY
            </h2>
            <p className="text-[11px] text-stone-400 mt-1">
              Select any wedding photo directly from your device file manager.
            </p>
          </div>

          <label className="bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black px-4 py-3 rounded-xl text-xs uppercase tracking-wider transition text-center cursor-pointer block active:scale-95 shadow-lg shadow-amber-500/20">
            📁 Select Photo From Gallery
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* OPTION 2: Add Via Web Link URL */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-3 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> OR ADD VIA DIRECT IMAGE URL LINK
            </h2>
            <p className="text-[11px] text-stone-400 mt-1">
              Paste direct image link from Unsplash or web storage.
            </p>
          </div>

          <form onSubmit={handleAddPhotoUrl} className="flex gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-xxx"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              className="flex-1 bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
            />
            <button
              type="submit"
              className="bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-100 font-bold px-4 py-2.5 rounded-xl text-xs whitespace-nowrap transition"
            >
              + Add URL
            </button>
          </form>
        </div>

      </div>

      {/* 🖼️ ACTIVE PHOTOS GRID */}
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-stone-800 pb-2">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            Active Stream Photos ({photos.length})
          </h3>
          <span className="text-[10px] text-stone-500 font-mono">Live on Homepage</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((url, idx) => (
            <div key={idx} className="relative group rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 aspect-square">
              <img src={url} alt="Gallery item" className="w-full h-full object-cover" />
              <button
                onClick={() => handleDeletePhoto(idx)}
                className="absolute top-2 right-2 bg-rose-600/90 hover:bg-rose-500 text-white font-bold p-2 rounded-xl text-xs shadow-lg active:scale-95 transition"
                title="Delete Photo"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}