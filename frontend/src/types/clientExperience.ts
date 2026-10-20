export interface GalleryMediaItem {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  category: 'Haldi' | 'Sangeet' | 'Wedding' | 'Reception' | 'Teaser';
  mediaType: 'photo' | 'video';
  isFavorite: boolean;
  watermarkedUrl?: string;
}

export interface ClientGalleryData {
  galleryId: string;
  bookingNumber: string;
  clientName: string;
  eventTitle: string;
  expiryDate: string;
  downloadPin: string;
  watermarkEnabled: boolean;
  mediaItems: GalleryMediaItem[];
}

export interface DeliveryPackage {
  id: string;
  bookingNumber: string;
  clientName: string;
  photosCount: number;
  teaserVideoUrl?: string;
  fullFilmUrl?: string;
  albumDriveUrl?: string;
  downloadPin: string;
  deliveryStatus: 'In Progress' | 'Client Review' | 'Approved' | 'Delivered';
  deliveredAt?: string;
}

export type CommunicationTrigger =
  | 'Quotation Sent'
  | 'Booking Confirmed'
  | 'Advance Payment Reminder'
  | 'Invoice Sent'
  | 'Receipt Sent'
  | 'Agreement Sent'
  | 'Shoot Reminder'
  | 'Editing Update'
  | 'Gallery Ready'
  | 'Final Delivery'
  | 'Thank You Message';

export interface WhatsAppTemplate {
  trigger: CommunicationTrigger;
  templateText: string;
}

export interface EmailLog {
  id: string;
  bookingNumber: string;
  clientEmail: string;
  subject: string;
  trigger: CommunicationTrigger;
  sentAt: string;
  status: 'Delivered' | 'Pending' | 'Failed';
}