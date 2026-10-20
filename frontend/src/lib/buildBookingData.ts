export function buildBookingData(quote: any): any {
  const now = new Date().toISOString();
  return {
    ...quote,
    bookingNumber: 'BK-' + Math.floor(1000 + Math.random() * 9000),
    quoteId: quote?.id || '',
    status: 'pending',
    paymentStatus: 'pending',
    paymentHistory: (quote?.paymentHistory || []).map((p: any) => ({
      ...p,
      date: p?.date || p?.paidAt || now,
    })),
    createdAt: now,
  };
}
