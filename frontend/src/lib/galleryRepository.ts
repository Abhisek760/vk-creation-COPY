import { ClientGallery, GalleryPhoto } from '@/types/gallery';

const DEFAULT_PHOTOS: GalleryPhoto[] = [
  {
    id: 'ph-1',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    title: 'Bride Grand Entry',
    category: 'Wedding',
    isSelectedByClient: true,
  },
  {
    id: 'ph-2',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
    title: 'Varmala Exchange Moment',
    category: 'Wedding',
    isSelectedByClient: true,
  },
  {
    id: 'ph-3',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
    title: 'Sunset Sunset Portraits',
    category: 'Pre-Wedding',
    isSelectedByClient: false,
  },
  {
    id: 'ph-4',
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
    title: 'Sangeet Dance Sequence',
    category: 'Sangeet',
    isSelectedByClient: false,
  },
];

const DEFAULT_GALLERIES: ClientGallery[] = [
  {
    id: 'GAL-2026-001',
    galleryCode: 'GAL-2026-001',
    bookingNumber: 'VKCREATION-2026-001',
    clientName: 'Rahul & Sneha Sharma',
    clientPhone: '+91 9876543210',
    eventTitle: 'Grand Royal Wedding',
    eventDate: '2026-11-20',
    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    photos: DEFAULT_PHOTOS,
    downloadPin: '4321',
    isDownloadAllowed: true,
    maxSelectionLimit: 100,
    status: 'Published',
    createdAt: new Date().toISOString(),
  },
];

export class GalleryRepository {
  static getAll(): ClientGallery[] {
    if (typeof window === 'undefined') return DEFAULT_GALLERIES;
    const saved = localStorage.getItem('vk_studio_galleries');
    if (!saved) {
      localStorage.setItem('vk_studio_galleries', JSON.stringify(DEFAULT_GALLERIES));
      return DEFAULT_GALLERIES;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_GALLERIES;
    }
  }

  static getById(id: string): ClientGallery | null {
    const galleries = this.getAll();
    return galleries.find((g) => g.id === id || g.galleryCode === id || g.bookingNumber === id) || null;
  }

  static save(gallery: ClientGallery): void {
    if (typeof window === 'undefined') return;
    const galleries = this.getAll();
    const index = galleries.findIndex((g) => g.id === gallery.id || g.galleryCode === gallery.galleryCode);
    if (index >= 0) {
      galleries[index] = gallery;
    } else {
      galleries.unshift(gallery);
    }
    localStorage.setItem('vk_studio_galleries', JSON.stringify(galleries));
  }

  static togglePhotoSelection(galleryId: string, photoId: string): ClientGallery | null {
    const gallery = this.getById(galleryId);
    if (!gallery) return null;

    const updatedPhotos = gallery.photos.map((p) =>
      p.id === photoId ? { ...p, isSelectedByClient: !p.isSelectedByClient } : p
    );

    const updatedGallery = { ...gallery, photos: updatedPhotos };
    this.save(updatedGallery);
    return updatedGallery;
  }
}