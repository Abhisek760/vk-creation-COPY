import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface CustomServiceItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface PackageItem {
  id: string;
  title: string;
  price: number;
  description: string;
  serviceIds: string[];
}

const DEFAULT_SERVICES: CustomServiceItem[] = [
  { id: 's1', name: 'Traditional Photography (Full Day)', price: 15000, category: 'Photography' },
  { id: 's2', name: 'Candid Photography (Full Day)', price: 25000, category: 'Photography' },
  { id: 's3', name: 'Traditional Cinematography / Video', price: 20000, category: 'Videography' },
  { id: 's4', name: 'Cinematic Teaser & Highlight Film', price: 35000, category: 'Videography' },
  { id: 's5', name: 'Drone Aerial Shoot', price: 10000, category: 'Special' },
  { id: 's6', name: 'Premium Photobook Album (40 Pages)', price: 12000, category: 'Album' },
];

const DEFAULT_PACKAGES: PackageItem[] = [
  {
    id: 'pkg-silver',
    title: 'Silver Wedding Package',
    price: 35000,
    description: 'Traditional Photography + Traditional Videography',
    serviceIds: ['s1', 's3'],
  },
  {
    id: 'pkg-gold',
    title: 'Gold Cinematic Package',
    price: 70000,
    description: 'Candid Photography + Cinematic Teaser/Highlight + Photobook Album',
    serviceIds: ['s2', 's4', 's6'],
  },
  {
    id: 'pkg-platinum',
    title: 'Platinum Grand Royal Package',
    price: 110000,
    description: 'Complete Photography, Cinematography, Drone & Photobook Coverage',
    serviceIds: ['s1', 's2', 's3', 's4', 's5', 's6'],
  },
];

