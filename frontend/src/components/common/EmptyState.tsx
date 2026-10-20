'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = '📂',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="border border-dashed border-stone-800 rounded-2xl p-10 text-center bg-stone-950/40 space-y-3 flex flex-col items-center justify-center">
      {icon && (
        <div className="text-3xl text-stone-400 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-stone-200">{title}</h3>
      <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 inline-block px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/10"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;