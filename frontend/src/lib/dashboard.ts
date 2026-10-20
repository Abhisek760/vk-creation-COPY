import { Quote } from '@/types/quote';
import { DashboardStats } from '@/types/dashboard';

export function calculateDashboardStats(quotes: Quote[] = []): DashboardStats {
  const totalQuotes = quotes.length;
  const totalRevenue = quotes.reduce(
    (sum, quote) => sum + Number(quote?.grandTotal || 0),
    0
  );

  const amounts = quotes.map((q) => Number(q?.grandTotal || 0)).filter((a) => a > 0);
  const averageQuote = totalQuotes > 0 ? Math.round(totalRevenue / totalQuotes) : 0;
  const highestQuote = amounts.length > 0 ? Math.max(...amounts) : 0;

  const sorted = [...quotes].sort((a, b) => {
    const timeA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  const latest = sorted[0];

  return {
    totalQuotes,
    totalRevenue,
    averageQuote,
    highestQuote,
    latestQuote: latest
      ? {
          quoteNumber: latest.quoteNumber || latest.id || 'DRAFT',
          customer: latest.customer?.name || latest.customerName || 'Guest',
          amount: Number(latest.grandTotal || 0),
          date: latest.createdAt || new Date().toISOString(),
        }
      : undefined,
  };
}
