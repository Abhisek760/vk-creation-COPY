import { PaymentLedger, PaymentTransaction, StudioBankDetails, PaymentSummaryKPIs } from '@/types/payment';
import { getStoredBookings, saveBookingToStorage } from '@/lib/storage';

const DEFAULT_BANK_DETAILS: StudioBankDetails = {
  upiId: 'vkcreation@okaxis',
  accountName: 'VK Creation Photography LLP',
  accountNumber: '921020038192831',
  bankName: 'HDFC Bank',
  ifscCode: 'HDFC0000241',
  branch: 'Vijay Nagar, Indore',
};

export class PaymentRepository {
  static getBankDetails(): StudioBankDetails {
    if (typeof window === 'undefined') return DEFAULT_BANK_DETAILS;
    const saved = localStorage.getItem('vk_bank_details');
    if (!saved) {
      localStorage.setItem('vk_bank_details', JSON.stringify(DEFAULT_BANK_DETAILS));
      return DEFAULT_BANK_DETAILS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_BANK_DETAILS;
    }
  }

  static saveBankDetails(details: StudioBankDetails): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('vk_bank_details', JSON.stringify(details));
  }

  static getAllLedgers(): PaymentLedger[] {
    const bookings = getStoredBookings();
    const today = new Date().toISOString().split('T')[0];

    return bookings.map((b: any) => {
      const total = b.totalAmount || b.grandTotal || 0;
      const transactions: PaymentTransaction[] = (b.paymentHistory || []).map((p: any, idx: number) => ({
        id: p.id || `tx-${b.bookingNumber}-${idx}`,
        receiptNumber: p.receiptNumber || `REC-${b.bookingNumber}-${idx + 1}`,
        bookingNumber: b.bookingNumber,
        customerName: b.customerName,
        amount: Number(p.amount || 0),
        paymentDate: p.date || p.paymentDate || today,
        paymentMethod: (p.method || p.paymentMethod || 'UPI') as any,
        trancheType: idx === 0 ? 'Booking Advance' : 'Event Day Payment',
        transactionRef: p.referenceNo || p.transactionRef || '',
        notes: p.notes || p.note || 'Payment entry',
        createdAt: p.createdAt || new Date().toISOString(),
      }));

      const paid = transactions.reduce((sum, tx) => sum + tx.amount, 0) || (b.advancePaid || 0);
      const remaining = Math.max(0, total - paid);
      const dueDate = b.eventDate || today;

      let status: PaymentLedger['status'] = 'Unpaid';
      if (paid >= total && total > 0) {
        status = 'Paid';
      } else if (paid > 0 && remaining > 0) {
        status = dueDate < today ? 'Overdue' : 'Partially Paid';
      } else if (dueDate < today && remaining > 0) {
        status = 'Overdue';
      }

      return {
        bookingNumber: b.bookingNumber,
        customerName: b.customerName,
        customerPhone: b.phone || b.customerPhone || '+91 9876543210',
        customerEmail: b.email || b.customerEmail || '',
        eventType: b.eventType || 'Wedding Event',
        eventDate: b.eventDate || today,
        totalContractAmount: total,
        advancePaid: b.advancePaid || (transactions[0]?.amount || 0),
        paidAmount: paid,
        remainingBalance: remaining,
        dueDate,
        status,
        transactions,
        lastReminderSentAt: b.lastReminderSentAt,
      };
    });
  }

  static getLedgerByBookingNumber(bookingNumber: string): PaymentLedger | null {
    const ledgers = this.getAllLedgers();
    return ledgers.find((l) => l.bookingNumber === bookingNumber) || null;
  }

static recordPaymentTransaction(
    bookingNumber: string,
    transaction: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'createdAt'>
  ): PaymentLedger | null {
    const bookings = getStoredBookings();
    const index = bookings.findIndex((b: any) => b.bookingNumber === bookingNumber || b.id === bookingNumber);

    if (index === -1) return null;

    const booking = bookings[index];
    const existingHistory = booking.paymentHistory || [];

    const newTxNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Legacy PaymentRecord mapping format
    const paymentRecord = {
      id: `tx-${Date.now()}`,
      receiptNumber: newTxNumber,
      amount: transaction.amount,
      date: transaction.paymentDate,
      method: transaction.paymentMethod,
      referenceNo: transaction.transactionRef || '',
      notes: transaction.notes || '',
      createdAt: new Date().toISOString(),
    };

    const updatedHistory = [...existingHistory, paymentRecord];
    const updatedPaid = updatedHistory.reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);

    const calcStatus: 'paid' | 'partially_paid' | 'unpaid' =
      updatedPaid >= (booking.totalAmount || 0) ? 'paid' : 'partially_paid';

    const updatedBooking = {
      ...booking,
      paidAmount: updatedPaid,
      advancePaid: booking.advancePaid || paymentRecord.amount,
      paymentHistory: updatedHistory,
      paymentStatus: calcStatus,
    };

    bookings[index] = updatedBooking as any;
    localStorage.setItem('vk_bookings', JSON.stringify(bookings));

    return this.getLedgerByBookingNumber(bookingNumber);
  }

  static getKPIs(): PaymentSummaryKPIs {
    const ledgers = this.getAllLedgers();
    return ledgers.reduce(
      (acc, l) => {
        acc.totalCollected += l.paidAmount;
        acc.totalOutstanding += l.remainingBalance;
        if (l.status === 'Overdue') {
          acc.totalOverdue += l.remainingBalance;
        }
        acc.activeBookingsCount += 1;
        return acc;
      },
      { totalCollected: 0, totalOutstanding: 0, totalOverdue: 0, activeBookingsCount: 0 }
    );
  }

  static generateWhatsAppReminderLink(ledger: PaymentLedger): string {
    const bank = this.getBankDetails();
    const cleanPhone = ledger.customerPhone.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const text = encodeURIComponent(
      `Hello ${ledger.customerName}! ✨\n\n` +
        `This is a friendly payment reminder from *VK Creation Studio* regarding your upcoming shoot coverage.\n\n` +
        `📋 *Booking Ref:* ${ledger.bookingNumber}\n` +
        `📅 *Event Date:* ${ledger.eventDate}\n` +
        `💰 *Total Contract Value:* ₹${ledger.totalContractAmount.toLocaleString('en-IN')}\n` +
        `✅ *Amount Paid:* ₹${ledger.paidAmount.toLocaleString('en-IN')}\n` +
        `⏳ *Pending Due Amount:* ₹${ledger.remainingBalance.toLocaleString('en-IN')}\n` +
        `🗓 *Payment Due Date:* ${ledger.dueDate}\n\n` +
        `--- *Payment Details* ---\n` +
        `🔹 *UPI ID:* ${bank.upiId}\n` +
        `🔹 *Bank Name:* ${bank.bankName}\n` +
        `🔹 *Account Name:* ${bank.accountName}\n` +
        `🔹 *Account No:* ${bank.accountNumber}\n` +
        `🔹 *IFSC Code:* ${bank.ifscCode}\n\n` +
        `Please share a screenshot after completing the payment so we can update your official ledger receipt.`
    );

    return `https://wa.me/${phone}?text=${text}`;
  }
}