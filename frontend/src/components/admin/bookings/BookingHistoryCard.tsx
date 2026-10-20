"use client";

import React from "react";
import { Booking } from "@/types/booking";
import { formatCurrency } from "@/lib/formatCurrency";

interface BookingHistoryCardProps {
  booking: Booking;
}

export const BookingHistoryCard: React.FC<BookingHistoryCardProps> = ({ booking }) => {
  const history = booking.paymentHistory || [];

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
        Payment History
      </h3>

      {history.length === 0 ? (
        <p className="text-sm text-stone-400 italic">No payments recorded yet.</p>
      ) : (
        <div className="divide-y divide-stone-100">
          {history.map((pay) => (
            <div key={pay.id} className="py-3 flex justify-between items-center text-sm">
              <div>
                <p className="font-medium text-stone-900">
                  {formatCurrency(pay.amount)} via {pay.method}
                </p>
                <p className="text-xs text-stone-400">
                  {new Date(pay.date).toLocaleString()}
                  {pay.transactionId ? ` • Ref: ${pay.transactionId}` : ""}
                </p>
              </div>
              {pay.notes && (
                <span className="text-xs bg-stone-100 px-2 py-1 rounded text-stone-600">
                  {pay.notes}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryCard;