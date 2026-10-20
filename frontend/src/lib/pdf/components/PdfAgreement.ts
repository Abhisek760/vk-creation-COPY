import jsPDF from "jspdf";

import { BuilderState } from "@/types/builder";

export function drawAgreement(
  doc: jsPDF,
  builder: BuilderState,
  startY: number
): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text(
    "Terms & Conditions",
    14,
    startY
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  let y = startY + 8;

  const lines = [
    `• Food Included : ${
      builder.agreement.foodIncluded
        ? "Yes"
        : "No"
    }`,

    `• Travel Included : ${
      builder.agreement.travelIncluded
        ? "Yes"
        : "No"
    }`,

    `• Delivery Time : ${builder.agreement.deliveryDays} Days`,

    `• Payment Terms : ${builder.agreement.paymentTerms}`,

    `• Cancellation : ${builder.agreement.cancellationPolicy}`,

    `• Copyright : ${builder.agreement.copyright}`,
  ];

  lines.forEach((line) => {
    doc.text(line, 18, y);
    y += 7;
  });

  return y;
}