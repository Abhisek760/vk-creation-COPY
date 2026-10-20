'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Invoice {
  id: string;
  bookingRef: string;
  clientName: string;
  clientPhone: string;
  eventDate: string;
  venue: string;
  services: string[];
  grandTotal: number;
  advancePaid: number;
  remainingBalance: number;
  status: string;
  date: string;
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadInvoices = () => {
    try {
      const storedBookings = JSON.parse(localStorage.getItem('vk_creation_bookings') || '[]');

      // Sync Invoices without extra GST (Flat Net Price)
      const syncedInvoices: Invoice[] = storedBookings.map((b: any, index: number) => {
        const total = b.totalAmount || 0;
        const advance = b.advancePaid || 0;
        return {
          id: `INV-2026-${1001 + index}`,
          bookingRef: b.bookingNumber || `VKCREATION-${100 + index}`,
          clientName: b.clientName || 'Client',
          clientPhone: b.clientPhone || 'N/A',
          eventDate: b.eventDate || 'TBD',
          venue: b.venue || 'Indore',
          services: Array.isArray(b.services) ? b.services : ['Studio Photography Coverage'],
          grandTotal: total,
          advancePaid: advance,
          remainingBalance: Math.max(0, total - advance),
          status: advance > 0 ? 'Advance Paid' : 'Pending Payment',
          date: b.createdAt ? b.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        };
      });

      setInvoices(syncedInvoices);
    } catch (e) {
      console.error('Error loading invoices:', e);
      setInvoices([]);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleOpenInvoiceModal = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-4 gap-4">
        <div>
          <span className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase tracking-widest">
            Studio Billing Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 mt-1">
            Client Invoices & Bills
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Flat-rate fixed package bills, additional services breakdown, and balance statements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin?settings=open"
            className="rounded-xl border border-stone-800 bg-stone-900 hover:border-stone-700 px-4 py-2 text-xs font-bold text-stone-300 transition"
          >
           🌐Back to settings 
          </Link>
          <button
            onClick={loadInvoices}
            className="rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-stone-950 transition"
          >
            🔄 Sync Data
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 sm:p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-stone-800 pb-3">
          <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider">
            📄 Studio Bills ({invoices.length})
          </h2>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <span className="text-4xl block">🧾</span>
            <p className="text-xs text-stone-400">No client bills found.</p>
            <p className="text-[11px] text-stone-600">
              Proposal Builder se client request aane par unka bill automatic tayar ho jayega.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-150">
              <thead className="bg-stone-950 text-stone-400 font-semibold border-b border-stone-800">
                <tr>
                  <th className="p-3">Bill No</th>
                  <th className="p-3">Booking Ref</th>
                  <th className="p-3">Client Details</th>
                  <th className="p-3">Selected Services</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Remaining</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-stone-900/40 transition">
                    <td className="p-3 font-mono font-bold text-amber-400">{inv.id}</td>
                    <td className="p-3 font-mono text-stone-300">{inv.bookingRef}</td>
                    <td className="p-3">
                      <strong className="text-stone-200 block">{inv.clientName}</strong>
                      <span className="text-stone-500 text-[10px]">{inv.clientPhone}</span>
                    </td>
                    <td className="p-3 max-w-xs truncate text-stone-400 text-[11px]">
                      {inv.services.join(', ')}
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      ₹{inv.grandTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-mono text-amber-400 font-bold">
                      ₹{inv.remainingBalance.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleOpenInvoiceModal(inv)}
                        className="bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        👁️ View Bill
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 📄 CLEAN BILLING & RECEIPT MODAL */}
      {showModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 w-full max-w-xl rounded-2xl p-6 space-y-6 shadow-2xl relative text-stone-100">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-stone-800 pb-4">
              <div>
                <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest block">
                  Studio Invoice / Bill Statement
                </span>
                <h3 className="text-xl font-black text-stone-100">VK Creation Studio</h3>
                <p className="text-[10px] text-stone-400">Indore, Madhya Pradesh | Phone: +91 9876543210</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-100 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Bill Content */}
            <div className="space-y-4 text-xs font-mono bg-stone-950 p-4 rounded-xl border border-stone-800">
              <div className="flex justify-between border-b border-stone-800/80 pb-2">
                <span className="text-stone-500">Bill No:</span>
                <span className="text-amber-400 font-bold">{selectedInvoice.id}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800/80 pb-2">
                <span className="text-stone-500">Client Name:</span>
                <span className="text-stone-200">{selectedInvoice.clientName} ({selectedInvoice.clientPhone})</span>
              </div>
              <div className="flex justify-between border-b border-stone-800/80 pb-2">
                <span className="text-stone-500">Event Date & Venue:</span>
                <span className="text-stone-200">{selectedInvoice.eventDate} | {selectedInvoice.venue}</span>
              </div>

              {/* Package + Additional Custom Services Itemization */}
              <div className="pt-2 space-y-2">
                <span className="text-amber-400 font-bold block border-b border-stone-800 pb-1">
                  📦 Selected Services & Add-ons Breakdown:
                </span>
                {selectedInvoice.services.map((serviceName, idx) => (
                  <div key={idx} className="flex justify-between text-stone-300 pl-2">
                    <span>• {serviceName}</span>
                    <span className="text-stone-500">Included</span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="border-t border-stone-800 pt-3 space-y-1 text-right">
                <div className="flex justify-between text-sm font-bold text-stone-200 pt-1">
                  <span>Net Fixed Total:</span>
                  <span className="text-emerald-400">₹{selectedInvoice.grandTotal.toLocaleString('en-IN')}</span>
                </div>
                {selectedInvoice.advancePaid > 0 && (
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Advance Received:</span>
                    <span className="text-emerald-400">- ₹{selectedInvoice.advancePaid.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-bold text-amber-400 border-t border-stone-800/60 pt-2">
                  <span>Balance Due:</span>
                  <span>₹{selectedInvoice.remainingBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="text-[10px] text-stone-500 text-center italic pt-2 border-t border-stone-800/40">
                * Flat Net Studio Pricing (No extra GST added). All services delivered as per booking contract.
              </p>
            </div>

            {/* Print Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition"
              >
                🖨️ Print Studio Bill
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold py-2.5 rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}