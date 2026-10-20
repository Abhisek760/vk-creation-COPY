export type ShootStatus = 'Scheduled' | 'Team On-Site' | 'Shooting Live' | 'Completed' | 'Post-Production';

export type EventCategory = 'Sangeet' | 'Haldi' | 'Wedding' | 'Reception' | 'Pre-Wedding' | 'Engagement' | 'Corporate';

export interface ShotChecklistItem {
  id: string;
  title: string;
  category: 'Candid' | 'Traditional' | 'Drone' | 'Cinematic Film' | 'Family Group';
  isCompleted: boolean;
}

export interface ShootCrewMember {
  id: string;
  name: string;
  role: 'Lead Photographer' | 'Candid Master' | 'Traditional Videographer' | 'Drone Operator' | 'Assistant';
  phone: string;
}

export interface ShootScheduleEvent {
  id: string;
  bookingNumber: string;
  clientName: string;
  clientPhone: string;
  eventCategory: EventCategory;
  eventDate: string; // YYYY-MM-DD
  callTime: string;  // e.g. "09:00 AM"
  startTime: string; // e.g. "10:30 AM"
  venue: string;
  city: string;
  leadPhotographer: string;
  status: ShootStatus;
  checklist: ShotChecklistItem[];
  crew: ShootCrewMember[];
  specialInstructions?: string;
}