import {
  TeamMember,
  EditingWorkflowItem,
  OperationalTask,
  StudioNotification,
  ShootSchedule,
  EditingStage,
} from '@/types/operations';
import { getStoredBookings } from '@/lib/storage';

export class StudioOperationsRepository {
  static getTeamMembers(): TeamMember[] {
    return [
      { id: 'TM-1', name: 'Vikram Karnera', role: 'Admin', phone: '+91 98765 00001', email: 'vikram@vkcreation.com', activeAssignmentsCount: 12, status: 'Available' },
      { id: 'TM-2', name: 'Rahul Sharma', role: 'Photographer', phone: '+91 98765 00002', email: 'rahul@vkcreation.com', activeAssignmentsCount: 4, status: 'On Shoot' },
      { id: 'TM-3', name: 'Amit Verma', role: 'Videographer', phone: '+91 98765 00003', email: 'amit@vkcreation.com', activeAssignmentsCount: 3, status: 'On Shoot' },
      { id: 'TM-4', name: 'Priya Mehta', role: 'Editor', phone: '+91 98765 00004', email: 'priya@vkcreation.com', activeAssignmentsCount: 5, status: 'Editing' },
      { id: 'TM-5', name: 'Sneha Patel', role: 'Sales Executive', phone: '+91 98765 00005', email: 'sneha@vkcreation.com', activeAssignmentsCount: 8, status: 'Available' },
    ];
  }

  static getShoots(): ShootSchedule[] {
    const bookings = getStoredBookings();
    
    return bookings.map((b: any, index: number) => ({
      id: `SHOOT-${index + 1}`,
      bookingNumber: b.bookingNumber || `VKCREATION-2026-00${index + 1}`,
      clientName: b.customerName || b.clientName || 'Ananya & Kabir',
      eventTitle: 'Sangeet & Wedding Ceremony',
      eventDate: b.eventDate || '2026-11-20',
      callTime: '02:00 PM',
      venueLocation: b.venue || 'Sayaji Hotel & Resorts, Indore',
      assignedLeadPhotographer: 'Rahul Sharma',
      assignedLeadCinematographer: 'Amit Verma',
      equipmentChecklist: [
        { item: 'Dual Sony A7IV Bodies + 70-200mm f/2.8', checked: true },
        { item: 'DJI Ronin RS3 Gimbal & Wireless Mic Kit', checked: true },
        { item: 'Godox AD600 Pro Lighting & Modifiers', checked: false },
        { item: 'Backup SD Cards (V90 128GB) & Batteries', checked: true },
      ],
      status: index === 0 ? 'In Progress' : 'Scheduled',
    }));
  }

  static getEditingPipelines(): EditingWorkflowItem[] {
    return [
      {
        id: 'EDIT-101',
        bookingNumber: 'VKCREATION-2026-001',
        clientName: 'Ananya & Kabir',
        packageName: 'Gold Luxury Wedding Tier',
        assignedEditor: 'Priya Mehta',
        currentStage: 'Color Grading',
        rawDriveLink: 'https://drive.google.com/drive/folders/raw_ananya_kabir',
        clientPreviewLink: 'https://vkcreation.com/gallery/GAL-2026-001',
        deadline: '2026-08-15',
        updatedAt: '2026-07-23',
      },
      {
        id: 'EDIT-102',
        bookingNumber: 'VKCREATION-2026-002',
        clientName: 'Rohan & Ishita',
        packageName: 'Royal Heritage Destination Package',
        assignedEditor: 'Priya Mehta',
        currentStage: 'Raw Data Received',
        deadline: '2026-08-28',
        updatedAt: '2026-07-22',
      },
    ];
  }

  static getTasks(): OperationalTask[] {
    return [
      { id: 'TSK-1', bookingNumber: 'VKCREATION-2026-001', taskTitle: 'Upload Color Graded Teaser to Client Portal', assignedTo: 'Priya Mehta', assignedRole: 'Editor', dueDate: '2026-07-25', priority: 'High', status: 'In Progress' },
      { id: 'TSK-2', bookingNumber: 'VKCREATION-2026-001', taskTitle: 'Charge All FX3 & A7IV Batteries for Tomorrow Shoot', assignedTo: 'Rahul Sharma', assignedRole: 'Photographer', dueDate: '2026-07-24', priority: 'Urgent', status: 'Pending' },
      { id: 'TSK-3', bookingNumber: 'VKCREATION-2026-002', taskTitle: 'Dispatch Final Printed Canvera Photobook Album', assignedTo: 'Vikram Karnera', assignedRole: 'Admin', dueDate: '2026-08-01', priority: 'Medium', status: 'Pending' },
    ];
  }

  static getNotifications(): StudioNotification[] {
    return [
      { id: 'NOTIF-1', type: 'Shoot Reminder', title: 'Upcoming Shoot Tomorrow', message: 'Call time at 02:00 PM for Ananya & Kabir wedding at Sayaji Hotel.', date: '2026-07-23', severity: 'Warning', isRead: false },
      { id: 'NOTIF-2', type: 'Editing Deadline', title: 'Color Grading Milestone Due', message: 'Teaser video edit for VKCREATION-2026-001 is due in 2 days.', date: '2026-07-23', severity: 'Info', isRead: false },
      { id: 'NOTIF-3', type: 'Pending Task', title: 'Equipment Prep Required', message: 'Rahul Sharma has 1 urgent equipment charging task pending.', date: '2026-07-23', severity: 'Critical', isRead: false },
    ];
  }

  static updateEditingStage(editId: string, newStage: EditingStage): void {
    const pipelines = this.getEditingPipelines();
    const item = pipelines.find((p) => p.id === editId);
    if (item) {
      item.currentStage = newStage;
      item.updatedAt = new Date().toISOString().split('T')[0];
    }
  }
}