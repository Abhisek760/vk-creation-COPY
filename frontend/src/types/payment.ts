export type PaymentMethod = 'UPI' | 'Bank Transfer' | 'Cash' | 'Cheque' | 'Card';

export type TrancheType = 'Booking Advance' | 'Pre-Shoot Tranche' | 'Event Day Payment' | 'Delivery Settlement' | 'Custom Add-on';

export type PaymentLedgerStatus = 'Paid' | 'Partially Paid' | 'Overdue' | 'Unpaid';

export interface StudioBankDetails {
  upiId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  branch: string;
  qrCodeUrl?: string;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  bookingNumber: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  trancheType: TrancheType;
  transactionRef?: string;
  receivedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface PaymentLedger {
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  eventType: string;
  eventDate: string;
  totalContractAmount: number;
  advancePaid: number;
  paidAmount: number;
  remainingBalance: number;
  dueDate: string;
  status: PaymentLedgerStatus;
  transactions: PaymentTransaction[];
  lastReminderSentAt?: string;
}

export interface PaymentSummaryKPIs {
  totalCollected: number;
  totalOutstanding: number;
  totalOverdue: number;
  activeBookingsCount: number;
}