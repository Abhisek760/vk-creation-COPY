'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PhotoGalleryPage({ params }: { params: Promise<{ galleryId: string }> }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [galleryId, setGalleryId] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const isClientMode = searchParams.get('mode') === 'client';

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setGalleryId(resolved.galleryId);
    }
    resolveParams();
  }, [params]);

  const photos = [
    { id: 'p1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', title: 'Couple Entry' },
    { id: 'p2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', title: 'Rituals' },
    { id: 'p3', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', title: 'Wedding Stage' },
    { id: 'p4', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80', title: 'Ring Ceremony' },
  ];

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((item) => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 md:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
            VK Creation Studio — Live Photo Gallery
          </span>
          <h1 className="text-3xl font-extrabold text-stone-100 mt-1">
            Event Photo Selection & Gallery
          </h1>
          <p className="text-xs text-stone-400 mt-0.5 font-mono">
            Booking Ref: {galleryId}
          </p>
        </div>

        <button
          onClick={() => {
            if (isClientMode && galleryId) {
              router.push(`/portal/${galleryId}`);
            } else {
              router.push('/portal');
            }
          }}
          className="rounded-xl border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-800 self-start sm:self-auto transition"
        >
          ← Back to Client Portal
        </button>
      </div>

      {/* Album Selection Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-wrap justify-between items-center text-xs gap-4">
        <div>
          <span className="text-stone-400">Selection Counter: </span>
          <strong className="text-amber-400 font-mono text-sm">{favorites.length} Photos Selected</strong>
        </div>

        <button
          onClick={() => {
            if (favorites.length === 0) {
              alert('Kripya pehle photobook ke liye photos select (heart click) karein.');
            } else {
              alert(`${favorites.length} photos album print list me save ho gaye hain!`);
            }
          }}
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition"
        >
          Submit Selection for Album Print →
        </button>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {photos.map((photo) => {
          const isSelected = favorites.includes(photo.id);
          return (
            <div
              key={photo.id}
              className="group relative bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg transition hover:border-amber-500/50"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-52 object-cover transition group-hover:scale-105 duration-300"
              />
              <div className="p-3 flex justify-between items-center text-xs">
                <span className="text-stone-300 font-medium">{photo.title}</span>
                <button
                  type="button"
                  onClick={() => toggleFavorite(photo.id)}
                  className={`p-1.5 rounded-lg border text-sm transition ${
                    isSelected
                      ? 'bg-amber-500 border-amber-400 text-stone-950'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-100'
                  }`}
                >
                  {isSelected ? '❤️ Selected' : '🤍 Select'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}