'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WeddingAgreement, ContractClause } from '@/types/agreement';
import { AgreementRepository, DEFAULT_CONTRACT_CLAUSES } from '@/lib/agreementRepository';

export default function AdminAgreementPage() {
  const [agreements, setAgreements] = useState<WeddingAgreement[]>([]);
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  // Contract Builder Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [eventType, setEventType] = useState('Grand Wedding & Reception');
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [venue, setVenue] = useState('Sayaji Hotel, Indore');
  const [city, setCity] = useState('Indore');
  const [totalContractAmount, setTotalContractAmount] = useState<number>(180000);
  const [advancePaid, setAdvancePaid] = useState<number>(50000);
  const [bookingNumber, setBookingNumber] = useState(`VKCREATION-2026-${Math.floor(100 + Math.random() * 900)}`);
  
  const [clauses, setClauses] = useState<ContractClause[]>(DEFAULT_CONTRACT_CLAUSES);
  const [deliverablesText, setDeliverablesText] = useState(
    '1 Traditional Photographer + 1 Candid Photographer\n1 Cinematic 4K Videographer + Drone Coverage\nFull HD Teaser + Main Film\n2 Premium Photobooks (40 Pages)'
  );

  const refreshAgreements = () => {
    setAgreements(AgreementRepository.getAll());
  };

  useEffect(() => {
    refreshAgreements();
  }, []);

  const handleClauseChange = (id: string, field: 'title' | 'content', value: string) => {
    setClauses(clauses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleCreateAgreementSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const agrNum = `VK-AGR-2026-${Math.floor(100 + Math.random() * 900)}`;
    const deliverablesList = deliverablesText.split('\n').filter((d) => d.trim().length > 0);

    const newAgreement: WeddingAgreement = {
      id: agrNum,
      agreementNumber: agrNum,
      bookingNumber,
      clientName: clientName || 'Valued Client',
      clientPhone: clientPhone || '+91 9876543210',
      clientEmail,
      clientAddress,
      eventType,
      eventDate,
      venue,
      city,
      totalContractAmount,
      advancePaid,
      clauses,
      deliverables: deliverablesList,
      studioSignatory: 'Aman Sharma (Founder & Lead Director)',
      isSigned: false,
      status: 'Sent',
      createdAt: new Date().toISOString(),
    };

    AgreementRepository.save(newAgreement);
    setShowBuilderModal(false);
    refreshAgreements();
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6 md:p-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-100">Wedding Agreement & Contract Manager</h1>
          <p className="text-sm text-stone-400 mt-1">
            Generate legally structured coverage contracts, edit custom terms, track client digital signatures, and export PDFs.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBuilderModal(true)}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition"
          >
            + Create New Agreement
          </button>
          <Link
            href="/admin?settings=open"
            className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-200 hover:bg-stone-800"
          >
            🌐Back to settings 
          </Link>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-800 text-xs uppercase text-stone-400">
            <tr>
              <th className="py-3 px-4">Contract #</th>
              <th className="py-3 px-4">Booking Ref</th>
              <th className="py-3 px-4">Client Name</th>
              <th className="py-3 px-4">Event Date</th>
              <th className="py-3 px-4">Contract Value</th>
              <th className="py-3 px-4">Signature Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {agreements.map((agr) => (
              <tr key={agr.id} className="hover:bg-stone-800/40">
                <td className="py-3.5 px-4 font-mono font-bold text-amber-500">{agr.agreementNumber}</td>
                <td className="py-3.5 px-4 font-mono text-xs text-stone-400">{agr.bookingNumber}</td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-stone-200">{agr.clientName}</div>
                  <div className="text-xs text-stone-500">{agr.clientPhone}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-stone-300">{agr.eventDate}</td>
                <td className="py-3.5 px-4 font-bold text-stone-100">
                  ₹{agr.totalContractAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${
                      agr.isSigned
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}
                  >
                    {agr.isSigned ? 'Digitally Signed ✓' : 'Pending Signature'}
                  </span>
                </td>
                <td className="py-3.5 px-4 flex items-center gap-2">
                  <a
                    href={AgreementRepository.generateWhatsAppContractLink(agr)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 text-xs font-bold hover:bg-emerald-900/60"
                  >
                    💬 WhatsApp Link
                  </a>
                  <Link
                    href={`/booking/agreement/${agr.agreementNumber}`}
                    className="rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-semibold text-stone-300 hover:bg-stone-700 transition"
                  >
                    View Document →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contract Builder & Editable Clause Modal */}
      {showBuilderModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAgreementSubmit}
            className="w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold text-amber-500">Create Wedding Agreement Contract</h3>
              <button
                type="button"
                onClick={() => setShowBuilderModal(false)}
                className="text-stone-400 hover:text-stone-100"
              >
                ✕
              </button>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul & Sneha Sharma"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 9876543210"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Event Date</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Venue Location</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Total Contract Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={totalContractAmount}
                  onChange={(e) => setTotalContractAmount(Number(e.target.value))}
                  className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-xs text-amber-400 outline-none focus:border-amber-500 font-bold text-amber-400."
                />
              </div>
            </div>

            {/* Deliverables Input */}
            <div>
              <label className="block text-xs text-stone-400 mb-1">Agreed Deliverables (1 item per line)</label>
              <textarea
                rows={3}
                value={deliverablesText}
                onChange={(e) => setDeliverablesText(e.target.value)}
                className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2.5 text-xs text-stone-100 outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Editable Clauses Section */}
            <div className="space-y-3 pt-2 border-t border-stone-800">
              <h4 className="text-xs font-bold text-amber-400 uppercase">Editable Contract Clauses</h4>
              {clauses.map((clause) => (
                <div key={clause.id} className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-2">
                  <input
                    type="text"
                    value={clause.title}
                    onChange={(e) => handleClauseChange(clause.id, 'title', e.target.value)}
                    className="w-full bg-transparent font-bold text-xs text-stone-200 outline-none border-b border-stone-800 pb-1"
                  />
                  <textarea
                    rows={2}
                    value={clause.content}
                    onChange={(e) => handleClauseChange(clause.id, 'content', e.target.value)}
                    className="w-full bg-transparent text-xs text-stone-400 outline-none resize-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setShowBuilderModal(false)}
                className="rounded-lg border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400"
              >
                Save & Issue Agreement
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}