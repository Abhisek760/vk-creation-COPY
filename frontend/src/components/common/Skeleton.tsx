'use client';

import React from 'react';

export function SkeletonCard() {
  return (
    <div className="animate-pulse bg-stone-900 border border-stone-800/80 rounded-2xl p-6 space-y-4">
      <div className="h-4 bg-stone-800 rounded w-1/3"></div>
      <div className="h-8 bg-stone-800 rounded w-1/2"></div>
      <div className="space-y-2">
        <div className="h-3 bg-stone-800/60 rounded w-full"></div>
        <div className="h-3 bg-stone-800/60 rounded w-4/5"></div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-10 bg-stone-900 border border-stone-800 rounded-xl w-full"></div>
      <div className="h-12 bg-stone-900/50 border border-stone-800/60 rounded-xl w-full"></div>
      <div className="h-12 bg-stone-900/50 border border-stone-800/60 rounded-xl w-full"></div>
      <div className="h-12 bg-stone-900/50 border border-stone-800/60 rounded-xl w-full"></div>
    </div>
  );
}