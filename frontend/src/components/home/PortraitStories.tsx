'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PortraitStories() {
  const [cinematicItems, setCinematicItems] = useState<any[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const loadCinematicStream = () => {
    try {
      // 🔑 STRICTLY FETCH DATA FOR "Cinematic Stream 2.0"
      const rawCinematic = localStorage.getItem('vk_cinematic_stream') || localStorage.getItem('vk_cloud_stream');
      
      let list: any[] = [];
      if (rawCinematic) {
        const parsed = JSON.parse(rawCinematic);
        list = Array.isArray(parsed) ? parsed : [];
      }

      // Filter out memory stream items if any category tag exists
      const cinematicOnly = list.filter((item: any) => {
        if (item.category) return item.category === 'cinematic';
        return true;
      });

      setCinematicItems(cinematicOnly);
    } catch (e) {
      console.error('Failed to load Cinematic Stream 2.0 items:', e);
    }
  };

  useEffect(() => {
    loadCinematicStream();

    const handleStorage = () => loadCinematicStream();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('vk_stream_updated', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('vk_stream_updated', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (cinematicItems.length <= 1) return;
    const interval = setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % cinematicItems.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [cinematicItems]);

  const handleNextCard = () => {
    if (cinematicItems.length === 0) return;
    setActiveCardIndex((prev) => (prev + 1) % cinematicItems.length);
  };

  const handlePrevCard = () => {
    if (cinematicItems.length === 0) return;
    setActiveCardIndex((prev) => (prev - 1 + cinematicItems.length) % cinematicItems.length);
  };

  return (
    <section className="py-12 bg-stone-950 border-b border-stone-800/80 overflow-hidden relative font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 space-y-6 relative z-10 text-center">
        
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full inline-block">
            ✨ CINEMATIC STREAM 2.0 SHOWCASE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-100 tracking-tight">
            Cinematic Reels & Highlight Stories
          </h2>
          <p className="text-xs text-stone-400">
            High-Definition Wedding Films & Motion Teasers
          </p>
        </div>

        {cinematicItems.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-stone-800 max-w-xl mx-auto rounded-3xl bg-stone-900/40 space-y-3">
            <span className="text-3xl block">🎬</span>
            <p className="text-xs text-stone-400 font-mono">
              ✨ Cinematic Teasers & Teaser Reels Coming Soon
            </p>
          </div>
        ) : (
          <>
            {/* 🃏 3D STACK DECK CONTAINER */}
            <div className="relative w-full max-w-sm sm:max-w-md h-96 sm:h-105 mx-auto flex items-center justify-center select-none">
              {cinematicItems.map((item, idx) => {
                const total = cinematicItems.length;
                const offset = (idx - activeCardIndex + total) % total;

                let transformClass = 'scale-90 opacity-0 pointer-events-none translate-x-20';
                let zIndex = 0;

                if (offset === 0) {
                  transformClass = 'scale-100 opacity-100 translate-x-0 rotate-0 shadow-2xl shadow-amber-500/20 z-30 cursor-pointer';
                  zIndex = 30;
                } else if (offset === 1) {
                  transformClass = 'scale-95 opacity-80 translate-x-6 sm:translate-x-10 rotate-3 z-20 cursor-pointer hover:rotate-6';
                  zIndex = 20;
                } else if (offset === 2) {
                  transformClass = 'scale-90 opacity-50 -translate-x-6 sm:-translate-x-10 -rotate-3 z-10 cursor-pointer';
                  zIndex = 10;
                }

                const isVideo = item.type === 'video' || (item.url && item.url.endsWith('.mp4'));

                return (
                  <div
                    key={item.id || idx}
                    onClick={handleNextCard}
                    className={`absolute inset-0 rounded-3xl overflow-hidden border-2 border-amber-500/40 bg-stone-900 transition-all duration-700 ease-out transform-gpu ${transformClass}`}
                    style={{ zIndex }}
                  >
                    <div className="w-full h-full relative group">
                      {isVideo ? (
                        <video
                          src={item.url || item.image}
                          controls={offset === 0}
                          autoPlay={offset === 0}
                          muted
                          loop
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.url || item.image}
                          alt={item.title || 'Cinematic Media'}
                          className="w-full h-full object-cover"
                        />
                      )}

                      <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-stone-950 via-stone-950/70 to-transparent p-5 text-left flex justify-between items-end">
                        <div>
                          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block">
                            {isVideo ? '🎥 Cinematic Reel' : '📸 Cinematic Stream 2.0'}
                          </span>
                          <h3 className="text-sm font-black text-stone-100 font-mono mt-0.5">
                            {item.title || item.name || 'Studio Capture'}
                          </h3>
                        </div>

                        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2.5 py-1 rounded-lg border border-amber-500/30 font-bold">
                          {idx + 1} / {total}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={handlePrevCard}
                className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 text-amber-400 font-black hover:border-amber-500 transition active:scale-90 flex items-center justify-center cursor-pointer"
              >
                ←
              </button>

              <div className="flex items-center gap-1.5">
                {cinematicItems.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setActiveCardIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === activeCardIndex ? 'w-6 bg-amber-400' : 'w-2 bg-stone-800'
                    }`}
                  ></span>
                ))}
              </div>

              <button
                onClick={handleNextCard}
                className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 text-amber-400 font-black hover:border-amber-500 transition active:scale-90 flex items-center justify-center cursor-pointer"
              >
                →
              </button>
            </div>
          </>
        )}

        {/* Bottom Action CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/builder"
            className="w-full sm:w-auto bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-stone-950 font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-wider transition shadow-xl shadow-amber-500/20 active:scale-95 touch-manipulation text-center"
          >
            📅 Book Your Wedding Date Now →
          </Link>
        </div>

      </div>
    </section>
  );
}