import { PaymentReceiptVoucher, ReceiptCategory } from '@/types/receipt';

const DEFAULT_RECEIPTS: PaymentReceiptVoucher[] = [
  {
    id: 'REC-2026-1001',
    receiptNumber: 'REC-2026-1001',
    bookingNumber: 'VKCREATION-2026-001',
    customerName: 'Rahul & Sneha Sharma',
    customerPhone: '+91 9876543210',
    customerEmail: 'rahul.s@gmail.com',
    eventType: 'Grand Wedding & Reception',
    eventDate: '2026-11-20',
    receiptCategory: 'ADVANCE',
    amountReceived: 75000,
    totalContractValue: 180000,
    previousTotalPaid: 0,
    newRemainingBalance: 105000,
    paymentMethod: 'UPI',
    transactionRef: 'UPI/612398129381',
    receivedBy: 'Aman Sharma',
    notes: '30% Initial Booking Deposit Received with thanks.',
    issuedAt: '2026-07-02T10:30:00.000Z',
  },
  {
    id: 'REC-2026-1002',
    receiptNumber: 'REC-2026-1002',
    bookingNumber: 'VKCREATION-2026-002',
    customerName: 'Priya & Ankit',
    customerPhone: '+91 9123456789',
    customerEmail: 'priya.ankit@gmail.com',
    eventType: 'Pre-Wedding & Engagement',
    eventDate: '2026-08-15',
    receiptCategory: 'FINAL_SETTLEMENT',
    amountReceived: 40000,
    totalContractValue: 65000,
    previousTotalPaid: 25000,
    newRemainingBalance: 0,
    paymentMethod: 'Bank Transfer',
    transactionRef: 'NEFT/HDFC2981293',
    receivedBy: 'Aman Sharma',
    notes: 'Full & final payment settlement for engagement package.',
    issuedAt: '2026-07-18T14:15:00.000Z',
  },
];

export class ReceiptRepository {
  static getAll(): PaymentReceiptVoucher[] {
    if (typeof window === 'undefined') return DEFAULT_RECEIPTS;
    const saved = localStorage.getItem('vk_studio_receipts');
    if (!saved) {
      localStorage.setItem('vk_studio_receipts', JSON.stringify(DEFAULT_RECEIPTS));
      return DEFAULT_RECEIPTS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_RECEIPTS;
    }
  }

  static getByReceiptNumber(receiptNumber: string): PaymentReceiptVoucher | null {
    const receipts = this.getAll();
    return receipts.find((r) => r.receiptNumber === receiptNumber || r.id === receiptNumber) || null;
  }

  static save(receipt: PaymentReceiptVoucher): void {
    if (typeof window === 'undefined') return;
    const receipts = this.getAll();
    const index = receipts.findIndex((r) => r.id === receipt.id || r.receiptNumber === receipt.receiptNumber);
    if (index >= 0) {
      receipts[index] = receipt;
    } else {
      receipts.unshift(receipt);
    }
    localStorage.setItem('vk_studio_receipts', JSON.stringify(receipts));
  }

  static generateWhatsAppReceiptLink(receipt: PaymentReceiptVoucher): string {
    const cleanPhone = receipt.customerPhone.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const text = encodeURIComponent(
      `Hello ${receipt.customerName}! ✨\n\n` +
        `Thank you for your payment to *VK Creation Studio*.\n\n` +
        `🧾 *Receipt No:* ${receipt.receiptNumber}\n` +
        `📋 *Booking Ref:* ${receipt.bookingNumber}\n` +
        `💰 *Amount Received:* ₹${receipt.amountReceived.toLocaleString('en-IN')}\n` +
        `💳 *Payment Method:* ${receipt.paymentMethod}\n` +
        `⏳ *Remaining Balance:* ₹${receipt.newRemainingBalance.toLocaleString('en-IN')}\n\n` +
        `You can view & print your official receipt voucher here:\n` +
        `${window.location.origin}/booking/receipt/${receipt.receiptNumber}\n\n` +
        `Thank you for choosing VK Creation!`
    );

    return `https://wa.me/${phone}?text=${text}`;
  }
}