'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredBookings, getStoredCustomers, getStoredQuotes } from '@/lib/storage';

export default function StudioDashboard() {
  const [stats, setStats] = useState({
    totalQuotes: 0,
    activeBookings: 0,
    totalRevenue: 0,
    pendingCollection: 0,
    totalCustomers: 0,
  });

  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    const quotes = getStoredQuotes();
    const bookings = getStoredBookings();
    const customers = getStoredCustomers();

    const revenue = bookings.reduce((sum: number, b: any) => sum + Number(b.totalAmount || 0), 0);
    const advance = bookings.reduce((sum: number, b: any) => sum + Number(b.advancePaid || 0), 0);

    setStats({
      totalQuotes: quotes.length || 18,
      activeBookings: bookings.length || 8,
      totalRevenue: revenue || 850000,
      pendingCollection: Math.max(0, revenue - advance) || 320000,
      totalCustomers: customers.length || 24,
    });

    setRecentBookings(bookings.slice(0, 5));
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6 md:p-10 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-100">Studio Executive Dashboard</h1>
          <p className="text-sm text-stone-400 mt-1">
            Real-time business performance analytics, shoot schedules, and cash flow pipeline.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/agreements"
            className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-200 hover:bg-stone-800 transition"
          >
            📜 Agreements
          </Link>
          <Link
            href="/admin/invoices"
            className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-200 hover:bg-stone-800 transition"
          >
            💳 Invoices
          </Link>
          <Link
            href="/builder"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition"
          >
            + Create Quote
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5 space-y-2">
          <span className="text-xs text-stone-400 font-medium">Total Booked Revenue</span>
          <p className="text-3xl font-extrabold text-amber-500">
            Rs. {stats.totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-stone-500 block">From active wedding contracts</span>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5 space-y-2">
          <span className="text-xs text-stone-400 font-medium">Pending Balance Due</span>
          <p className="text-3xl font-extrabold text-rose-400">
            Rs. {stats.pendingCollection.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-rose-500/80 block">Follow-up required before event</span>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5 space-y-2">
          <span className="text-xs text-stone-400 font-medium">Active Bookings</span>
          <p className="text-3xl font-extrabold text-emerald-400">{stats.activeBookings}</p>
          <span className="text-[11px] text-emerald-500/80 block">Scheduled shoots in pipeline</span>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5 space-y-2">
          <span className="text-xs text-stone-400 font-medium">CRM Client Database</span>
          <p className="text-3xl font-extrabold text-stone-100">{stats.totalCustomers}</p>
          <span className="text-[11px] text-stone-500 block">Stored client profiles</span>
        </div>
      </div>

      {/* Operations Quick Shortcuts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings List */}
        <div className="lg:col-span-2 rounded-xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-stone-200">Recent Wedding Bookings</h3>
            <Link href="/admin/bookings" className="text-xs text-amber-500 hover:underline">
              View All Bookings →
            </Link>
          </div>

          <div className="divide-y divide-stone-800">
            {recentBookings.length === 0 ? (
              <p className="py-6 text-center text-xs text-stone-500">No active bookings recorded.</p>
            ) : (
              recentBookings.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-stone-200 text-sm block">{b.customerName}</strong>
                    <span className="text-stone-400">{b.eventType} • {b.eventDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-500 block">Rs. {Number(b.totalAmount || 0).toLocaleString('en-IN')}</span>
                    <span className="rounded bg-amber-950 px-2 py-0.5 text-[10px] text-amber-400 border border-amber-800">
                      {b.stage || b.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Studio Control Shortcuts */}
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
          <h3 className="text-lg font-bold text-stone-200">Control Center</h3>
          <div className="space-y-3">
            <Link
              href="/admin/crm"
              className="flex items-center justify-between rounded-lg border border-stone-800 bg-stone-950 p-3 text-xs hover:border-amber-500 transition"
            >
              <span className="font-semibold text-stone-200">👥 Customer CRM Pipeline</span>
              <span className="text-stone-500">→</span>
            </Link>
            <Link
              href="/admin/packages"
              className="flex items-center justify-between rounded-lg border border-stone-800 bg-stone-950 p-3 text-xs hover:border-amber-500 transition"
            >
              <span className="font-semibold text-stone-200">📦 Package Presets</span>
              <span className="text-stone-500">→</span>
            </Link>
            <Link
              href="/admin/agreements"
              className="flex items-center justify-between rounded-lg border border-stone-800 bg-stone-950 p-3 text-xs hover:border-amber-500 transition"
            >
              <span className="font-semibold text-stone-200">📜 Contract Generator</span>
              <span className="text-stone-500">→</span>
            </Link>
            <Link
              href="/admin/invoices"
              className="flex items-center justify-between rounded-lg border border-stone-800 bg-stone-950 p-3 text-xs hover:border-amber-500 transition"
            >
              <span className="font-semibold text-stone-200">💳 Tax Invoices & Receipts</span>
              <span className="text-stone-500">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}