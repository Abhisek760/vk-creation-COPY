'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ReportRepository,
  ExecutiveReportData,
  MonthlyRevenueData,
  PackagePerformanceMetric,
} from '@/lib/reportRepository';

export default function AdminReportsPage() {
  const [report, setReport] = useState<ExecutiveReportData | null>(null);

  useEffect(() => {
    setReport(ReportRepository.getExecutiveReport());
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen bg-stone-950 p-10 text-stone-100 flex items-center justify-center">
        <p className="text-stone-400 text-sm">Loading executive analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6 md:p-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Business Intelligence</span>
          <h1 className="text-3xl font-extrabold text-stone-100 mt-1">Executive Reports & Revenue Analytics</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            Audit contract totals, monthly revenue collections, package performance, and pending balances.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => ReportRepository.exportReportToCSV()}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400 transition"
          >
            📊 Export CSV Report
          </button>
          <Link
            href="/admin?settings=open"
            className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-800"
          >
           🌐Back to settings 
          </Link>
        </div>
      </div>

      {/* Top Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Contracted Gross Value</span>
          <p className="text-3xl font-black text-stone-100">₹{report.totalGrossContracted.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-stone-500">Total agreed contract value</p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Realized Collections</span>
          <p className="text-3xl font-black text-emerald-400">
            ₹{report.totalCollectionsRealized.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-stone-500">Bank, UPI & cash received</p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Outstanding Receivables</span>
          <p className="text-3xl font-black text-amber-400">
            ₹{report.totalOutstandingReceivables.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-stone-500">Pending client milestone payments</p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Average Booking Value</span>
          <p className="text-3xl font-black text-stone-100">₹{report.averageBookingValue.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-stone-500">Per wedding celebration</p>
        </div>
      </div>

      {/* Monthly Revenue Comparison Bars */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-stone-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-amber-500">Monthly Revenue & Collection Analysis</h2>
            <p className="text-xs text-stone-400">Comparing monthly contracted value vs actual cash collected.</p>
          </div>
        </div>

        <div className="space-y-4">
          {report.monthlyTrends.map((m: MonthlyRevenueData) => {
            const collectedPct = Math.round((m.collectedAmount / m.grossRevenue) * 100);

            return (
              <div key={m.month} className="space-y-1.5 bg-stone-950 p-4 rounded-xl border border-stone-800">
                <div className="flex justify-between text-xs">
                  <strong className="text-stone-200 font-bold">{m.month}</strong>
                  <span className="text-stone-400">
                    Gross: <strong className="text-stone-100">₹{m.grossRevenue.toLocaleString('en-IN')}</strong> •
                    Collected: <strong className="text-emerald-400">₹{m.collectedAmount.toLocaleString('en-IN')}</strong> ({collectedPct}%)
                  </span>
                </div>
                <div className="w-full bg-stone-900 h-3 rounded-full overflow-hidden border border-stone-800 flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${collectedPct}%` }}
                  />
                  <div
                    className="bg-amber-500/60 h-full transition-all duration-500"
                    style={{ width: `${100 - collectedPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Package Performance Grid */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
        <h2 className="text-lg font-bold text-amber-500">Package Popularity & Revenue Contribution</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-800 uppercase text-stone-400">
              <tr>
                <th className="py-3 px-4">Package Name</th>
                <th className="py-3 px-4">Bookings Count</th>
                <th className="py-3 px-4">Total Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 font-medium">
              {report.packagePerformance.map((pkg: PackagePerformanceMetric, idx: number) => (
                <tr key={idx} className="hover:bg-stone-800/40">
                  <td className="py-3.5 px-4 font-bold text-stone-200">{pkg.packageName}</td>
                  <td className="py-3.5 px-4 font-mono text-stone-300">{pkg.bookingsCount} Weddings</td>
                  <td className="py-3.5 px-4 font-bold text-amber-400">
                    ₹{pkg.totalRevenueGenerated.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}