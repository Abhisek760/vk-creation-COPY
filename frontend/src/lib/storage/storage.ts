export const getStoredQuotes = () => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('vk_quotes');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveQuoteToStorage = (quote: any) => {
  if (typeof window === 'undefined') return;
  const existing = getStoredQuotes();
  const updated = [quote, ...existing.filter((q: any) => q.id !== quote.id)];
  localStorage.setItem('vk_quotes', JSON.stringify(updated));
};

export const getStoredBookings = () => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('vk_bookings');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveBookingToStorage = (booking: any) => {
  if (typeof window === 'undefined') return;
  const existing = getStoredBookings();
  const updated = [booking, ...existing.filter((b: any) => b.id !== booking.id)];
  localStorage.setItem('vk_bookings', JSON.stringify(updated));
};