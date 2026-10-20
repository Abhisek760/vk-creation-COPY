export interface ClientPortalData {
  bookingNumber: string;
  customerName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  venue: string;
  city: string;
  totalAmount: number;
  advancePaid: number;
  stage: string;
  galleryLink?: string;
  rawDriveLink?: string;
  milestones: {
    label: string;
    completed: boolean;
  }[];
}

export interface EmailDispatchPayload {
  toEmail: string;
  clientName: string;
  subject: string;
  type: 'Quotation' | 'Invoice' | 'BookingConfirmation' | 'GalleryReady';
  bodyText: string;
}