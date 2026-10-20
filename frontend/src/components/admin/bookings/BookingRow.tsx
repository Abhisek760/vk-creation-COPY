"use client";

import React from "react";
import { Booking } from "@/types/booking";
import { formatCurrency } from "@/lib/formatCurrency";

interface BookingRowProps {
  booking: Booking;
}

export const BookingRow: React.FC<BookingRowProps> = ({ booking }) => {
  const customerName = booking.customerName || booking.customer?.name || "N/A";
  const eventDate = booking.eventDate || booking.event?.startDate || "TBD";

  return (
    <tr className="hover:bg-stone-50 transition">
      <td className="py-3 px-4 font-mono font-medium text-stone-900">
        {booking.bookingNumber}
      </td>
      <td className="py-3 px-4 font-medium text-stone-900">
        {customerName}
      </td>
      <td className="py-3 px-4 text-stone-600">
        {eventDate}
      </td>
      <td className="py-3 px-4 font-semibold text-stone-900">
        {formatCurrency(booking.totalAmount || 0)}
      </td>
      <td className="py-3 px-4 capitalize">
        {booking.status}
      </td>
      <td className="py-3 px-4 text-right">
        <a
          href={`/admin/bookings/${booking.bookingNumber}`}
          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition inline-block"
        >
          View
        </a>
      </td>
    </tr>
  );
};

export default BookingRow;