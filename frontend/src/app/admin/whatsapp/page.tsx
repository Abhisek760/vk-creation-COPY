'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ClientExperienceRepository } from '@/lib/clientExperienceRepository';
import { WhatsAppTemplate, CommunicationTrigger } from '@/types/clientExperience';

export default function WhatsAppAutomationPage() {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(ClientExperienceRepository.defaultWhatsAppTemplates);
  const [selectedClientPhone, setSelectedClientPhone] = useState<string>('+91 98765 43210');
  const [selectedClientName, setSelectedClientName] = useState<string>('Ananya & Kabir');

  const handleSend = (tmpl: WhatsAppTemplate) => {
    let text = tmpl.templateText
      .replace('{name}', selectedClientName)
      .replace('{date}', '2026-11-20')
      .replace('{bookingRef}', 'VKCREATION-2026-001')
      .replace('{pin}', '4321')
      .replace('{venue}', 'Sayaji Hotel, Indore')
      .replace('{link}', 'https://vkcreation.com/portal/VKCREATION-2026-001');

    const waUrl = ClientExperienceRepository.buildWhatsAppLink(selectedClientPhone, text);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Client Experience Module</span>
          <h1 className="text-3xl font-extrabold text-stone-100 mt-1">WhatsApp & Email Automation Hub</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            One-click WhatsApp client communication and automated email logs for all 11 lifecycle triggers.
          </p>
        </div>

        <Link
          href="/admin?settings=open"
          className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-800"
        >
          🌐Back to settings 
        </Link>
      </div>

      {/* Target Client Input Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-stone-400 mb-1 font-bold">Target Client Name</label>
          <input
            type="text"
            value={selectedClientName}
            onChange={(e) => setSelectedClientName(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 p-3 rounded-xl text-stone-100 outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-stone-400 mb-1 font-bold">WhatsApp Phone Number</label>
          <input
            type="text"
            value={selectedClientPhone}
            onChange={(e) => setSelectedClientPhone(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 p-3 rounded-xl text-stone-100 outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* One-Click WhatsApp Actions Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-amber-500">1-Click WhatsApp Message Triggers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tmpl) => (
            <div key={tmpl.trigger} className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{tmpl.trigger}</span>
                <button
                  onClick={() => handleSend(tmpl)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1"
                >
                  💬 Send WhatsApp
                </button>
              </div>

              <textarea
                rows={3}
                value={tmpl.templateText}
                onChange={(e) => {
                  const updated = templates.map((t) => (t.trigger === tmpl.trigger ? { ...t, templateText: e.target.value } : t));
                  setTemplates(updated);
                }}
                className="w-full bg-stone-950 border border-stone-800 text-xs p-3 rounded-xl text-stone-300 outline-none focus:border-amber-500 font-sans"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}