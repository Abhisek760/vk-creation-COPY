"use client";

import React from "react";
import { BookingStatus } from "@/types/booking";

interface BookingStatusEditorProps {
  currentStatus: BookingStatus;
  onStatusChange: (status: BookingStatus) => void;
}

const statuses: BookingStatus[] = [
  "draft",
  "pending",
  "confirmed",
  "shoot_scheduled",
  "editing",
  "completed",
  "cancelled",
];

export const BookingStatusEditor: React.FC<BookingStatusEditorProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
        Update Booking Status
      </h3>
      <select
        value={currentStatus}
        onChange={(e) => onStatusChange(e.target.value as BookingStatus)}
        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500 capitalize"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status.replace("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BookingStatusEditor;