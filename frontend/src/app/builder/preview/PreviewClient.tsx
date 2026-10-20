"use client";

import { useSearchParams } from "next/navigation";

import QuotationViewer from "@/components/quotation/QuotationViewer";
import { buildQuotePreview } from "@/lib/buildQuotePreview";
import { QuoteRepository } from "@/lib/repositories/quoteRepository";
import { useBuilder } from "@/hooks/useBuilder";



export default function PreviewClient() {
  const { builder } = useBuilder();

  const searchParams = useSearchParams();

  const quoteNumber = searchParams.get("quote");

  // -----------------------------
  // Saved Quote Preview
  // -----------------------------

  if (quoteNumber) {
    const savedQuote =
      QuoteRepository.getByQuoteNumber(quoteNumber);

    if (!savedQuote) {
      return (
        <main className="mx-auto max-w-4xl p-10">
          <h1 className="text-3xl font-bold">
            Quote Not Found
          </h1>

          <p className="mt-4 text-gray-500">
            This quotation does not exist.
          </p>
        </main>
      );
    }

return <QuotationViewer quote={savedQuote} />;
  }

  // -----------------------------
  // Live Builder Preview
  // -----------------------------

  const quote = buildQuotePreview(builder);

return <QuotationViewer quote={quote} />;
}