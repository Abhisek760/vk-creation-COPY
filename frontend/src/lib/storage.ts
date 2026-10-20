import { StudioService, StudioPackage, PackagePreset } from '@/types/service';
import { GalleryItem } from '@/types/gallery';
import { DetailedBooking } from '@/types/booking';
import { CustomerProfile } from '@/types/crm';

const DEFAULT_BOOKINGS: DetailedBooking[] = [
  {
    id: 'VKCREATION-2026-001',
    bookingNumber: 'VKCREATION-2026-001',
    customerName: 'Rahul & Sneha Sharma',
    phone: '+91 9876543210',
    email: 'rahul.s@gmail.com',
    eventType: 'Grand Wedding & Reception',
    eventDate: '2026-11-20',
    venue: 'Sayaji Hotel, Indore',
    city: 'Indore',
    totalAmount: 180000,
    advancePaid: 75000,
    status: 'Confirmed',
    paymentStatus: 'partially_paid',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Sayaji Palace Royal Wedding',
    category: 'Wedding',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
    uploadedAt: '2026-06-20',
    isFeatured: true,
  },
];

export const getStoredBookings = (): DetailedBooking[] => {
  if (typeof window === 'undefined') return DEFAULT_BOOKINGS;
  const saved = localStorage.getItem('vk_bookings');
  if (!saved) {
    localStorage.setItem('vk_bookings', JSON.stringify(DEFAULT_BOOKINGS));
    return DEFAULT_BOOKINGS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_BOOKINGS;
  }
};

export const saveBookingToStorage = (booking: DetailedBooking): void => {
  if (typeof window === 'undefined') return;
  const bookings = getStoredBookings();
  const index = bookings.findIndex((b) => b.id === booking.id || b.bookingNumber === booking.bookingNumber);
  if (index >= 0) {
    bookings[index] = booking;
  } else {
    bookings.unshift(booking);
  }
  localStorage.setItem('vk_bookings', JSON.stringify(bookings));
};

export const getStoredCustomers = (): CustomerProfile[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('vk_customers');
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

export const saveCustomerToStorage = (customer: CustomerProfile) => {
  if (typeof window === 'undefined') return;
  const customers = getStoredCustomers();
  const index = customers.findIndex((c) => c.id === customer.id || c.phone === customer.phone);
  let updated: CustomerProfile[];
  if (index >= 0) {
    updated = [...customers];
    updated[index] = { ...updated[index], ...customer };
  } else {
    updated = [customer, ...customers];
  }
  localStorage.setItem('vk_customers', JSON.stringify(updated));
};

export const getStoredPackages = (): PackagePreset[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('vk_studio_packages');
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return parsed.map((p: any) => ({
      ...p,
      name: p.name || p.title || 'Studio Package',
      deliverables: p.deliverables || p.features || [],
      termsSummary: p.termsSummary || p.tagline || '',
    }));
  } catch {
    return [];
  }
};

export const savePackageToStorage = (pkg: PackagePreset | StudioPackage) => {
  if (typeof window === 'undefined') return;
  const packages = getStoredPackages();
  const index = packages.findIndex((p) => p.id === pkg.id);
  const normalized: PackagePreset = {
    ...pkg,
    title: pkg.title || (pkg as any).name || 'Studio Package',
    name: (pkg as any).name || pkg.title || 'Studio Package',
    tagline: pkg.tagline || (pkg as any).termsSummary || '',
    features: pkg.features || (pkg as any).deliverables || [],
    deliverables: (pkg as any).deliverables || pkg.features || [],
    includedServices: pkg.includedServices || [],
  };

  let updated: PackagePreset[];
  if (index >= 0) {
    updated = [...packages];
    updated[index] = normalized;
  } else {
    updated = [normalized, ...packages];
  }
  localStorage.setItem('vk_studio_packages', JSON.stringify(updated));
};

export const getStoredGallery = (): GalleryItem[] => {
  if (typeof window === 'undefined') return DEFAULT_GALLERY;
  const saved = localStorage.getItem('vk_gallery');
  if (!saved) {
    localStorage.setItem('vk_gallery', JSON.stringify(DEFAULT_GALLERY));
    return DEFAULT_GALLERY;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_GALLERY;
  }
};

export const saveGalleryItemToStorage = (item: GalleryItem) => {
  if (typeof window === 'undefined') return;
  const items = getStoredGallery();
  const index = items.findIndex((i) => i.id === item.id);
  let updated: GalleryItem[];
  if (index >= 0) {
    updated = [...items];
    updated[index] = item;
  } else {
    updated = [item, ...items];
  }
  localStorage.setItem('vk_gallery', JSON.stringify(updated));
};

export const getStoredQuotes = (): any[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('vk_quotes');
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

export const syncCustomerFromBooking = (booking: DetailedBooking) => {
  const customers = getStoredCustomers();
  const phone = booking.phone || (booking as any).customerPhone || '';
  const name = booking.customerName || (booking as any).clientName || 'Client';
  if (!phone) return;

  const existingIndex = customers.findIndex((c) => c.phone === phone);
  const amount = booking.totalAmount || (booking as any).grandTotal || 0;

  if (existingIndex >= 0) {
    const existing = customers[existingIndex];
    const updated: CustomerProfile = {
      ...existing,
      name: name || existing.name,
      totalRevenue: (existing.totalRevenue || 0) + amount,
    };
    saveCustomerToStorage(updated);
  } else {
    const newCustomer: CustomerProfile = {
      id: `cust-${Date.now()}`,
      name,
      phone,
      email: booking.email || '',
      city: booking.city || 'Indore',
      address: booking.venue || '',
      notes: '',
      leadSource: 'Website',
      status: 'Booked',
      totalRevenue: amount,
      totalBookings: 1,
      pendingAmount: 0,
      interactions: [],
      createdAt: new Date().toISOString(),
    };
    saveCustomerToStorage(newCustomer);
  }
};