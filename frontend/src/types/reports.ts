export interface MonthlyRevenueData {
  month: string;
  grossRevenue: number;
  collectedAmount: number;
  pendingAmount: number;
}

export interface PackagePerformanceMetric {
  packageName: string;
  bookingsCount: number;
  totalRevenueGenerated: number;
}

export interface ExecutiveReportData {
  totalGrossContracted: number;
  totalCollectionsRealized: number;
  totalOutstandingReceivables: number;
  averageBookingValue: number;
  totalActiveBookingsCount: number;
  monthlyTrends: MonthlyRevenueData[];
  packagePerformance: PackagePerformanceMetric[];
}