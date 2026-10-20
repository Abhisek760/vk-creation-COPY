export type EditingStage = 
  | 'Raw Data Ingest'
  | 'In Culling'
  | 'Color Grading'
  | 'Client Approval'
  | 'Final Delivered';

export interface PostProductionProject {
  id: string;
  bookingNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  eventType: string;
  eventDate: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  assignedEditor: string;
  stage: EditingStage;
  
  // Deliverable Assets & Links
  rawBackupDriveId?: string; // e.g. "HDD-2026-A1"
  rawPhotosCount: number;
  selectedPhotosCount: number;
  previewGalleryUrl?: string; // e.g. Pixieset / Google Drive link
  teaserVideoUrl?: string;    // YouTube / Vimeo teaser link
  finalDeliverablesUrl?: string; // Final ZIP / Cloud Link
  
  // Client Feedback & Revisions
  clientApprovalStatus: 'Pending Selection' | 'Selection Received' | 'Revision Requested' | 'Approved';
  clientRevisionNotes?: string;
  updatedAt: string;
  createdAt: string;
}