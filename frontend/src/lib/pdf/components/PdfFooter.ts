import jsPDF from "jspdf";

import { company } from "@/config/company";

export function drawFooter(
  doc: jsPDF,
  startY: number
) {
  doc.setDrawColor(180);

  doc.line(
    14,
    startY,
    196,
    startY
  );

  doc.setFontSize(10);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    `Thank you for choosing ${company.name}.`,
    14,
    startY + 8
  );

  doc.text(
    company.website,
    14,
    startY + 15
  );

  doc.text(
    company.phone,
    14,
    startY + 22
  );

  doc.text(
    company.email,
    14,
    startY + 29
  );
}