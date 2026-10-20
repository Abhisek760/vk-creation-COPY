'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QuotationData } from '@/types/quote';

export default function SavedQuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<QuotationData[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vk_quotes');
    if (saved) {
      try {
        setQuotes(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const openPreview = (quote: QuotationData) => {
    localStorage.setItem('vk_current_preview_quote', JSON.stringify(quote));
    router.push('/builder/preview');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6 md:p-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-100">Saved Quotations Repository</h1>
          <p className="text-sm text-stone-400 mt-1">
            Browse draft proposals, view client previews, and share direct quote links.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/builder"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition"
          >
            + New Quotation
          </Link>
          <Link
            href="/admin?settings=open"
            className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-200 hover:bg-stone-800"
          >
           🌐Back to settings 
          </Link>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-900/60 p-4">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-800 text-xs uppercase text-stone-400">
            <tr>
              <th className="py-3 px-4">Quote Ref</th>
              <th className="py-3 px-4">Client Name</th>
              <th className="py-3 px-4">Event City</th>
              <th className="py-3 px-4">Grand Total</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {quotes.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-stone-500">
                  No saved quotations found. Create one from the Quotation Builder.
                </td>
              </tr>
            ) : (
              quotes.map((q) => (
                <tr key={q.id} className="hover:bg-stone-800/40">
                  <td className="py-3 px-4 font-mono font-semibold text-amber-500">{q.quoteNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-stone-200">{q.customerName}</div>
                    <div className="text-xs text-stone-500">{q.customerPhone}</div>
                  </td>
                  <td className="py-3 px-4 text-stone-300">{q.city}</td>
                  <td className="py-3 px-4 font-bold text-amber-400">
                    Rs. {q.grandTotal.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-xs text-stone-400">{q.createdAt.split('T')[0]}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => openPreview(q)}
                      className="rounded bg-stone-800 px-3 py-1 text-xs font-medium text-stone-300 hover:bg-stone-700 transition"
                    >
                      View Preview →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}