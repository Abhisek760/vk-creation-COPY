import { PaymentRecord } from "@/types/booking";

import PaymentHistoryRow from "./PaymentHistoryRow";

interface Props {
  payments: PaymentRecord[];
}

export default function PaymentHistoryTable({
  payments,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-xl font-bold">
          Payment History
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          All received payments for this booking
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No payments received yet.
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">
                Receipt
              </th>

              <th className="px-4 py-3 text-left">
                Amount
              </th>

              <th className="px-4 py-3 text-left">
                Method
              </th>

              <th className="px-4 py-3 text-left">
                Transaction ID
              </th>

              <th className="px-4 py-3 text-left">
                Received By
              </th>

              <th className="px-4 py-3 text-left">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <PaymentHistoryRow
                key={payment.id}
                payment={payment}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}