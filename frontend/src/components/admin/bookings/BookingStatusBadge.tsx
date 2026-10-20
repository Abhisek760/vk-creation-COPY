"use client";

import React from "react";
import { BookingStatus } from "@/types/booking";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
  const getColors = () => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-rose-100 text-rose-800";
      case "pending":
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getColors()}`}
    >
      {status}
    </span>
  );
};

export default BookingStatusBadge;