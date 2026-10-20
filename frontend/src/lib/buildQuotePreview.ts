import { BuilderState } from "@/types/builder";
import { QuoteData } from "@/types/quote";

import { buildQuoteData } from "./buildQuoteData";

export function buildQuotePreview(
  builder: BuilderState
): QuoteData {
  return buildQuoteData(builder);
}