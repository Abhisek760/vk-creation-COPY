export interface EventServiceItem {
  id?: string;
  serviceId?: string;
  serviceName: string;
  name?: string;
  category: 'Photography' | 'Videography' | 'Album' | 'Drone' | 'Other' | string;
  rate: number;
  price?: number;
  calculatedPrice?: number;
  quantity: number;
  notes?: string;
}

export interface EventDayConfig {
  id: string;
  eventName: string; // e.g., "Sangeet & Ring Ceremony", "Haldi", "Wedding Day"
  eventDate: string;
  venue?: string;
  services: EventServiceItem[];
}

export interface QuotationData {
  id: string;
  quoteNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city: string;
  events: EventDayConfig[];
  subtotal: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  grandTotal: number;
  validUntil: string;
  notes?: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Converted' | string;
  createdAt: string;
  updatedAt?: string;

  // Backwards-compatibility fields for legacy pages, pdf generator & repositories
  services?: EventServiceItem[];
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  event?: {
    eventType?: string;
    startDate?: string;
    location?: string;
    city?: string;
  };
  pricing?: {
    subtotal?: number;
    discount?: number;
    tax?: number;
    grandTotal?: number;
    advanceAmount?: number;
  };
  totals?: {
    subtotal?: number;
    discount?: number;
    tax?: number;
    grandTotal?: number;
  };
  eventDetails?: {
    eventType?: string;
    eventDate?: string;
    venue?: string;
    city?: string;
  };
  discount?: number;
  gstEnabled?: boolean;
  advancePaid?: number;
  quoteDate?: string;
  validTill?: string;
  deliverables?: any;
  agreement?: any;
}

// Type aliases for legacy imports in existing repositories & utilities
export type Quote = QuotationData;
export type QuoteData = QuotationData;