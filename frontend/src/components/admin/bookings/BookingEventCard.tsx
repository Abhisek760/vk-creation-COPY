"use client";

import React from "react";
import { Booking } from "@/types/booking";

interface BookingEventCardProps {
  booking: Booking;
}

export const BookingEventCard: React.FC<BookingEventCardProps> = ({ booking }) => {
  const type = booking.eventType || booking.event?.eventType || "N/A";
  const location = booking.eventLocation || booking.event?.location || "N/A";
  const date = booking.eventDate || booking.event?.startDate || "N/A";

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
        Event Details
      </h3>
      <div className="space-y-1 text-sm text-stone-700">
        <p><strong className="font-semibold text-stone-900">Type:</strong> {type}</p>
        <p><strong className="font-semibold text-stone-900">Location:</strong> {location}</p>
        <p><strong className="font-semibold text-stone-900">Date:</strong> {date}</p>
      </div>
    </div>
  );
};

export default BookingEventCard;