'use client';

import React, { useState, useEffect } from 'react';

export default function BehindTheLens() {
  const [btsItems, setBtsItems] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);

  const loadBtsData = () => {
    try {
      const saved =
        localStorage.getItem('vk_bts_stream') ||
        localStorage.getItem('vk_behind_the_lens');

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setBtsItems(parsed);
          return;
        }
      }
      setBtsItems([]);
    } catch (e) {
      setBtsItems([]);
    }
  };

  useEffect(() => {
    loadBtsData();

    window.addEventListener('storage', loadBtsData);
    window.addEventListener('vk_bts_updated', loadBtsData);

    return () => {
      window.removeEventListener('storage', loadBtsData);
      window.removeEventListener('vk_bts_updated', loadBtsData);
    };
  }, []);

  return (
    <section className="py-14 sm:py-20 bg-stone-950/90 border-y border-stone-800/80 relative overflow-hidden font-sans">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-62.5 bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 space-y-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 px-4 py-1.2 rounded-full inline-flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            🎥 CREATIVE IN MOTION
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-100 tracking-tight">
            Behind The Lens & Studio At Work
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
            A glimpse into our live directing, 4K cinema rigs, and on-set passion.
          </p>
        </div>

        {/* Empty State vs Video/Photo Deck */}
        {btsItems.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-12 px-6 border border-dashed border-stone-800/80 rounded-3xl bg-stone-900/30 backdrop-blur-sm space-y-2">
            <span className="text-3xl block">🎬</span>
            <p className="text-xs font-bold text-stone-300 font-mono">
              ✨ Exclusive Behind-The-Lens Moments Coming Soon
            </p>
            <p className="text-[10px] text-stone-500 font-mono">
              Capturing live studio setups, 4K camera gear, and directing moments!
            </p>
          </div>
        ) : (
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 px-2 scrollbar-none snap-x touch-pan-x">
            {btsItems.map((item, idx) => {
              const mediaUrl = typeof item === 'string' ? item : item.url;
              const title = typeof item === 'object' ? item.title : 'Live Studio BTS';
              const isVideo =
                mediaUrl?.startsWith('data:video') ||
                mediaUrl?.endsWith('.mp4') ||
                mediaUrl?.endsWith('.webm') ||
                mediaUrl?.includes('video');

              return (
                <div
                  key={item.id ? `${item.id}-${idx}` : idx}
                  className="shrink-0 w-64 sm:w-72 h-90 sm:h-105 rounded-3xl overflow-hidden border border-amber-500/20 hover:border-amber-400/60 bg-stone-900 relative shadow-2xl snap-center group transition-all duration-500 hover:-translate-y-1.5 cursor-pointer"
                  onClick={() => {
                    if (isVideo) {
                      setSelectedVideo({ url: mediaUrl, title });
                    }
                  }}
                >
                  {isVideo ? (
                    <>
                      <video
                        src={mediaUrl}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                        <div className="w-12 h-12 rounded-full bg-amber-500/90 text-stone-950 flex items-center justify-center text-xl font-bold shadow-lg shadow-amber-500/30 group-hover:scale-110 transition">
                          ▶
                        </div>
                      </div>
                    </>
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/20 to-transparent opacity-85 pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-800 text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1.5">
                    <span>{isVideo ? '🎥 TAP TO PLAY FULL VIDEO' : '📸 BTS PHOTO'}</span>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-4 left-4 right-4 space-y-1 pointer-events-none">
                    <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest block font-bold">
                      VK_CREATION ON SET
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-stone-100 truncate group-hover:text-amber-300 transition">
                      {title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 🎬 FULL SCREEN HD VIDEO PLAYER MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-stone-900 rounded-3xl border border-amber-500/40 overflow-hidden shadow-2xl space-y-3 p-4">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-2">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  🎥 HD STUDIO REEL
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {selectedVideo.title || 'Studio Behind The Lens'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-9 h-9 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center text-sm font-bold border border-stone-700 transition"
              >
                ✕
              </button>
            </div>

            {/* Video Player With Full Controls & Audio */}
            <div className="aspect-9/16 max-h-[70vh] mx-auto rounded-2xl overflow-hidden bg-black shadow-inner border border-stone-800">
              <video
                src={selectedVideo.url}
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            </div>

            <p className="text-center text-[11px] text-stone-400 font-mono">
              Use volume and full-screen controls on video player for best experience.
            </p>
          </div>
        </div>
      )}

    </section>
  );
}