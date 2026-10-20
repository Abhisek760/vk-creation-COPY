"use client";

import { PaymentStatus } from "@/types/booking";
import { BookingRepository } from "@/lib/repositories/bookingRepository";

interface Props {
  bookingNumber: string;
  value: PaymentStatus;
  onChange: (status: PaymentStatus) => void;
}

const statuses: PaymentStatus[] = [
  "pending",
  "advance_paid",
  "partially_paid",
  "paid",
  "refunded",
];

export default function PaymentStatusEditor({
  bookingNumber,
  value,
  onChange,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) => {
        const status = e.target.value as PaymentStatus;

        BookingRepository.updatePaymentStatus(
          bookingNumber,
          status
        );

        onChange(status);
      }}
      className="w-full rounded-xl border p-3"
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  );
}