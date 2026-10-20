"use client";

import React from "react";
import { Booking } from "@/types/booking";
import { formatCurrency } from "@/lib/formatCurrency";

interface BookingPaymentCardProps {
  booking: Booking;
}

export const BookingPaymentCard: React.FC<BookingPaymentCardProps> = ({ booking }) => {
  const total = booking.totalAmount || (booking as any).grandTotal || 0;
  const paid = booking.paidAmount || 0;
  const remaining = booking.remainingAmount ?? (total - paid);

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
        Payment Financials
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>Total Investment:</span>
          <strong className="font-semibold text-stone-900">
            {formatCurrency(total)}
          </strong>
        </div>

        <div className="flex justify-between text-emerald-600">
          <span>Amount Paid:</span>
          <strong className="font-semibold">
            {formatCurrency(paid)}
          </strong>
        </div>

        <div className="flex justify-between text-rose-600 font-bold border-t border-stone-100 pt-2">
          <span>Remaining Balance:</span>
          <strong>
            {formatCurrency(remaining)}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default BookingPaymentCard;