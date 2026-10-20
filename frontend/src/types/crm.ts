export type LeadSource = 'Instagram' | 'WhatsApp' | 'Website' | 'Referral' | 'Exhibition' | 'Direct Call';
export type CustomerStatus = 'Lead' | 'Inquiry' | 'Booked' | 'Completed' | 'Lost';

export interface CustomerInteraction {
  id: string;
  date: string;
  type: 'Note' | 'Call' | 'WhatsApp' | 'Email' | 'Meeting';
  summary: string;
  author: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  weddingDate?: string;
  anniversaryDate?: string;
  leadSource: LeadSource;
  status: CustomerStatus;
  notes: string;
  createdAt: string;
  totalBookings: number;
  totalRevenue: number;
  pendingAmount: number;
  interactions: CustomerInteraction[];
}