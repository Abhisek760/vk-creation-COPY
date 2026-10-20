'use client';

import React, { useState, useEffect } from 'react';

export default function StudioSeal({ className = "w-16 h-16" }: { className?: string }) {
  const [sealUrl, setSealUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadSeal = () => {
      try {
        const savedSeal = localStorage.getItem('vk_studio_seal_url');
        if (savedSeal) {
          setSealUrl(savedSeal);
        }
      } catch (e) {
        console.error('Failed to load studio seal:', e);
      }
    };

    loadSeal();
    window.addEventListener('storage', loadSeal);
    return () => window.removeEventListener('storage', loadSeal);
  }, []);

  if (sealUrl) {
    return (
      <img
        src={sealUrl}
        alt="VK Creation Official Seal"
        className={`${className} object-contain mx-auto mb-1 opacity-95`}
      />
    );
  }

  // Default Digital Stamp Fallback
  return (
    <div className={`${className} rounded-full border-2 border-dashed border-amber-600/70 flex flex-col items-center justify-center text-[7px] font-mono text-amber-700 font-black leading-tight p-1 bg-amber-500/5 mx-auto mb-1 -rotate-6`}>
      <span>VK_CREATION</span>
      <span className="text-[6px] text-stone-800">OFFICIAL</span>
      <span>SEAL STAMP</span>
    </div>
  );
}