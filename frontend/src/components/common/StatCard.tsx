'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendType = 'positive',
}: StatCardProps) {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && <div className="text-xl text-amber-500">{icon}</div>}
      </div>

      <div className="text-2xl font-black text-stone-100 font-mono">
        {value}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center gap-2 text-[11px] pt-1 border-t border-stone-800/60">
          {trend && (
            <span
              className={`font-bold font-mono ${
                trendType === 'positive'
                  ? 'text-emerald-400'
                  : trendType === 'negative'
                  ? 'text-red-400'
                  : 'text-stone-400'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-stone-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

export default StatCard;