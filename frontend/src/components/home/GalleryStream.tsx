'use client';

import React, { useState, useEffect } from 'react';

export default function GalleryStream() {
  const [memoryPhotos, setMemoryPhotos] = useState<any[]>([]);

  const loadMemoryPhotos = () => {
    try {
      // 🔑 STRICTLY READ ONLY UPPER MEMORY STREAM KEYS
      const memoryData = 
        localStorage.getItem('vk_stream_photos') || 
        localStorage.getItem('vk_memory_stream') ||
        localStorage.getItem('vk_gallery_photos');

      if (memoryData) {
        const parsed = JSON.parse(memoryData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMemoryPhotos(parsed);
          return;
        }
      }
      setMemoryPhotos([]);
    } catch (e) {
      console.error('Error loading memory stream photos:', e);
    }
  };

  useEffect(() => {
    loadMemoryPhotos();

    window.addEventListener('storage', loadMemoryPhotos);
    window.addEventListener('vk_stream_updated', loadMemoryPhotos);

    return () => {
      window.removeEventListener('storage', loadMemoryPhotos);
      window.removeEventListener('vk_stream_updated', loadMemoryPhotos);
    };
  }, []);

  // Duplicate items array for seamless infinite auto-scroll loop
  const displayList = 
    memoryPhotos.length > 0 
      ? [...memoryPhotos, ...memoryPhotos, ...memoryPhotos] 
      : [];

  return (
    <section className="py-12 sm:py-16 border-b border-stone-800/60 bg-stone-950 overflow-hidden relative">
      
      {/* 🚀 INFINITE AUTO-SCROLL MARQUEE KEYFRAMES */}
      <style jsx global>{`
        @keyframes memoryStreamMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-memory-stream {
          display: flex;
          width: max-content;
          animation: memoryStreamMarquee 26s linear infinite;
        }

        .animate-memory-stream:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Decorative Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 space-y-6 relative z-10">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full inline-block">
            📸 MOMENTS CAPTURED BY VK_CREATION
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-100">
            Timeless Wedding Gallery
          </h2>
          <p className="text-xs text-stone-400 font-mono">
            Handpicked Moments & Portrait Highlights Captured by VK_Creation
          </p>
        </div>

        {memoryPhotos.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-stone-800 rounded-3xl bg-stone-900/40">
            <p className="text-xs text-stone-500 italic font-mono">
              Handpicked Moments & Portrait Highlights Coming Soon!
            </p>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden py-2">
            
            {/* Left & Right Smooth linear Fades */}
            <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-28 bg-linear-to-r from-stone-950 via-stone-950/80 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-28 bg-linear-to-l from-stone-950 via-stone-950/80 to-transparent z-20 pointer-events-none"></div>

            {/* Auto Scrolling Marquee Track */}
            <div className="animate-memory-stream flex items-center gap-4 sm:gap-6">
              {displayList.map((item, idx) => {
                const srcUrl = typeof item === 'string' ? item : item.url;
                const itemTitle = typeof item === 'object' ? item.title : 'VK Creation';

                return (
                  <div
                    key={item.id ? `${item.id}-${idx}` : idx}
                    className="shrink-0 w-60 sm:w-72 h-80 sm:h-96 rounded-3xl overflow-hidden border-2 border-amber-500/40 hover:border-amber-400 transition-all duration-500 relative group shadow-2xl bg-stone-900 cursor-pointer hover:scale-105"
                  >
                    <img
                      src={srcUrl}
                      alt={itemTitle || 'Memory Stream Photo'}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />

                    {/* Royal linear Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-stone-950/90 via-stone-950/20 to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-300" />

                    {/* Photo Title Overlay Badge */}
                    <div className="absolute bottom-3 left-3 right-3 font-mono text-[10px] sm:text-[11px] text-amber-300 font-bold z-10 flex items-center justify-between">
                      <span className="bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-amber-500/30 truncate max-w-42.5">
                        ✨ {itemTitle || 'Royal Moments'}
                      </span>
                      <span className="text-[9px] text-stone-300 bg-stone-950/60 px-2 py-0.5 rounded-lg border border-stone-800 shrink-0">
                        4K
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </section>
  );
}