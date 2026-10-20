export type TaxType = 'INTRA_STATE' | 'INTER_STATE' | 'EXEMPT';

export interface InvoiceItem {
  id: string;
  description: string;
  hsnSacCode?: string; // Standard SAC 998381 for Photography Services
  quantity: number;
  rate: number;
  amount: number;
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'UPI' | 'Bank Transfer' | 'Cash' | 'Cheque' | string;
  transactionRef?: string;
  notes?: string;
}

export interface GSTInvoice {
  id: string;
  invoiceNumber: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  customerGstin?: string;
  invoiceDate: string;
  dueDate: string;
  placeOfSupply: string; // e.g., "Madhya Pradesh (23)"
  taxType: TaxType;
  items: InvoiceItem[];
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  cgstRate: number; // e.g. 9%
  cgstAmount: number;
  sgstRate: number; // e.g. 9%
  sgstAmount: number;
  igstRate: number; // e.g. 18%
  igstAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
  paymentHistory: PaymentReceipt[];
  notes?: string;
  termsAndConditions?: string[];
  signatureName?: string;
  signatureRole?: string;
  createdAt: string;
}