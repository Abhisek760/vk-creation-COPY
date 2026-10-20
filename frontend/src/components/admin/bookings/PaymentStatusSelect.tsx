"use client";

import { useState } from "react";

import { BookingRepository } from "@/lib/repositories/bookingRepository";

import { PaymentStatus } from "@/types/booking";

interface Props {
  bookingNumber: string;

  value: PaymentStatus;
}

const statuses: PaymentStatus[] = [
  "pending",
  "advance_paid",
  "partially_paid",
  "paid",
  "refunded",
];

export default function PaymentStatusSelect({
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
          e.target.value as PaymentStatus;

        setStatus(newStatus);

        BookingRepository.updatePaymentStatus(
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