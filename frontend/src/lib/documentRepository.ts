import { StudioInvoice, PaymentReceipt, LegalAgreement } from '@/types/document';
import { getStoredBookings } from '@/lib/storage';

export class DocumentRepository {
  static defaultBankDetails = {
    bankName: 'HDFC Bank Ltd',
    accountName: 'VK Creation Studio OPC Pvt Ltd',
    accountNumber: '50200088991234',
    ifscCode: 'HDFC0001234',
    upiId: 'vkcreation@hdfcbank',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=vkcreation@hdfcbank&pn=VK%20Creation%20Studio',
  };

  static defaultTerms = [
    'A non-refundable advance of 30% is required to lock dates.',
    'Balance 50% payment is due 7 days prior to the primary wedding event.',
    'Final 20% balance is payable upon photobook album review and before high-res video drive hand-over.',
    'Raw photos and video footage copyright remains with VK Creation; client gets full personal usage rights.',
    'Outstation travel, stay, and local transport for team shall be arranged or reimbursed by the client.',
  ];

  static getInvoice(invoiceNumber: string): StudioInvoice {
    const bookings = getStoredBookings();
    const rawBooking = bookings.find((b: any) => b.bookingNumber === invoiceNumber || b.invoiceNumber === invoiceNumber) || bookings[0];
    const booking = rawBooking as any;

    const subtotal = booking?.totalAmount || booking?.grandTotal || 180000;
    const gstRate = 18;
    const gstAmount = Math.round((subtotal * gstRate) / 100);
    const discountAmount = 0;
    const grandTotal = subtotal + gstAmount - discountAmount;
    const advancePaid = booking?.advancePaid || booking?.paidAmount || 50000;
    const remainingBalance = grandTotal - advancePaid;

    return {
      invoiceNumber: invoiceNumber || 'VK-INV-2026-001',
      bookingNumber: booking?.bookingNumber || 'VKCREATION-2026-001',
      clientName: booking?.customerName || booking?.clientName || booking?.name || 'Ananya & Kabir',
      clientPhone: booking?.customerPhone || booking?.clientPhone || booking?.phone || '+91 98765 43210',
      clientEmail: booking?.customerEmail || booking?.clientEmail || 'ananya.kabir@gmail.com',
      clientAddress: booking?.venue || 'Marriott Hotel & Suites, Indore, MP',
      issueDate: '2026-07-20',
      dueDate: '2026-08-05',
      items: [
        {
          id: 'item-1',
          description: booking?.selectedPackageName || booking?.packageName || 'Gold Luxury Wedding Media Coverage Tier',
          quantity: 1,
          rate: subtotal,
          amount: subtotal,
        },
      ],
      subtotal,
      gstRate,
      gstAmount,
      discountAmount,
      grandTotal,
      advancePaid,
      remainingBalance,
      status: remainingBalance <= 0 ? 'Paid' : advancePaid > 0 ? 'Partially Paid' : 'Sent',
      bankDetails: this.defaultBankDetails,
      notes: 'Thank you for choosing VK Creation. Please clear remaining dues before final delivery.',
    };
  }

  static getReceipt(receiptNumber: string): PaymentReceipt {
    return {
      receiptNumber: receiptNumber || 'VK-REC-2026-001',
      bookingNumber: 'VKCREATION-2026-001',
      invoiceNumber: 'VK-INV-2026-001',
      clientName: 'Ananya & Kabir',
      paymentType: 'Advance Payment',
      amountPaid: 50000,
      paymentDate: '2026-07-15',
      paymentMode: 'UPI',
      transactionRef: 'UPI/2026/9871236540',
      remainingBalanceAfter: 162400,
      issuedBy: 'VK Studio Accounts Admin',
    };
  }

  static getAgreement(agreementNumber: string): LegalAgreement {
    return {
      agreementNumber: agreementNumber || 'VK-AGR-2026-001',
      bookingNumber: 'VKCREATION-2026-001',
      clientName: 'Ananya & Kabir',
      clientPhone: '+91 98765 43210',
      clientEmail: 'ananya.kabir@gmail.com',
      eventDate: '2026-11-20',
      venueLocation: 'Sayaji Hotel & Resorts, Indore',
      packageName: 'Gold Luxury Wedding Tier',
      totalAgreedAmount: 212400,
      advanceAmountPaid: 50000,
      termsAndConditions: this.defaultTerms,
      studioPolicies: [
        'Meal and refreshment breaks for crew during events lasting over 6 hours.',
        'Final deliverable delivery timeline: 3-4 weeks post selection completion.',
      ],
      studioSignature: 'VK Creation Authorized Signatory',
      status: 'Fully Executed',
    };
  }

  static triggerBrowserPrint(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}