import { Quote } from "@/types/quote";
import { companyConfig } from "@/config/company";
import { formatCurrency } from "../formatCurrency";

export function generateQuotePdfContent(quote: Quote) {
  const customerName = quote.customer?.name || "Valued Client";
  const totalAmount = formatCurrency(quote.totals?.grandTotal || 0);

  return {
    title: `Quotation #${quote.id}`,
    customerName,
    company: companyConfig.name,
    eventDate: quote.event?.startDate || "TBD",
    services: quote.services || [],
    totals: quote.totals,
    formattedTotal: totalAmount,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateQuotePdf(quote: Quote): Promise<void> {
  console.log("Generating Quote PDF for:", quote.id);
  // Web printable window fallback for direct quote printing
  if (typeof window !== "undefined") {
    window.print();
  }
}