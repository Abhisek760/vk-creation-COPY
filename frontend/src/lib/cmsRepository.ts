import { WebsiteCMSConfig } from '@/types/cms';

const DEFAULT_CMS_CONFIG: WebsiteCMSConfig = {
  hero: {
    title: 'Timeless Luxury Wedding Cinematography & Photography',
    subtitle: 'Capturing royal wedding celebrations, emotional candid moments, and 4K cinema films across India.',
    heroImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
    ctaButtonText: 'Build Custom Wedding Quote →',
  },
  portfolioShowcase: [
    {
      id: 'p-1',
      title: 'The Royal Sayaji Palace Wedding',
      category: 'Grand Wedding',
      imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'p-2',
      title: 'Sunset Beachside Pre-Wedding',
      category: 'Pre-Wedding',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'p-3',
      title: 'Traditional Sangeet Night',
      category: 'Sangeet',
      imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    },
  ],
  testimonials: [
    {
      id: 't-1',
      coupleName: 'Rahul & Sneha Sharma',
      venue: 'Sayaji Hotel, Indore',
      quote: 'VK Creation captured our wedding with such elegance! The 4K cinematic film brings tears of joy every single time.',
      rating: 5,
    },
    {
      id: 't-2',
      coupleName: 'Priya & Ankit',
      venue: 'Palasia Lawn, Indore',
      quote: 'The team was super professional, non-intrusive during candid rituals, and delivered our photobooks well ahead of time!',
      rating: 5,
    },
  ],
  faqs: [
    {
      id: 'f-1',
      question: 'How early should we book VK Creation for our wedding dates?',
      answer: 'We recommend locking your wedding dates 3 to 6 months in advance, especially for winter peak wedding dates.',
    },
    {
      id: 'f-2',
      question: 'Do you provide outstation and destination wedding coverage?',
      answer: 'Yes! Our senior teams travel across India and internationally for destination weddings.',
    },
  ],
  contactAndFooter: {
    studioAddress: 'Vijay Nagar, Indore, Madhya Pradesh - 452010',
    phonePrimary: '+91 9876543210',
    emailPrimary: 'contact@vkcreation.com',
    instagramUrl: 'https://instagram.com/vkcreationstudio',
    youtubeUrl: 'https://youtube.com/@vkcreationstudio',
    gstinNumber: '23AAAAA0000A1Z5',
  },
};

export class CMSRepository {
  static getCMS(): WebsiteCMSConfig {
    if (typeof window === 'undefined') return DEFAULT_CMS_CONFIG;
    const saved = localStorage.getItem('vk_studio_cms');
    if (!saved) {
      localStorage.setItem('vk_studio_cms', JSON.stringify(DEFAULT_CMS_CONFIG));
      return DEFAULT_CMS_CONFIG;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_CMS_CONFIG;
    }
  }

  static saveCMS(config: WebsiteCMSConfig): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('vk_studio_cms', JSON.stringify(config));
  }
}