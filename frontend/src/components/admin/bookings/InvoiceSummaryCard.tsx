'use client';

import React from "react";
import { Booking } from "@/types/booking";
import { formatCurrency } from "@/lib/formatCurrency";

interface InvoiceSummaryCardProps {
  booking: Booking;
}

export const InvoiceSummaryCard: React.FC<InvoiceSummaryCardProps> = ({ booking }) => {
  const b = booking as any;
  const total = booking.totalAmount || booking.grandTotal || b.subtotal || 0;
  const paid = booking.paidAmount || 0;
  const remaining = booking.remainingAmount ?? Math.max(0, total - paid);

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
        Invoice Summary
      </h3>

      <div className="space-y-2 text-sm text-stone-700">
        <div className="flex justify-between">
          <span className="text-stone-500">Total Amount:</span>
          <span className="font-medium text-stone-900">{formatCurrency(total)}</span>
        </div>

        <div className="flex justify-between text-emerald-600">
          <span>Amount Paid:</span>
          <span className="font-semibold">{formatCurrency(paid)}</span>
        </div>

        <div className="flex justify-between text-rose-600 font-bold border-t border-stone-100 pt-2">
          <span>Balance Due:</span>
          <span>{formatCurrency(remaining)}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummaryCard;
