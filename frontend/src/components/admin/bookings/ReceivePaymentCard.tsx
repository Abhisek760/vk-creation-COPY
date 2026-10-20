'use client';

import React, { useState } from "react";
import { Booking, PaymentMethod } from "@/types/booking";
import { toast } from "@/lib/toast";

interface Props {
  booking: Booking;
  onAddPayment?: (payment: { amount: number; method: PaymentMethod; note?: string; transactionId?: string }) => void;
}

export const ReceivePaymentCard: React.FC<Props> = ({ booking, onAddPayment }) => {
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<PaymentMethod>("UPI");
  const [transactionId, setTransactionId] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (onAddPayment) {
      onAddPayment({
        amount: num,
        method,
        transactionId,
        note,
      });
    }

    setAmount("");
    setTransactionId("");
    setNote("");
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
        Receive Payment
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-stone-500 block mb-1">Amount (?)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-amber-500"
            required
          />
        </div>

        <div>
          <label className="text-xs text-stone-500 block mb-1">Payment Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-amber-500"
          >
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-stone-500 block mb-1">Transaction Ref / ID</label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Optional"
            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs text-stone-500 block mb-1">Note</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional"
            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition shadow-sm mt-2"
        >
          Record Payment
        </button>
      </form>
    </div>
  );
};

export default ReceivePaymentCard;
