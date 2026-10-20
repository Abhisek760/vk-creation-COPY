'use client';

import React from "react";
import { Booking } from "@/types/booking";
import { formatCurrency } from "@/lib/formatCurrency";
import BookingStatusBadge from "./BookingStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface BookingTableProps {
  bookings: Booking[];
}

export const BookingTable: React.FC<BookingTableProps> = ({ bookings }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-stone-600 border-b border-stone-200 font-semibold">
            <tr>
              <th className="p-4">Booking #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Event Date</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {bookings.length > 0 ? (
              bookings.map((booking) => {
                const customerName =
                  booking.customerName || booking.customer?.name || "N/A";
                const customerPhone =
                  booking.customerPhone || booking.customer?.phone || "";
                const eventDate =
                  booking.eventDate || booking.event?.startDate || "TBD";
                const total = booking.totalAmount || booking.grandTotal || 0;
                const linkHref = "/admin/bookings/" + String(booking.bookingNumber);

                return (
                  <tr
                    key={booking.bookingNumber}
                    className="hover:bg-stone-50 transition"
                  >
                    <td className="p-4 font-mono font-medium text-stone-900">
                      {booking.bookingNumber}
                    </td>

                    <td className="p-4">
                      <p className="font-medium text-stone-900">{customerName}</p>
                      {customerPhone && (
                        <p className="text-xs text-stone-500">{customerPhone}</p>
                      )}
                    </td>

                    <td className="p-4 text-stone-600">{eventDate}</td>

                    <td className="p-4 font-semibold text-stone-900">
                      {formatCurrency(total)}
                    </td>

                    <td className="p-4">
                      <BookingStatusBadge status={booking.status} />
                    </td>

                    <td className="p-4">
                      <PaymentStatusBadge status={booking.paymentStatus} />
                    </td>

                    <td className="p-4 text-right">
                      <a
                        href={linkHref}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition inline-block"
                      >
                        Manage
                      </a>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-stone-400 italic">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
