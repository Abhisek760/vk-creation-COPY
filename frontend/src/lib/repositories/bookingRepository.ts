import { Booking, BookingStatus, PaymentStatus, PaymentRecord, DeliveryProgress } from "@/types/booking";
import { getStorageItem, setStorageItem } from "../storage/localStorageProvider";

const BOOKINGS_STORAGE_KEY = "studio_bookings_v1";

export const bookingRepository = {
  getAll: (): Booking[] => {
    try {
      const data = getStorageItem<Booking[]>(BOOKINGS_STORAGE_KEY, []);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
  },

  getByBookingNumber: (bookingNumber: string): Booking | null => {
    const bookings = bookingRepository.getAll();
    return (
      bookings.find(
        (b) =>
          b.bookingNumber === bookingNumber ||
          b.id === bookingNumber
      ) || null
    );
  },

  save: (booking: Booking): Booking => {
    const bookings = bookingRepository.getAll();
    const existingIndex = bookings.findIndex(
      (b) => b.bookingNumber === booking.bookingNumber
    );

    const updatedBooking = {
      ...booking,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      bookings[existingIndex] = updatedBooking;
    } else {
      bookings.unshift(updatedBooking);
    }

    setStorageItem(BOOKINGS_STORAGE_KEY, bookings);
    return updatedBooking;
  },

  updateStatus: (bookingNumber: string, status: BookingStatus): Booking | null => {
    const booking = bookingRepository.getByBookingNumber(bookingNumber);
    if (!booking) return null;

    booking.status = status;
    booking.bookingStatus = status;
    return bookingRepository.save(booking);
  },

  updateBookingStatus: (bookingNumber: string, status: BookingStatus): Booking | null => {
    return bookingRepository.updateStatus(bookingNumber, status);
  },

  updatePaymentStatus: (
    bookingNumber: string,
    paymentStatus: PaymentStatus,
    amountPaid?: number
  ): Booking | null => {
    const booking = bookingRepository.getByBookingNumber(bookingNumber);
    if (!booking) return null;

    booking.paymentStatus = paymentStatus;
    if (typeof amountPaid === "number") {
      booking.paidAmount = amountPaid;
      booking.remainingAmount = Math.max(0, booking.totalAmount - amountPaid);
    }
    return bookingRepository.save(booking);
  },

  addPayment: (
    bookingNumber: string,
    payment: {
      amount: number;
      method: string;
      transactionId?: string;
      note?: string;
      notes?: string;
      receivedBy?: string;
    }
  ): Booking | null => {
    const booking = bookingRepository.getByBookingNumber(bookingNumber);
    if (!booking) return null;

    const newPayment: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      amount: payment.amount,
      date: new Date().toISOString(),
      method: payment.method as any,
      transactionId: payment.transactionId,
      notes: payment.note || payment.notes,
      note: payment.note || payment.notes,
      receivedBy: payment.receivedBy,
    };

    const paymentHistory = booking.paymentHistory || [];
    paymentHistory.push(newPayment);
    booking.paymentHistory = paymentHistory;

    const newPaidAmount = (booking.paidAmount || 0) + payment.amount;
    booking.paidAmount = newPaidAmount;
    booking.remainingAmount = Math.max(0, booking.totalAmount - newPaidAmount);

    if (booking.remainingAmount === 0) {
      booking.paymentStatus = "paid";
    } else if (newPaidAmount > 0) {
      booking.paymentStatus = "partially_paid";
    }

    return bookingRepository.save(booking);
  },

  updateDeliveryProgress: (
    bookingNumber: string,
    progress: DeliveryProgress
  ): Booking | null => {
    const booking = bookingRepository.getByBookingNumber(bookingNumber);
    if (!booking) return null;

    booking.deliveryProgress = {
      ...booking.deliveryProgress,
      ...progress,
    };

    return bookingRepository.save(booking);
  },
};

export const BookingRepository = bookingRepository;
export default bookingRepository;