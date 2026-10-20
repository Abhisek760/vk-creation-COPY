export interface ContractClause {
  id: string;
  title: string;
  content: string;
  isEditable?: boolean;
}

export interface WeddingAgreement {
  id: string;
  agreementNumber: string;
  bookingNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientAddress?: string;
  eventType: string;
  eventDate: string;
  venue: string;
  city: string;
  totalContractAmount: number;
  advancePaid: number;
  clauses: ContractClause[];
  deliverables: string[];
  studioSignatory: string;
  clientSignatureName?: string;
  clientSignatureDate?: string;
  isSigned: boolean;
  status: 'Draft' | 'Sent' | 'Signed' | 'Cancelled';
  createdAt: string;
}