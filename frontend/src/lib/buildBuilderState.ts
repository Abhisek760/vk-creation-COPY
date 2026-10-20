import { BuilderState } from "@/types/builder";
import { QuoteData } from "@/types/quote";

export function buildBuilderState(
  quote: QuoteData
): BuilderState {
  return {
    services: quote.services,

    customer: quote.customer,

    event: quote.event,

    discount: quote.discount,

    gstEnabled: quote.gstEnabled,

    advancePaid: quote.advancePaid,

    quoteNumber: quote.quoteNumber,

    quoteDate: quote.quoteDate,

    validTill: quote.validTill,

    notes: quote.notes,

    deliverables: quote.deliverables,

    agreement: quote.agreement,
  };
}