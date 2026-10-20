import { drawPdfHeader } from "@/lib/pdf/components/PdfHeader";
import { drawServicesTable } from "@/lib/pdf/components/PdfServicesTable";

export function generateBookingPdf(booking: any = {}): void {
  try {
    const doc = {};
    drawPdfHeader(doc, "Booking Confirmation");
    const servicesEndY = drawServicesTable(doc, booking, 140) || 180;
    const nextY = (typeof servicesEndY === 'number' ? servicesEndY : 180) + 10;
  } catch (error) {
    console.error("PDF generation failed", error);
  }
}

export default generateBookingPdf;
