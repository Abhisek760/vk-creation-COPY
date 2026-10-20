import {
  BookingStatus,
  PaymentStatus,
} from "@/types/booking";

interface Props {
  bookingStatus: BookingStatus | "all";
  paymentStatus: PaymentStatus | "all";

  onBookingChange: (
    value: BookingStatus | "all"
  ) => void;

  onPaymentChange: (
    value: PaymentStatus | "all"
  ) => void;
}

export default function BookingFilters({
  bookingStatus,
  paymentStatus,
  onBookingChange,
  onPaymentChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4">

      <select
        value={bookingStatus}
        onChange={(e) =>
          onBookingChange(
            e.target.value as BookingStatus | "all"
          )
        }
        className="rounded-xl border p-3"
      >
        <option value="all">
          All Booking Status
        </option>

        <option value="confirmed">
          Confirmed
        </option>

        <option value="editing">
          Editing
        </option>

        <option value="ready">
          Ready
        </option>

        <option value="delivered">
          Delivered
        </option>

      </select>

      <select
        value={paymentStatus}
        onChange={(e) =>
          onPaymentChange(
            e.target.value as PaymentStatus | "all"
          )
        }
        className="rounded-xl border p-3"
      >
        <option value="all">
          All Payments
        </option>

        <option value="pending">
          Pending
        </option>

        <option value="advance_paid">
          Advance Paid
        </option>

        <option value="partially_paid">
          Partial
        </option>

        <option value="paid">
          Paid
        </option>

      </select>

    </div>
  );
}