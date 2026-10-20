export type PaymentStatus =
  | 'pending'
  | 'partially_paid'
  | 'advance_paid'
  | 'paid'
  | 'overdue'
  | 'refunded'
  | 'Unpaid'
  | 'Paid'
  | 'Partial';

export type PaymentMethod =
  | 'UPI'
  | 'Cash'
  | 'Bank Transfer'
  | 'Cheque'
  | 'Card'
  | 'upi'
  | 'cash'
  | 'bank_transfer'
  | 'card'
  | 'other';

// Supports both exact 9-Stage Business Lifecycle & legacy string variants
export type BookingLifecycleStage =
  | 'Inquiry'
  | 'Quotation Sent'
  | 'Confirmed'
  | 'Advance Received'
  | 'Shoot Scheduled'
  | 'Editing'
  | 'Ready for Delivery'
  | 'Delivered'
  | 'Closed'
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'shoot_scheduled'
  | 'editing'
  | 'completed'
  | 'cancelled'
  | 'ready'
  | 'delivered'
  | 'closed';

export type BookingStatus = BookingLifecycleStage;

export interface MilestoneTask {
  id: string;
  label: string;
  completed: boolean;
  dueDate?: string;
}

export interface PaymentRecord {
  id: string;
  receiptNumber?: string;
  bookingNumber?: string;
  customerName?: string;
  amount: number;
  date: string;
  method: PaymentMethod | string;
  referenceNo?: string;
  notes?: string;
  note?: string;
  receivedBy?: string;
  paymentMethod?: PaymentMethod | string;
  transactionRef?: string;
  transactionId?: string;
}

export interface DeliveryProgress {
  rawPhotosDelivered?: boolean;
  editedPhotosDelivered?: boolean;
  videoTeaserDelivered?: boolean;
  fullVideoDelivered?: boolean;
  albumPrinted?: boolean;
  photosDelivered?: boolean;
  videosDelivered?: boolean;
  albumDelivered?: boolean;
  [key: string]: boolean | undefined;
}

export interface DetailedBooking {
  id?: string;
  bookingNumber: string;
  customerName: string;
  phone?: string;
  customerPhone?: string;
  email?: string;
  customerEmail?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  quoteId?: string;
  quoteNumber?: string;
  eventType: string;
  eventDate: string;
  eventLocation?: string;
  venue?: string;
  city?: string;
  event?: {
    eventType?: string;
    startDate?: string;
    location?: string;
    eventDate?: string;
    city?: string;
  };
  stage?: BookingLifecycleStage;
  status: BookingLifecycleStage;
  bookingStatus?: BookingLifecycleStage;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  grandTotal?: number;
  advancePaid?: number;
  paidAmount?: number;
  remainingAmount?: number;
  services?: any[];
  paymentHistory?: PaymentRecord[];
  assignedTeam?: string[];
  milestones?: MilestoneTask[];
  createdAt: string;
  deliveryProgress?: DeliveryProgress;
}

export type Booking = DetailedBooking;