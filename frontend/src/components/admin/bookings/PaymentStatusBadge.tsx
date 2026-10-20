"use client";

import React from "react";
import { PaymentStatus } from "@/types/booking";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const getColors = () => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "partially_paid":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "pending":
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  const getLabel = () => {
    if (status === "partially_paid") return "Partially Paid";
    return status;
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getColors()}`}
    >
      {getLabel()}
    </span>
  );
};

export default PaymentStatusBadge;