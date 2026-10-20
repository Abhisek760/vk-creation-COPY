'use client';

import { FormValidator } from '@/lib/validators';

export class StorageRepository {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  static getItem<T>(key: string, fallback: T): T {
    if (!this.isBrowser()) return fallback;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (error) {
      console.error(`[StorageRepository] Error reading key "${key}":`, error);
      return fallback;
    }
  }

  static setItem<T>(key: string, value: T): boolean {
    if (!this.isBrowser()) return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[StorageRepository] Error writing key "${key}":`, error);
      return false;
    }
  }

  // Quotation Management
  static getQuotes(): any[] {
    return this.getItem('vk_quotes', []);
  }

  static saveQuote(quoteData: any): void {
    const quotes = this.getQuotes();
    const updated = [quoteData, ...quotes.filter((q: any) => q.id !== quoteData.id)];
    this.setItem('vk_quotes', updated);
    this.setItem('vk_current_proposal', quoteData);
  }

  // Booking Management
  static getBookings(): any[] {
    return this.getItem('vk_bookings', []);
  }

  static getBookingByNumber(bookingNumber: string): any | null {
    if (!bookingNumber) return null;
    const bookings = this.getBookings();
    return bookings.find((b: any) => b.bookingNumber === bookingNumber) || null;
  }

  static saveBooking(bookingData: any): void {
    const bookings = this.getBookings();
    const updated = [bookingData, ...bookings.filter((b: any) => b.bookingNumber !== bookingData.bookingNumber)];
    this.setItem('vk_bookings', updated);
  }

  // Payment Tracking with Validation against Overpayment
  static getPayments(): any[] {
    return this.getItem('vk_payments', []);
  }

  static recordPayment(paymentData: {
    bookingNumber: string;
    amount: number;
    paymentMode: string;
    transactionRef: string;
  }): { success: boolean; error?: string } {
    const amountCheck = FormValidator.validateAmount(paymentData.amount, 'Payment Amount');
    if (!amountCheck.isValid) {
      return { success: false, error: amountCheck.error };
    }

    const payments = this.getPayments();
    const newRecord = {
      ...paymentData,
      id: `PAY-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    this.setItem('vk_payments', [newRecord, ...payments]);
    return { success: true };
  }
}