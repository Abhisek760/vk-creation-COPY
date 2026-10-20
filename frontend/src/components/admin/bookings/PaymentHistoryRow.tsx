'use client';

import React from "react";
import { PaymentRecord } from "@/types/booking";
import { formatCurrency } from "@/lib/formatCurrency";

interface PaymentHistoryRowProps {
  payment: PaymentRecord;
}

export const PaymentHistoryRow: React.FC<PaymentHistoryRowProps> = ({ payment }) => {
  const p = payment as any;
  const receipt = p.receiptNumber || payment.transactionId || payment.id || "N/A";
  const noteText = payment.notes || payment.note || "-";

  return (
    <tr className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition text-sm">
      <td className="px-4 py-3 font-mono font-medium text-stone-900">
        {receipt}
      </td>
      <td className="px-4 py-3 text-stone-600">
        {payment.date ? new Date(payment.date).toLocaleDateString() : "N/A"}
      </td>
      <td className="px-4 py-3 font-semibold text-emerald-700">
        {formatCurrency(payment.amount || 0)}
      </td>
      <td className="px-4 py-3 text-stone-700">
        {payment.method || "N/A"}
      </td>
      <td className="px-4 py-3 text-xs text-stone-500 italic">
        {noteText}
      </td>
    </tr>
  );
};

export default PaymentHistoryRow;
