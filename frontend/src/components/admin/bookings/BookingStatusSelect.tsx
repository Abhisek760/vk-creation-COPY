"use client";

import { useState } from "react";

import { BookingRepository } from "@/lib/repositories/bookingRepository";

import { BookingStatus } from "@/types/booking";

interface Props {
  bookingNumber: string;

  value: BookingStatus;
}

const statuses: BookingStatus[] = [
  "confirmed",
  "shoot_scheduled",
  "editing",
  "ready",
  "delivered",
  "closed",
  "cancelled",
];

export default function BookingStatusSelect({
  bookingNumber,
  value,
}: Props) {
  const [status, setStatus] =
    useState(value);

  return (
    <select
      value={status}
      onChange={(e) => {
        const newStatus =
          e.target.value as BookingStatus;

        setStatus(newStatus);

        BookingRepository.updateBookingStatus(
          bookingNumber,
          newStatus
        );
      }}
      className="rounded-lg border p-2"
    >
      {statuses.map((item) => (
        <option
          key={item}
          value={item}
        >
          {item}
        </option>
      ))}
    </select>
  );
}