export const CatalogRepository = {
  getServices: async (): Promise<CustomServiceItem[]> => {
    try {
      const docRef = doc(db, 'settings', 'catalog_services');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const list = docSnap.data().list;
        if (typeof window !== 'undefined') {
          localStorage.setItem('vk_master_services', JSON.stringify(list));
        }
        return list;
      }
    } catch (e) {
      console.error('Firestore Services Sync Error:', e);
    }

    if (typeof window === 'undefined') return DEFAULT_SERVICES;
    try {
      const stored = localStorage.getItem('vk_master_services');
      return stored ? JSON.parse(stored) : DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  },

  saveServices: async (services: CustomServiceItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vk_master_services', JSON.stringify(services));
    }
    try {
      await setDoc(doc(db, 'settings', 'catalog_services'), {
        list: services,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Firestore Save Services Error:', e);
    }
  },

  getPackages: async (): Promise<PackageItem[]> => {
    try {
      const docRef = doc(db, 'settings', 'catalog_packages');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const list = docSnap.data().list;
        if (typeof window !== 'undefined') {
          localStorage.setItem('vk_master_packages', JSON.stringify(list));
        }
        return list;
      }
    } catch (e) {
      console.error('Firestore Packages Sync Error:', e);
    }

    if (typeof window === 'undefined') return DEFAULT_PACKAGES;
    try {
      const stored = localStorage.getItem('vk_master_packages');
      return stored ? JSON.parse(stored) : DEFAULT_PACKAGES;
    } catch {
      return DEFAULT_PACKAGES;
    }
  },

  savePackages: async (packages: PackageItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vk_master_packages', JSON.stringify(packages));
    }
    try {
      await setDoc(doc(db, 'settings', 'catalog_packages'), {
        list: packages,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Firestore Save Packages Error:', e);
    }
  }
};

export const StudioBrandingRepository = {
  getSealImage: async (): Promise<string | null> => {
    try {
      const docRef = doc(db, 'settings', 'studio_seal');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const url = docSnap.data().url;
        if (typeof window !== 'undefined' && url) {
          localStorage.setItem('vk_studio_seal_image', url);
        }
        return url;
      }
    } catch (e) {
      console.error('Firestore Seal Sync Error:', e);
    }

    if (typeof window === 'undefined') return null;
    return localStorage.getItem('vk_studio_seal_image');
  },

  saveSealImage: async (base64Data: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vk_studio_seal_image', base64Data);
    }
    try {
      await setDoc(doc(db, 'settings', 'studio_seal'), {
        url: base64Data,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Firestore Save Seal Error:', e);
    }
  },

  removeSealImage: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vk_studio_seal_image');
    }
    try {
      await setDoc(doc(db, 'settings', 'studio_seal'), {
        url: null,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Firestore Remove Seal Error:', e);
    }
  },
};

export const DEFAULT_STUDIO_TERMS = [
  "1. Event Coverage & Timings: Shooting team hours will be as per agreed schedule. Extra hours beyond agreed timings will incur additional charges.",
  "2. Deliverables Timeline: Teaser video will be delivered within 10 days post-event. Final edited films and albums will be delivered within 21 to 30 days.",
  "3. Data Backup Policy: Raw footage and high-res photos will be safely backed up on studio servers for 30 days from the event completion date.",
  "4. Payment Terms & Schedule: Booking token advance is non-refundable. Remaining contract balance must be cleared prior to final album/film delivery.",
  "5. Copyright & Social Media Rights: VK Creation Studio retains official creative rights for portfolio showcase unless written privacy NDA is signed.",
  "6. Equipment & On-Site Safety: Outdoor shoots and drone flights are subject to weather conditions and local authority security clearances."
];

export const TermsRepository = {
  getTerms: async (): Promise<string[]> => {
    try {
      const docRef = doc(db, 'settings', 'terms_conditions');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const list = docSnap.data().list;
        if (typeof window !== 'undefined') {
          localStorage.setItem('vk_studio_terms', JSON.stringify(list));
        }
        return list;
      }
    } catch (e) {
      console.error('Firestore Terms Sync Error:', e);
    }

    if (typeof window === 'undefined') return DEFAULT_STUDIO_TERMS;
    try {
      const stored = localStorage.getItem('vk_studio_terms');
      return stored ? JSON.parse(stored) : DEFAULT_STUDIO_TERMS;
    } catch (e) {
      return DEFAULT_STUDIO_TERMS;
    }
  },

  saveTerms: async (terms: string[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vk_studio_terms', JSON.stringify(terms));
    }
    try {
      await setDoc(doc(db, 'settings', 'terms_conditions'), {
        list: terms,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Firestore Save Terms Error:', e);
    }
  },

  resetTerms: async () => {
    await TermsRepository.saveTerms(DEFAULT_STUDIO_TERMS);
  }
};

export const DEFAULT_GALLERY_PHOTOS = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800',
];

export const GalleryRepository = {
  getPhotos: (): string[] => {
    if (typeof window === 'undefined') return DEFAULT_GALLERY_PHOTOS;
    try {
      const stored = localStorage.getItem('vk_studio_gallery_photos');
      return stored ? JSON.parse(stored) : DEFAULT_GALLERY_PHOTOS;
    } catch (e) {
      return DEFAULT_GALLERY_PHOTOS;
    }
  },

  savePhotos: (photos: string[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vk_studio_gallery_photos', JSON.stringify(photos));
      } catch (e) {
        console.warn('LocalStorage limit reached. Switching to Cloud repository recommended.');
      }
    }
  },
};

export interface StreamItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  title: string;
}

const DEFAULT_NEW_STREAM: StreamItem[] = [
  {
    id: '1',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80',
    title: 'Royal Haldi'
  },
  {
    id: '2',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80',
    title: 'Sangeet Ceremony'
  }
];

const dbRequest = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VK_Studio_DB', 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('stream_store');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const NewStreamRepository = {
  getMediaAsync: async (): Promise<StreamItem[]> => {
    if (typeof window === 'undefined') return DEFAULT_NEW_STREAM;
    try {
      const db = await dbRequest();
      return new Promise((resolve) => {
        const tx = db.transaction('stream_store', 'readonly');
        const store = tx.objectStore('stream_store');
        const req = store.get('vk_new_memory_stream');
        req.onsuccess = () => resolve(req.result || DEFAULT_NEW_STREAM);
        req.onerror = () => resolve(DEFAULT_NEW_STREAM);
      });
    } catch {
      return DEFAULT_NEW_STREAM;
    }
  },

  saveMediaAsync: async (items: StreamItem[]) => {
    if (typeof window === 'undefined') return;
    try {
      const db = await dbRequest();
      const tx = db.transaction('stream_store', 'readwrite');
      const store = tx.objectStore('stream_store');
      store.put(items, 'vk_new_memory_stream');
    } catch (e) {
      console.error('Failed to save to IndexedDB:', e);
    }
  }
};