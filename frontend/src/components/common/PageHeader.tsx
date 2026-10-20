'use client';

import React from 'react';

interface PageHeaderProps {
  category?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  category = 'VK Creation Platform',
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-800 pb-6 gap-4 print:hidden">
      <div>
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          {category}
        </span>
        <h1 className="text-3xl font-extrabold text-stone-100 mt-1">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-stone-400 mt-0.5 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export default PageHeader;