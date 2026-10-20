import { GSTInvoice, InvoiceItem, PaymentReceipt } from '@/types/invoice';

const DEFAULT_TERMS = [
  'Payment is due by the specified due date on this invoice.',
  'GST at 18% is applicable on all creative & media production services.',
  'Raw data files will be retained for 60 days post project delivery.',
  'All intellectual property rights remain with VK Creation unless explicitly transferred in writing.',
];

const DEFAULT_INVOICES: GSTInvoice[] = [
  {
    id: 'VK-INV-2026-001',
    invoiceNumber: 'VK-INV-2026-001',
    bookingNumber: 'VKCREATION-2026-001',
    customerName: 'Rahul & Sneha Sharma',
    customerPhone: '+91 9876543210',
    customerEmail: 'rahul.s@gmail.com',
    customerAddress: 'Vijay Nagar, Indore, Madhya Pradesh',
    customerGstin: '23ABCDE1234F1Z5',
    invoiceDate: '2026-07-01',
    dueDate: '2026-07-15',
    placeOfSupply: 'Madhya Pradesh (23)',
    taxType: 'INTRA_STATE',
    items: [
      {
        id: 'item-1',
        description: 'Grand Wedding & Reception Cinematic Coverage (2 Days)',
        hsnSacCode: '998381',
        quantity: 1,
        rate: 152542.37,
        amount: 152542.37,
      },
    ],
    subtotal: 152542.37,
    discountAmount: 0,
    taxableAmount: 152542.37,
    cgstRate: 9,
    cgstAmount: 13728.81,
    sgstRate: 9,
    sgstAmount: 13728.81,
    igstRate: 0,
    igstAmount: 0,
    totalAmount: 180000,
    paidAmount: 75000,
    remainingAmount: 105000,
    status: 'Partial',
    paymentHistory: [
      {
        id: 'rec-1',
        receiptNumber: 'REC-2026-001',
        amount: 75000,
        paymentDate: '2026-07-02',
        paymentMethod: 'UPI',
        transactionRef: 'UPI/612398129381',
        notes: '30% Initial Booking Advance',
      },
    ],
    notes: 'Thank you for choosing VK Creation for your wedding celebrations!',
    termsAndConditions: DEFAULT_TERMS,
    signatureName: 'Aman Sharma',
    signatureRole: 'Creative Director & Founder',
    createdAt: new Date().toISOString(),
  },
];

export class InvoiceRepository {
  static getAll(): GSTInvoice[] {
    if (typeof window === 'undefined') return DEFAULT_INVOICES;
    const saved = localStorage.getItem('vk_studio_invoices');
    if (!saved) {
      localStorage.setItem('vk_studio_invoices', JSON.stringify(DEFAULT_INVOICES));
      return DEFAULT_INVOICES;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_INVOICES;
    }
  }

  static getByNumber(invoiceNumber: string): GSTInvoice | null {
    const invoices = this.getAll();
    return invoices.find((inv) => inv.invoiceNumber === invoiceNumber || inv.id === invoiceNumber) || null;
  }

  static save(invoice: GSTInvoice): void {
    if (typeof window === 'undefined') return;
    const invoices = this.getAll();
    const index = invoices.findIndex((i) => i.id === invoice.id || i.invoiceNumber === invoice.invoiceNumber);
    if (index >= 0) {
      invoices[index] = invoice;
    } else {
      invoices.unshift(invoice);
    }
    localStorage.setItem('vk_studio_invoices', JSON.stringify(invoices));
  }

  static calculateTotals(
    items: InvoiceItem[],
    discount: number,
    taxType: 'INTRA_STATE' | 'INTER_STATE' | 'EXEMPT'
  ) {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxableAmount = Math.max(0, subtotal - discount);

    let cgstRate = 0,
      cgstAmount = 0;
    let sgstRate = 0,
      sgstAmount = 0;
    let igstRate = 0,
      igstAmount = 0;

    if (taxType === 'INTRA_STATE') {
      cgstRate = 9;
      sgstRate = 9;
      cgstAmount = Math.round((taxableAmount * 0.09) * 100) / 100;
      sgstAmount = Math.round((taxableAmount * 0.09) * 100) / 100;
    } else if (taxType === 'INTER_STATE') {
      igstRate = 18;
      igstAmount = Math.round((taxableAmount * 0.18) * 100) / 100;
    }

    const totalAmount = Math.round(taxableAmount + cgstAmount + sgstAmount + igstAmount);

    return {
      subtotal,
      discount,
      taxableAmount,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate,
      igstAmount,
      totalAmount,
    };
  }

  static generateUPIQRUrl(upiId: string, name: string, amount: number, note: string): string {
    const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
      name
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
  }
}