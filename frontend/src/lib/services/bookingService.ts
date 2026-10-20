import { buildBookingData } from '../buildBookingData';

export const bookingService = {
  createFromQuote(quote: any) {
    const advance = Number(quote?.advancePaid || 0);
    const booking = buildBookingData(quote);
    booking.advancePaid = advance;
    booking.paymentHistory = (booking.paymentHistory || []).map((p: any) => ({
      ...p,
      date: p.date || new Date().toISOString(),
    }));
    return booking;
  }
};
