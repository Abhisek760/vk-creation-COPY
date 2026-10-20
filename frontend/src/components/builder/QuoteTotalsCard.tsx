"use client";

import {
  Receipt,
  IndianRupee,
  Wallet,
  Landmark,
} from "lucide-react";

import { formatCurrency } from "@/lib/formatCurrency";

interface QuoteTotalsCardProps {
  subtotal: number;
  discount: number;
  taxableAmount: number;
  gst: number;
  grandTotal: number;
  advancePaid: number;
  remainingAmount: number;
}

export default function QuoteTotalsCard({
  subtotal,
  discount,
  taxableAmount,
  gst,
  grandTotal,
  advancePaid,
  remainingAmount,
}: QuoteTotalsCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#161b22] p-5 shadow-lg">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
          <Receipt size={22} />
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Financial Summary
          </h3>

          <p className="text-xs text-gray-400">
            Live quotation totals
          </p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-300">Subtotal</span>
          <span className="font-semibold text-white">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">Discount</span>
          <span className="font-semibold text-red-400">
            - {formatCurrency(discount)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">Taxable Amount</span>
          <span className="font-semibold text-white">
            {formatCurrency(taxableAmount)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">GST (18%)</span>
          <span className="font-semibold text-white">
            {formatCurrency(gst)}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
        <div className="flex items-center gap-2">
          <IndianRupee size={20} />
          <p className="text-sm uppercase tracking-wide">
            Grand Total
          </p>
        </div>

        <p className="mt-3 text-3xl font-bold">
          {formatCurrency(grandTotal)}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-green-500/10 p-3">
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-green-400" />
            <span className="text-sm font-medium text-gray-200">
              Advance Paid
            </span>
          </div>

          <span className="font-semibold text-green-400">
            {formatCurrency(advancePaid)}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-orange-500/10 p-3">
          <div className="flex items-center gap-2">
            <Landmark size={18} className="text-orange-400" />
            <span className="text-sm font-medium text-gray-200">
              Remaining
            </span>
          </div>

          <span className="font-semibold text-orange-400">
            {formatCurrency(remainingAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}