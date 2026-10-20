'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GSTInvoice } from '@/types/invoice';

export default function PrintableInvoicePage() {
  const [invoice, setInvoice] = useState<GSTInvoice | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vk_current_invoice');
    if (saved) {
      try {
        setInvoice(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default fallback mock for standalone navigation
      setInvoice({
        id: 'VK-INV-2026-001',
        invoiceNumber: 'VK-INV-2026-001',
        bookingNumber: 'VKCREATION-2026-001',
        customerName: 'Rahul & Sneha Sharma',
        customerPhone: '+91 9876543210',
        customerAddress: 'Vijay Nagar, Indore, MP',
        invoiceDate: '2026-07-01',
        dueDate: '2026-07-15',
        placeOfSupply: 'Madhya Pradesh (23)',
        taxType: 'INTRA_STATE',
        items: [{ id: 'itm-1', description: 'Grand Wedding Coverage (2 Days)', hsnSacCode: '998381', quantity: 1, rate: 152542, amount: 152542 }],
        subtotal: 152542,
        discountAmount: 0,
        taxableAmount: 152542,
        cgstRate: 9,
        cgstAmount: 13729,
        sgstRate: 9,
        sgstAmount: 13729,
        igstRate: 0,
        igstAmount: 0,
        totalAmount: 180000,
        paidAmount: 75000,
        remainingAmount: 105000,
        status: 'Partial',
        paymentHistory: [
          {
            id: 'rec-1',
            receiptNumber: 'REC-2026-001',
            amount: 75000,
            paymentDate: '2026-07-02',
            paymentMethod: 'UPI',
            transactionRef: 'UPI/612398129381',
            notes: '30% Booking Advance',
          },
        ],
        createdAt: new Date().toISOString(),
      });
    }
  }, []);

  if (!invoice) {
    return <div className="min-h-screen bg-stone-950 p-10 text-stone-100">Loading tax invoice...</div>;
  }

  const dueAmount = invoice.totalAmount - invoice.paidAmount;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6 md:p-10 space-y-8 flex flex-col items-center">
      {/* Printable Actions Header */}
      <div className="w-full max-w-4xl flex justify-between items-center border-b border-stone-800 pb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-amber-500">Tax Invoice Document</h1>
          <p className="text-xs text-stone-400">Reference: {invoice.invoiceNumber}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400"
          >
            🖨 Print / Download PDF
          </button>
          <Link
            href="/admin/invoices"
            className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-medium text-stone-200 hover:bg-stone-800"
          >
            ← Back to Invoices
          </Link>
        </div>
      </div>

      {/* Official GST Document Frame */}
      <div className="w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl p-8 md:p-12 space-y-8 shadow-2xl">
        {/* Company Header */}
        <div className="flex justify-between items-start border-b border-stone-800 pb-6">
          <div>
            <h2 className="text-3xl font-black text-stone-100">VK CREATION</h2>
            <p className="text-xs text-amber-500 font-semibold">Wedding Media & Cinematography Studio</p>
            <p className="text-xs text-stone-400 mt-1">
              GSTIN: <span className="font-mono text-stone-200">23AAAAA0000A1Z5</span> • MP, India
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-amber-500 font-mono block">{invoice.invoiceNumber}</span>
            <span className="text-xs text-stone-400 block">Date: {invoice.invoiceDate}</span>
            <span className="text-xs text-rose-400 font-semibold">Due: {invoice.dueDate}</span>
          </div>
        </div>

        {/* Client Address */}
        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-stone-500 uppercase text-[10px] block font-bold">Billed To:</span>
            <strong className="text-stone-200 text-sm block mt-0.5">{invoice.customerName}</strong>
            <span className="text-stone-400">{invoice.customerPhone}</span>
            <p className="text-stone-400">{invoice.customerAddress}</p>
          </div>
          <div className="text-right">
            <span className="text-stone-500 uppercase text-[10px] block font-bold">Booking Reference:</span>
            <span className="text-amber-500 font-mono text-sm block mt-0.5">{invoice.bookingNumber}</span>
            <span
              className={`inline-block mt-2 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                invoice.status === 'Paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
              }`}
            >
              Status: {invoice.status}
            </span>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-2">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-800 uppercase text-stone-500">
              <tr>
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-medium text-stone-200">{item.description}</td>
                  <td className="py-3 text-right font-bold text-stone-200">
                    Rs. {item.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tax Ledger Calculations */}
        <div className="border-t border-stone-800 pt-4 flex justify-end">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-400">
              <span>Subtotal:</span>
              <span className="text-stone-200">Rs. {invoice.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>CGST ({invoice.cgstRate}%):</span>
              <span>Rs. {invoice.cgstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>SGST ({invoice.sgstRate}%):</span>
              <span>Rs. {invoice.sgstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-800 font-bold text-sm">
              <span className="text-stone-100">Total Incl. GST:</span>
              <span className="text-amber-400">Rs. {invoice.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-semibold pt-1">
              <span>Total Received:</span>
              <span>Rs. {invoice.paidAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-rose-400 font-bold pt-1 border-t border-stone-800">
              <span>Balance Due:</span>
              <span>Rs. {dueAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Payment History Receipts */}
        {invoice.paymentHistory.length > 0 && (
          <div className="border-t border-stone-800 pt-6 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase">Recorded Payment Receipts</h3>
            <div className="space-y-2">
              {invoice.paymentHistory.map((rec) => (
                <div key={rec.id} className="flex justify-between items-center bg-stone-950 p-2.5 rounded text-xs border border-stone-800">
                  <div>
                    <span className="font-mono text-amber-500 font-semibold">{rec.receiptNumber}</span>
                    <span className="text-stone-400 ml-2">({rec.paymentMethod})</span>
                    <span className="text-stone-500 block">{rec.notes}</span>
                  </div>
                  <div className="text-right">
                    <strong className="text-emerald-400 block">Rs. {rec.amount.toLocaleString('en-IN')}</strong>
                    <span className="text-stone-500 text-[10px]">{rec.paymentDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}