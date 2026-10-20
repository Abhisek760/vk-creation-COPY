export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  qrCodeUrl?: string;
}

export interface StudioInvoice {
  invoiceNumber: string;
  bookingNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  gstRate: number; // e.g., 18 for 18% GST
  gstAmount: number;
  discountAmount: number;
  grandTotal: number;
  advancePaid: number;
  remainingBalance: number;
  status: 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue';
  bankDetails: BankDetails;
  notes?: string;
}

export interface PaymentReceipt {
  receiptNumber: string;
  bookingNumber: string;
  invoiceNumber: string;
  clientName: string;
  paymentType: 'Advance Payment' | 'Partial Payment' | 'Final Settlement';
  amountPaid: number;
  paymentDate: string;
  paymentMode: 'UPI' | 'Bank Transfer' | 'Cash' | 'Cheque' | string;
  transactionRef: string;
  remainingBalanceAfter: number;
  issuedBy: string;
}

export interface LegalAgreement {
  agreementNumber: string;
  bookingNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  eventDate: string;
  venueLocation: string;
  packageName: string;
  totalAgreedAmount: number;
  advanceAmountPaid: number;
  termsAndConditions: string[];
  studioPolicies: string[];
  clientSignature?: string;
  studioSignature?: string;
  signedAt?: string;
  status: 'Draft' | 'Pending Signature' | 'Fully Executed';
}