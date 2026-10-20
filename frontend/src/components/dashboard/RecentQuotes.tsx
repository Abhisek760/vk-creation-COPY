'use client';

import React from "react";

interface QuoteItem {
  id: string;
  quoteNumber?: string;
  customerName?: string;
  totalAmount?: number;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

interface RecentQuotesProps {
  quotes?: QuoteItem[];
}

export const RecentQuotes: React.FC<RecentQuotesProps> = ({ quotes = [] }) => {
  const sortedQuotes = [...quotes]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  if (sortedQuotes.length === 0) {
    return (
      <div className="p-6 bg-stone-900/40 rounded-2xl border border-stone-800 text-center text-stone-400 text-sm">
        No recent quotes found.
      </div>
    );
  }

  return (
    <div className="bg-stone-900/60 rounded-2xl border border-stone-800 p-6 space-y-4">
      <h3 className="text-sm font-semibold text-stone-300 uppercase tracking-wider">
        Recent Quotes
      </h3>
      <div className="space-y-3">
        {sortedQuotes.map((q) => (
          <div
            key={q.id || q.quoteNumber}
            className="flex items-center justify-between p-3 rounded-xl bg-stone-800/40 border border-stone-700/50"
          >
            <div>
              <p className="text-sm font-medium text-stone-200">
                {q.customerName || "Guest"}
              </p>
              <p className="text-xs text-stone-400">
                {q.quoteNumber || q.id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-amber-400">
                ?{q.totalAmount?.toLocaleString("en-IN") || 0}
              </p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-700 text-stone-300 capitalize">
                {q.status || "Draft"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentQuotes;
