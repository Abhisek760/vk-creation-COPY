import jsPDF from "jspdf";

import { BuilderState } from "@/types/builder";
import { calculateFinalQuote } from "@/lib/calculateFinalQuote";

export function drawTotals(
  doc: jsPDF,
  builder: BuilderState,
  startY: number
) {
  const totals = calculateFinalQuote(builder);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text("Payment Summary", 14, startY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  let y = startY + 8;

  const rows = [
    ["Subtotal", totals.subtotal],
    ["Discount", totals.discount],
    ["GST", totals.gst],
    ["Grand Total", totals.grandTotal],
    ["Advance Paid", totals.advancePaid],
    ["Remaining Balance", totals.remainingAmount],
  ];

  rows.forEach(([label, value]) => {
    doc.text(
      `${label} : ₹ ${Number(value).toLocaleString("en-IN")}`,
      18,
      y
    );

    y += 7;
  });

  return y;
}