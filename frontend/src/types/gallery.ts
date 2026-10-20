export interface GalleryPhoto {
  id: string;
  url: string;
  title?: string;
  category: string;
  isSelectedByClient: boolean;
}

export interface ClientGallery {
  id: string;
  galleryCode: string;
  bookingNumber: string;
  clientName: string;
  clientPhone: string;
  eventTitle: string;
  eventDate: string;
  coverImageUrl: string;
  photos: GalleryPhoto[];
  downloadPin?: string;
  password?: string;
  isDownloadAllowed: boolean;
  maxSelectionLimit: number;
  status: 'Draft' | 'Published' | 'Archived';
  createdAt: string;
}

export type GalleryCategory = 'Wedding' | 'Pre-Wedding' | 'Engagement' | 'Haldi' | 'Sangeet' | 'Teaser' | string;

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  clientName?: string;
  location?: string;
  eventDate?: string;
  uploadedAt?: string;
  featured?: boolean;
  isFeatured?: boolean;
}