import jsPDF from "jspdf";

export function drawBookingStatus(
  doc: jsPDF,
  startY = 42
): number {
  // Box
  doc.setDrawColor(24, 53, 103);
  doc.setLineWidth(0.5);

  doc.roundedRect(
    138,
    startY,
    58,
    28,
    2,
    2
  );

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.text(
    "BOOKING STATUS",
    167,
    startY + 7,
    {
      align: "center",
    }
  );

  // Status
  doc.setTextColor(0, 128, 0);

  doc.setFontSize(13);

  doc.text(
    "CONFIRMED",
    167,
    startY + 16,
    {
      align: "center",
    }
  );

  // Payment
  doc.setTextColor(255, 140, 0);

  doc.setFontSize(9);

  doc.text(
    "Advance Paid",
    167,
    startY + 24,
    {
      align: "center",
    }
  );

  doc.setTextColor(0, 0, 0);

  return startY + 32;
}