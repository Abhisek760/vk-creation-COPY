export interface DashboardStats {
  totalQuotes: number;
  totalRevenue: number;
  averageQuote: number;
  highestQuote: number;
  latestQuote?: {
    quoteNumber: string;
    customer: string;
    amount: number;
    date: string;
  };
  [key: string]: any;
}
