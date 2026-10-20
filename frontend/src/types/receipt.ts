export type ReceiptCategory = 'ADVANCE' | 'PARTIAL' | 'FINAL_SETTLEMENT';

export interface PaymentReceiptVoucher {
  id: string;
  receiptNumber: string; // e.g. REC-2026-1001
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  eventType: string;
  eventDate: string;
  receiptCategory: ReceiptCategory;
  amountReceived: number;
  totalContractValue: number;
  previousTotalPaid: number;
  newRemainingBalance: number;
  paymentMethod: 'UPI' | 'Bank Transfer' | 'Cash' | 'Cheque' | 'Card';
  transactionRef?: string;
  receivedBy: string;
  notes?: string;
  issuedAt: string;
}