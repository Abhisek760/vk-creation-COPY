"use client";

import React from "react";
import { Booking } from "@/types/booking";
import BookingStatusBadge from "./BookingStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface BookingHeaderProps {
  booking: Booking;
}

export const BookingHeader: React.FC<BookingHeaderProps> = ({ booking }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">
          Booking #{booking.bookingNumber}
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Created on: {new Date(booking.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <BookingStatusBadge status={booking.status} />
        <PaymentStatusBadge status={booking.paymentStatus} />
      </div>
    </div>
  );
};

export default BookingHeader;