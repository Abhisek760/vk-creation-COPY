import {
  ClientGalleryData,
  DeliveryPackage,
  WhatsAppTemplate,
  EmailLog,
  CommunicationTrigger,
} from '@/types/clientExperience';
import { DocumentRepository } from '@/lib/documentRepository';

export class ClientExperienceRepository {
  static getGalleryData(galleryId: string): ClientGalleryData {
    return {
      galleryId: galleryId || 'GAL-2026-001',
      bookingNumber: 'VKCREATION-2026-001',
      clientName: 'Ananya & Kabir',
      eventTitle: 'Royal Wedding Celebrations',
      expiryDate: '2026-12-31',
      downloadPin: '4321',
      watermarkEnabled: true,
      mediaItems: [
        {
          id: 'img-1',
          title: 'Royal Mandap Haldi Moment',
          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
          category: 'Haldi',
          mediaType: 'photo',
          isFavorite: true,
        },
        {
          id: 'img-2',
          title: 'Sangeet Choreography Special',
          url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80',
          category: 'Sangeet',
          mediaType: 'photo',
          isFavorite: false,
        },
        {
          id: 'img-3',
          title: 'Pheras & Varmala Highlight',
          url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80',
          category: 'Wedding',
          mediaType: 'photo',
          isFavorite: true,
        },
      ],
    };
  }

  static getDeliveryPackage(bookingNumber: string): DeliveryPackage {
    return {
      id: 'DEL-2026-001',
      bookingNumber: bookingNumber || 'VKCREATION-2026-001',
      clientName: 'Ananya & Kabir',
      photosCount: 850,
      teaserVideoUrl: 'https://vimeo.com/76543210',
      fullFilmUrl: 'https://vimeo.com/76543211',
      albumDriveUrl: 'https://drive.google.com/drive/folders/final_deliverables_ananya_kabir',
      downloadPin: '4321',
      deliveryStatus: 'Delivered',
      deliveredAt: '2026-07-20',
    };
  }

  static defaultWhatsAppTemplates: WhatsAppTemplate[] = [
    { trigger: 'Quotation Sent', templateText: 'Namaste {name}! Your customized wedding photography quotation from VK Creation Studio is ready: {link}' },
    { trigger: 'Booking Confirmed', templateText: 'Congratulations {name}! Your wedding dates on {date} are officially locked with VK Creation Studio. Booking Ref: {bookingRef}' },
    { trigger: 'Advance Payment Reminder', templateText: 'Dear {name}, a gentle reminder regarding the upcoming milestone payment for your wedding shoot. View details: {link}' },
    { trigger: 'Invoice Sent', templateText: 'Hello {name}, please find your official GST Tax Invoice from VK Creation Studio here: {link}' },
    { trigger: 'Receipt Sent', templateText: 'Dear {name}, we have received your payment. Here is your official payment receipt voucher: {link}' },
    { trigger: 'Agreement Sent', templateText: 'Hello {name}, your wedding media service agreement is ready for review and digital signature: {link}' },
    { trigger: 'Shoot Reminder', templateText: 'Reminder {name}! Our photography & cinematography crew will arrive at {venue} on {date} at {time}.' },
    { trigger: 'Editing Update', templateText: 'Exciting news {name}! Your wedding teaser video and photos are currently in Color Grading stage.' },
    { trigger: 'Gallery Ready', templateText: 'Hello {name}! Your high-resolution online wedding gallery is live. Access PIN: {pin} | Link: {link}' },
    { trigger: 'Final Delivery', templateText: 'Dear {name}, your master drive files and Canvera photobook album links are ready for download: {link}' },
    { trigger: 'Thank You Message', templateText: 'Thank you {name} for choosing VK Creation Studio! It was an honor capturing your special celebrations.' },
  ];

  static buildWhatsAppLink(phone: string, text: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodedText}`;
  }

  static getEmailLogs(): EmailLog[] {
    return [
      { id: 'LOG-1', bookingNumber: 'VKCREATION-2026-001', clientEmail: 'ananya.kabir@gmail.com', subject: 'Tax Invoice VK-INV-2026-001 from VK Creation Studio', trigger: 'Invoice Sent', sentAt: '2026-07-20 10:30 AM', status: 'Delivered' },
      { id: 'LOG-2', bookingNumber: 'VKCREATION-2026-001', clientEmail: 'ananya.kabir@gmail.com', subject: 'Payment Receipt Voucher VK-REC-2026-001', trigger: 'Receipt Sent', sentAt: '2026-07-15 04:15 PM', status: 'Delivered' },
      { id: 'LOG-3', bookingNumber: 'VKCREATION-2026-001', clientEmail: 'ananya.kabir@gmail.com', subject: 'Your High-Res Wedding Photo Gallery is Ready!', trigger: 'Gallery Ready', sentAt: '2026-07-22 06:00 PM', status: 'Delivered' },
    ];
  }
}