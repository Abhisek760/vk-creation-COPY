'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TermsRepository, DEFAULT_STUDIO_TERMS } from '@/lib/catalogRepository';

export default function AdminTermsEditorPage() {
  const [terms, setTerms] = useState<string[]>([]);
  const [newTerm, setNewTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const loadTermsData = async () => {
    const fetchedTerms = await TermsRepository.getTerms();
    setTerms(fetchedTerms);
  };

  useEffect(() => {
    loadTermsData();
  }, []);

  const handleAddTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm.trim()) return;

    const updated = [...terms, newTerm.trim()];
    setTerms(updated);
    await TermsRepository.saveTerms(updated);
    setNewTerm('');
    alert('✅ New Clause added & synced to Cloud!');
  };

  const handleDeleteTerm = async (index: number) => {
    if (!confirm('Are you sure you want to delete this clause?')) return;
    const updated = terms.filter((_, i) => i !== index);
    setTerms(updated);
    await TermsRepository.saveTerms(updated);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(terms[index]);
  };

  const handleSaveEdit = async (index: number) => {
    if (!editText.trim()) return;
    const updated = [...terms];
    updated[index] = editText.trim();
    setTerms(updated);
    await TermsRepository.saveTerms(updated);
    setEditingIndex(null);
    setEditText('');
    alert('✅ Clause updated & synced to Cloud!');
  };

  const handleReset = async () => {
    if (!confirm('Restore default legal terms & conditions clauses?')) return;
    await TermsRepository.resetTerms();
    setTerms(DEFAULT_STUDIO_TERMS);
    alert('🔄 Restored default legal terms!');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-800 pb-4 gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
            Legal & Contracts (Cloud Firestore Active)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 mt-1">
            Service Agreement Terms Manager
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Add, edit, or customize official legal clauses printed on client contracts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-stone-400 text-xs font-bold px-3 py-2 rounded-xl transition"
          >
            🔄 Reset Defaults
          </button>
          <Link
            href="/admin?settings=open"
            className="rounded-xl border border-stone-800 bg-stone-900 hover:border-stone-700 px-4 py-2 text-xs font-bold text-stone-300 transition"
          >
            🌐 Back to settings 
          </Link>
        </div>
      </div>

      <div className="bg-stone-900 border border-amber-500/30 p-5 rounded-2xl space-y-3 shadow-xl">
        <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          ➕ Add New Custom Legal Clause
        </h2>
        <form onSubmit={handleAddTerm} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="e.g. Raw photos backup will be kept for 45 days post event."
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            className="flex-1 bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition whitespace-nowrap shadow-lg shadow-amber-500/10"
          >
            + Add Clause
          </button>
        </form>
      </div>

      <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-4">
        <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider border-b border-stone-800 pb-2">
          Active Legal Clauses ({terms.length})
        </h3>

        <div className="space-y-3">
          {terms.map((term, index) => (
            <div
              key={index}
              className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 text-xs hover:border-stone-700 transition"
            >
              {editingIndex === index ? (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleSaveEdit(index)}
                      className="bg-emerald-500 text-stone-950 font-bold px-3 py-1 rounded-lg text-[10px]"
                    >
                      ✓ Save
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="bg-stone-800 text-stone-400 font-bold px-3 py-1 rounded-lg text-[10px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <p className="text-stone-300 leading-relaxed">{term}</p>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <button
                      onClick={() => handleStartEdit(index)}
                      className="text-stone-400 hover:text-amber-400 font-bold text-xs"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTerm(index)}
                      className="text-stone-600 hover:text-rose-400 font-bold text-xs"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}