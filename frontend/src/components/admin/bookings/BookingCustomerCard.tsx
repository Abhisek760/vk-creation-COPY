"use client";

import React from "react";
import { Booking } from "@/types/booking";

interface BookingCustomerCardProps {
  booking: Booking;
}

export const BookingCustomerCard: React.FC<BookingCustomerCardProps> = ({
  booking,
}) => {
  const name = booking.customerName || (booking as any).customer?.name || "N/A";
  const email = booking.customerEmail || (booking as any).customer?.email || "N/A";
  const phone = booking.customerPhone || (booking as any).customer?.phone || "N/A";

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
        Customer Details
      </h3>

      <div className="space-y-1 text-sm text-stone-700">
        <p>
          <strong className="font-semibold text-stone-900">Name:</strong> {name}
        </p>

        <p>
          <strong className="font-semibold text-stone-900">Email:</strong> {email}
        </p>

        <p>
          <strong className="font-semibold text-stone-900">Phone:</strong> {phone}
        </p>
      </div>
    </div>
  );
};

export default BookingCustomerCard;