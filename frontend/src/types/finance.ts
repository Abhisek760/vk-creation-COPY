export type PaymentMethod = 'UPI' | 'Cash' | 'Bank Transfer' | 'Cheque' | 'Card';

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  bookingNumber: string;
  customerName: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  referenceNo?: string; // UTR / Txn ID / Cheque No
  notes?: string;
  receivedBy: string;
}

export interface TaxInvoice {
  id: string;
  invoiceNumber: string;
  bookingNumber: string;
  issueDate: string;
  dueDate: string;
  customerName: string;
  customerPhone: string;
  customerGst?: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  status: 'Paid' | 'Partial' | 'Overdue' | 'Unpaid';
}