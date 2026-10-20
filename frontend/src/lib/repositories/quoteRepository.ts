import { Quote } from "@/types/quote";
import { getStorageItem, setStorageItem } from "../storage/localStorageProvider";

const QUOTES_STORAGE_KEY = "studio_quotes_v1";

export const quoteRepository = {
  getAll: (): Quote[] => {
    try {
      const data = getStorageItem<Quote[]>(QUOTES_STORAGE_KEY, []);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching quotes:", error);
      return [];
    }
  },

  getById: (id: string): Quote | null => {
    const quotes = quoteRepository.getAll();
    return quotes.find((q) => q.id === id || q.quoteNumber === id) || null;
  },

  getByQuoteNumber: (quoteNumber: string): Quote | null => {
    return quoteRepository.getById(quoteNumber);
  },

  getByNumber: (quoteNumber: string): Quote | null => {
    return quoteRepository.getById(quoteNumber);
  },

  save: (quote: Quote): Quote => {
    const quotes = quoteRepository.getAll();
    const existingIndex = quotes.findIndex((q) => q.id === quote.id);

    const updatedQuote = {
      ...quote,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      quotes[existingIndex] = updatedQuote;
    } else {
      quotes.unshift(updatedQuote);
    }

    setStorageItem(QUOTES_STORAGE_KEY, quotes);
    return updatedQuote;
  },

  duplicate: (idOrNumber: string): Quote | null => {
    const original = quoteRepository.getById(idOrNumber);
    if (!original) return null;

    const newId = `QT-${Date.now().toString().slice(-6)}`;
    const duplicatedQuote: Quote = {
      ...original,
      id: newId,
      quoteNumber: newId,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return quoteRepository.save(duplicatedQuote);
  },

  delete: (id: string): boolean => {
    const quotes = quoteRepository.getAll();
    const filtered = quotes.filter((q) => q.id !== id && q.quoteNumber !== id);
    
    if (filtered.length !== quotes.length) {
      setStorageItem(QUOTES_STORAGE_KEY, filtered);
      return true;
    }
    return false;
  },

  importQuotes: (importedQuotes: Quote[]): boolean => {
    if (!Array.isArray(importedQuotes)) return false;

    const currentQuotes = quoteRepository.getAll();
    const quoteMap = new Map<string, Quote>();

    currentQuotes.forEach((q) => quoteMap.set(q.id, q));
    importedQuotes.forEach((q) => {
      if (q && q.id) quoteMap.set(q.id, q);
    });

    setStorageItem(QUOTES_STORAGE_KEY, Array.from(quoteMap.values()));
    return true;
  },
};

export const QuoteRepository = quoteRepository;
export default quoteRepository;