'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PaymentLedger, PaymentSummaryKPIs, StudioBankDetails, TrancheType, PaymentMethod } from '@/types/payment';
import { PaymentRepository } from '@/lib/paymentRepository';

export default function PaymentManagementPage() {
  const [ledgers, setLedgers] = useState<PaymentLedger[]>([]);
  const [kpis, setKPIs] = useState<PaymentSummaryKPIs>({
    totalCollected: 0,
    totalOutstanding: 0,
    totalOverdue: 0,
    activeBookingsCount: 0,
  });
  const [bankDetails, setBankDetails] = useState<StudioBankDetails>(PaymentRepository.getBankDetails());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal State for Recording Payment
  const [selectedLedger, setSelectedLedger] = useState<PaymentLedger | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [tranche, setTranche] = useState<TrancheType>('Event Day Payment');
  const [txRef, setTxRef] = useState('');
  const [notes, setNotes] = useState('');

  // Settings Slideover
  const [showBankModal, setShowBankModal] = useState(false);

  const refreshData = () => {
    const data = PaymentRepository.getAllLedgers();
    setLedgers(data);
    setKPIs(PaymentRepository.getKPIs());
    setBankDetails(PaymentRepository.getBankDetails());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLedger || amount <= 0) return;

    PaymentRepository.recordPaymentTransaction(selectedLedger.bookingNumber, {
      bookingNumber: selectedLedger.bookingNumber,
      customerName: selectedLedger.customerName,
      amount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: method,
      trancheType: tranche,
      transactionRef: txRef,
      notes,
    });

    setSelectedLedger(null);
    setAmount(0);
    setTxRef('');
    setNotes('');
    refreshData();
  };

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    PaymentRepository.saveBankDetails(bankDetails);
    setShowBankModal(false);
    alert('Banking & UPI configuration saved successfully!');
  };

  const filteredLedgers = ledgers.filter((l) => {
    const matchesSearch =
      l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.customerPhone.includes(searchQuery);

    const matchesStatus = filterStatus === 'ALL' || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6 md:p-10 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-100">Payment & Financial Ledger Management</h1>
          <p className="text-sm text-stone-400 mt-1">
            Track multi-tranche booking advances, remaining client balances, due dates, and automated payment reminders.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBankModal(true)}
            className="rounded-lg border border-amber-500/40 bg-amber-950/20 px-4 py-2 text-sm font-semibold text-amber-400 hover:bg-amber-900/40 transition"
          >
            ⚙️ UPI & Bank Config
          </button>
          <Link
            href="/admin?settings=open"
            className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-200 hover:bg-stone-800"
          >
            🌐Back to settings 
          </Link>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-1">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Total Revenue Collected</span>
          <p className="text-2xl font-black text-emerald-400">₹{kpis.totalCollected.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-stone-500">Realized Cash & UPI Receipts</span>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-1">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Pending Balance Due</span>
          <p className="text-2xl font-black text-amber-400">₹{kpis.totalOutstanding.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-stone-500">Across Active Wedding Shoots</span>
        </div>

        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 space-y-1">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Overdue Receivables</span>
          <p className="text-2xl font-black text-rose-400">₹{kpis.totalOverdue.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-rose-300/60">Past Payment Due Date</span>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-1">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Active Contracts</span>
          <p className="text-2xl font-black text-stone-100">{kpis.activeBookingsCount}</p>
          <span className="text-[11px] text-stone-500">Tracked Studio Clients</span>
        </div>
      </div>

      {/* Controls & Search Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search client name, booking ref, or phone number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80 rounded-xl border border-stone-800 bg-stone-900 px-4 py-2.5 text-sm text-stone-100 outline-none focus:border-amber-500"
        />

        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-stone-500 font-medium">Status Filter:</span>
          {['ALL', 'Paid', 'Partially Paid', 'Overdue', 'Unpaid'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterStatus === st
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Ledgers Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-800 text-xs uppercase text-stone-400">
            <tr>
              <th className="py-3 px-4">Booking Ref</th>
              <th className="py-3 px-4">Client Details</th>
              <th className="py-3 px-4">Event Date</th>
              <th className="py-3 px-4">Total Contract</th>
              <th className="py-3 px-4">Paid Amount</th>
              <th className="py-3 px-4">Remaining Balance</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {filteredLedgers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-stone-500 text-sm">
                  No payment ledgers found matching your search parameters.
                </td>
              </tr>
            ) : (
              filteredLedgers.map((ledger) => (
                <tr key={ledger.bookingNumber} className="hover:bg-stone-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-500">{ledger.bookingNumber}</td>
                  <td className="py-3.5 px-4">
                    <strong className="text-stone-100 block text-sm">{ledger.customerName}</strong>
                    <span className="text-stone-400 text-xs">{ledger.customerPhone}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-300 text-xs">{ledger.eventDate}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-200">
                    ₹{ledger.totalContractAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">
                    ₹{ledger.paidAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-rose-400">
                    ₹{ledger.remainingBalance.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase border ${
                        ledger.status === 'Paid'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                          : ledger.status === 'Partially Paid'
                          ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                          : 'bg-rose-950/80 text-rose-400 border-rose-800'
                      }`}
                    >
                      {ledger.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {ledger.remainingBalance > 0 && (
                        <button
                          onClick={() => {
                            setSelectedLedger(ledger);
                            setAmount(ledger.remainingBalance);
                          }}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
                        >
                          + Record Payment
                        </button>
                      )}

                      {ledger.remainingBalance > 0 && (
                        <a
                          href={PaymentRepository.generateWhatsAppReminderLink(ledger)}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-3 py-1.5 text-xs font-bold hover:bg-emerald-900/60"
                        >
                          💬 Send Reminder
                        </a>
                      )}

                      <Link
                        href={`/admin/payments/${ledger.bookingNumber}`}
                        className="rounded-lg bg-stone-800 px-3 py-1.5 text-xs font-medium text-stone-300 hover:bg-stone-700"
                      >
                        History →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal 1: Record Tranche Payment */}
      {selectedLedger && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleRecordPaymentSubmit}
            className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold text-amber-500">Record Payment Tranche</h3>
              <button
                type="button"
                onClick={() => setSelectedLedger(null)}
                className="text-stone-400 hover:text-stone-100"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-stone-300 space-y-1 bg-stone-950 p-3 rounded-xl border border-stone-800">
              <p><strong>Client:</strong> {selectedLedger.customerName}</p>
              <p><strong>Booking Ref:</strong> {selectedLedger.bookingNumber}</p>
              <p>
                <strong>Outstanding Due:</strong>{' '}
                <span className="text-rose-400 font-bold">₹{selectedLedger.remainingBalance.toLocaleString('en-IN')}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Tranche Category</label>
              <select
                value={tranche}
                onChange={(e) => setTranche(e.target.value as TrancheType)}
                className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
              >
                <option value="Booking Advance">Booking Advance</option>
                <option value="Pre-Shoot Tranche">Pre-Shoot Tranche</option>
                <option value="Event Day Payment">Event Day Payment</option>
                <option value="Delivery Settlement">Delivery Settlement</option>
                <option value="Custom Add-on">Custom Add-on</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Amount Received (₹) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={selectedLedger.remainingBalance}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-sm text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Payment Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                  className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
                >
                  <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Card">Credit / Debit Card</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Transaction Ref / Reference No.</label>
              <input
                type="text"
                placeholder="e.g. UPI/31920391203"
                value={txRef}
                onChange={(e) => setTxRef(e.target.value)}
                className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Internal Notes</label>
              <input
                type="text"
                placeholder="Optional notes or cash receiver name"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setSelectedLedger(null)}
                className="rounded-lg border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Save Payment Receipt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Studio Bank Details Configuration */}
      {showBankModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveBankDetails}
            className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold text-amber-500">Configure Studio UPI & Bank Account</h3>
              <button
                type="button"
                onClick={() => setShowBankModal(false)}
                className="text-stone-400 hover:text-stone-100"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Primary UPI ID (GPay / PhonePe / Paytm)</label>
              <input
                type="text"
                required
                value={bankDetails.upiId}
                onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
                className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-sm text-stone-100 outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={bankDetails.accountName}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                  className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Account Number</label>
                <input
                  type="text"
                  required
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                  className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">IFSC Code</label>
                <input
                  type="text"
                  required
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                  className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Branch Location</label>
              <input
                type="text"
                value={bankDetails.branch}
                onChange={(e) => setBankDetails({ ...bankDetails, branch: e.target.value })}
                className="w-full rounded-lg bg-stone-950 border border-stone-800 p-2 text-xs text-stone-100 outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setShowBankModal(false)}
                className="rounded-lg border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400"
              >
                Save Configurations
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}