export type TeamRole = 
  | 'Admin'
  | 'Lead Photographer'
  | 'Candid Master'
  | 'Cinematographer'
  | 'Video Editor'
  | 'Drone Operator'
  | 'Sales & Client Relations';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  phone: string;
  email: string;
  dailyRate: number; // ₹ per day / project
  status: 'Active' | 'On Shoot' | 'Inactive';
  assignedShootsCount: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface TaskAssignment {
  id: string;
  memberId: string;
  memberName: string;
  bookingNumber: string;
  clientName: string;
  taskType: 'Shoot Event' | 'Editing Job' | 'Client Meeting';
  taskTitle: string;
  eventDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface OperationalTask {
  id: string;
  title: string;
  bookingNumber?: string;
  customerName?: string;
  clientName?: string;
  assignedMemberId?: string;
  assignedMemberName?: string;
  memberId?: string;
  memberName?: string;
  category?: string;
  dueDate?: string;
  eventDate?: string;
  priority?: 'High' | 'Medium' | 'Low' | string;
  status?: 'Pending' | 'In Progress' | 'Completed' | string;
}