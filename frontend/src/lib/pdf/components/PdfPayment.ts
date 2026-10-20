import jsPDF from "jspdf";

import { BuilderState } from "@/types/builder";
import { calculateFinalQuote } from "@/lib/calculateFinalQuote";

export function drawPayment(
  doc: jsPDF,
  builder: BuilderState,
  startY: number
): number {
  const totals = calculateFinalQuote(builder);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text("Payment Details", 14, startY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  let y = startY + 8;

  doc.text(
    `Grand Total : ₹ ${totals.grandTotal.toLocaleString("en-IN")}`,
    18,
    y
  );

  y += 7;

  doc.text(
    `Advance Paid : ₹ ${totals.advancePaid.toLocaleString("en-IN")}`,
    18,
    y
  );

  y += 7;

  doc.text(
    `Remaining Balance : ₹ ${totals.remainingAmount.toLocaleString("en-IN")}`,
    18,
    y
  );

  y += 12;

  doc.setFont("helvetica", "bold");

  doc.text("Payment Schedule", 14, y);

  doc.setFont("helvetica", "normal");

  y += 8;

  doc.text(
    "✔ Advance Payment : Received",
    18,
    y
  );

  y += 7;

  doc.text(
    "⏳ Wedding Day Payment : Pending",
    18,
    y
  );

  y += 7;

  doc.text(
    "⏳ Before Final Delivery : Pending",
    18,
    y
  );

  return y + 10;
}