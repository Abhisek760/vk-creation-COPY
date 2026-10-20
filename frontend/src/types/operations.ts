export type TeamRole = 'Admin' | 'Photographer' | 'Videographer' | 'Editor' | 'Sales Executive';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  phone: string;
  email: string;
  activeAssignmentsCount: number;
  status: 'Available' | 'On Shoot' | 'Editing' | 'Leave';
}

export type EditingStage =
  | 'Raw Data Received'
  | 'Data Backup Completed'
  | 'Editing Started'
  | 'Color Grading'
  | 'Album Designing'
  | 'Client Preview Sent'
  | 'Client Approval'
  | 'Final Export'
  | 'Delivery Ready';

export interface EditingWorkflowItem {
  id: string;
  bookingNumber: string;
  clientName: string;
  packageName: string;
  assignedEditor: string;
  currentStage: EditingStage;
  rawDriveLink?: string;
  clientPreviewLink?: string;
  deadline: string;
  updatedAt: string;
}

export interface OperationalTask {
  id: string;
  bookingNumber: string;
  taskTitle: string;
  assignedTo: string;
  assignedRole: TeamRole;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Under Review' | 'Completed';
}

export interface StudioNotification {
  id: string;
  type: 'Shoot Reminder' | 'Editing Deadline' | 'Delivery Alert' | 'Pending Task';
  title: string;
  message: string;
  date: string;
  severity: 'Info' | 'Warning' | 'Critical';
  isRead: boolean;
}

export interface ShootSchedule {
  id: string;
  bookingNumber: string;
  clientName: string;
  eventTitle: string;
  eventDate: string;
  callTime: string;
  venueLocation: string;
  assignedLeadPhotographer: string;
  assignedLeadCinematographer: string;
  equipmentChecklist: { item: string; checked: boolean }[];
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Postponed';
}