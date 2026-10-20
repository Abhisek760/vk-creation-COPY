import { PostProductionProject, EditingStage } from '@/types/editing';

const DEFAULT_PROJECTS: PostProductionProject[] = [
  {
    id: 'edit-2026-001',
    bookingNumber: 'VKCREATION-2026-001',
    clientName: 'Rahul & Sneha Sharma',
    clientPhone: '+91 9876543210',
    clientEmail: 'rahul.s@gmail.com',
    eventType: 'Grand Wedding & Reception',
    eventDate: '2026-11-20',
    estimatedDeliveryDate: '2026-12-30',
    assignedEditor: 'Rohan Mehta (Senior Colorist)',
    stage: 'Color Grading',
    rawBackupDriveId: 'HDD-2026-W01',
    rawPhotosCount: 3450,
    selectedPhotosCount: 450,
    previewGalleryUrl: 'https://gallery.vkcreation.com/rahul-sneha-wedding',
    teaserVideoUrl: 'https://youtube.com/watch?v=sample123',
    clientApprovalStatus: 'Selection Received',
    clientRevisionNotes: 'Client preferred warmer tone grades on Sangeet night shots.',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'edit-2026-002',
    bookingNumber: 'VKCREATION-2026-002',
    clientName: 'Priya & Ankit',
    clientPhone: '+91 9123456789',
    clientEmail: 'priya.ankit@gmail.com',
    eventType: 'Pre-Wedding & Engagement',
    eventDate: '2026-08-15',
    estimatedDeliveryDate: '2026-09-15',
    actualDeliveryDate: '2026-09-10',
    assignedEditor: 'Suresh Kumar (Video Editor)',
    stage: 'Final Delivered',
    rawBackupDriveId: 'HDD-2026-E04',
    rawPhotosCount: 1200,
    selectedPhotosCount: 150,
    previewGalleryUrl: 'https://gallery.vkcreation.com/priya-ankit-prewedding',
    finalDeliverablesUrl: 'https://drive.google.com/drive/folders/sample_final',
    clientApprovalStatus: 'Approved',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export class EditingRepository {
  static getAll(): PostProductionProject[] {
    if (typeof window === 'undefined') return DEFAULT_PROJECTS;
    const saved = localStorage.getItem('vk_studio_editing');
    if (!saved) {
      localStorage.setItem('vk_studio_editing', JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_PROJECTS;
    }
  }

  static getById(id: string): PostProductionProject | null {
    const projects = this.getAll();
    return projects.find((p) => p.id === id || p.bookingNumber === id) || null;
  }

  static save(project: PostProductionProject): void {
    if (typeof window === 'undefined') return;
    const projects = this.getAll();
    const index = projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      projects[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.unshift(project);
    }
    localStorage.setItem('vk_studio_editing', JSON.stringify(projects));
  }

  static updateStage(id: string, stage: EditingStage): PostProductionProject | null {
    const project = this.getById(id);
    if (!project) return null;

    const updated = { ...project, stage, updatedAt: new Date().toISOString() };
    if (stage === 'Final Delivered' && !updated.actualDeliveryDate) {
      updated.actualDeliveryDate = new Date().toISOString().split('T')[0];
    }
    this.save(updated);
    return updated;
  }
}