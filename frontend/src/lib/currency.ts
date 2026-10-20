/**
 * Unified Financial Precision Engine
 */
export class CurrencyFormatter {
  static formatINR(amount: number): string {
    const validAmount = isNaN(amount) ? 0 : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(validAmount);
  }

  static calculateGST(subtotal: number, gstRate: number = 18): number {
    if (isNaN(subtotal) || subtotal <= 0) return 0;
    return Math.round((subtotal * gstRate) / 100);
  }

  static calculateRemainingBalance(grandTotal: number, totalPaid: number): number {
    const balance = grandTotal - totalPaid;
    return balance < 0 ? 0 : balance;
  }
}