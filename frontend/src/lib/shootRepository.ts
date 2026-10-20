import { ShootScheduleEvent, ShotChecklistItem } from '@/types/shoot';
import { getStoredBookings } from '@/lib/storage';

const DEFAULT_SHOT_CHECKLIST: ShotChecklistItem[] = [
  { id: 'chk-1', title: 'Bride & Groom Getting Ready Shots', category: 'Candid', isCompleted: false },
  { id: 'chk-2', title: 'Jewelry & Outfit Flat-lay Details', category: 'Traditional', isCompleted: false },
  { id: 'chk-3', title: 'Groom Baraat Procession & Entry', category: 'Candid', isCompleted: false },
  { id: 'chk-4', title: 'Bride Grand Entry with Phoolon ki Chhadar', category: 'Cinematic Film', isCompleted: false },
  { id: 'chk-5', title: 'Varmala Exchange 4K Drone Aerial Shot', category: 'Drone', isCompleted: false },
  { id: 'chk-6', title: 'Pheras & Mandap Ritual Closeups', category: 'Traditional', isCompleted: false },
  { id: 'chk-7', title: 'Family & Guest Stage Portraits', category: 'Family Group', isCompleted: false },
  { id: 'chk-8', title: 'Post-Event Couple Golden Hour Portraits', category: 'Candid', isCompleted: false },
];

const DEFAULT_SHOOTS: ShootScheduleEvent[] = [
  {
    id: 'sht-2026-001',
    bookingNumber: 'VKCREATION-2026-001',
    clientName: 'Rahul & Sneha Sharma',
    clientPhone: '+91 9876543210',
    eventCategory: 'Wedding',
    eventDate: new Date().toISOString().split('T')[0], // Today's Date
    callTime: '08:00 AM',
    startTime: '09:30 AM',
    venue: 'Sayaji Hotel Grand Ballroom',
    city: 'Indore',
    leadPhotographer: 'Aman Sharma',
    status: 'Team On-Site',
    checklist: DEFAULT_SHOT_CHECKLIST,
    crew: [
      { id: 'c1', name: 'Aman Sharma', role: 'Lead Photographer', phone: '+91 9876543210' },
      { id: 'c2', name: 'Vikram Singh', role: 'Candid Master', phone: '+91 9876500001' },
      { id: 'c3', name: 'Rohan Mehta', role: 'Drone Operator', phone: '+91 9876500002' },
    ],
    specialInstructions: 'Client requested extra emphasis on candid emotional moments during Varmala.',
  },
  {
    id: 'sht-2026-002',
    bookingNumber: 'VKCREATION-2026-002',
    clientName: 'Priya & Ankit',
    clientPhone: '+91 9123456789',
    eventCategory: 'Haldi',
    eventDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days later
    callTime: '10:00 AM',
    startTime: '11:00 AM',
    venue: 'Palasia Garden Lawn',
    city: 'Indore',
    leadPhotographer: 'Rahul Verma',
    status: 'Scheduled',
    checklist: DEFAULT_SHOT_CHECKLIST,
    crew: [
      { id: 'c4', name: 'Rahul Verma', role: 'Lead Photographer', phone: '+91 9876500003' },
      { id: 'c5', name: 'Suresh Kumar', role: 'Traditional Videographer', phone: '+91 9876500004' },
    ],
    specialInstructions: 'Slow-motion yellow flower shower shots needed during Haldi splash.',
  },
];

export class ShootRepository {
  static getAll(): ShootScheduleEvent[] {
    if (typeof window === 'undefined') return DEFAULT_SHOOTS;
    const saved = localStorage.getItem('vk_studio_shoots');
    if (!saved) {
      localStorage.setItem('vk_studio_shoots', JSON.stringify(DEFAULT_SHOOTS));
      return DEFAULT_SHOOTS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_SHOOTS;
    }
  }

  static getById(id: string): ShootScheduleEvent | null {
    const shoots = this.getAll();
    return shoots.find((s) => s.id === id || s.bookingNumber === id) || null;
  }

  static save(shoot: ShootScheduleEvent): void {
    if (typeof window === 'undefined') return;
    const shoots = this.getAll();
    const index = shoots.findIndex((s) => s.id === shoot.id);
    if (index >= 0) {
      shoots[index] = shoot;
    } else {
      shoots.unshift(shoot);
    }
    localStorage.setItem('vk_studio_shoots', JSON.stringify(shoots));
  }

  static toggleChecklistItem(shootId: string, itemId: string): ShootScheduleEvent | null {
    const shoot = this.getById(shootId);
    if (!shoot) return null;

    const updatedChecklist = shoot.checklist.map((item) =>
      item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
    );

    const updatedShoot = { ...shoot, checklist: updatedChecklist };
    this.save(updatedShoot);
    return updatedShoot;
  }

  static updateStatus(shootId: string, status: ShootScheduleEvent['status']): ShootScheduleEvent | null {
    const shoot = this.getById(shootId);
    if (!shoot) return null;

    const updatedShoot = { ...shoot, status };
    this.save(updatedShoot);
    return updatedShoot;
  }
}