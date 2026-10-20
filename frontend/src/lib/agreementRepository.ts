import { WeddingAgreement, ContractClause } from '@/types/agreement';

export const DEFAULT_CONTRACT_CLAUSES: ContractClause[] = [
  {
    id: 'c1',
    title: '1. Deliverables & Editing Schedule',
    content:
      'Raw photographs will be shared within 7 working days of event completion. Final color-graded edited digital photos and photobook prints will be delivered within 45 working days upon photo selection by the client.',
  },
  {
    id: 'c2',
    title: '2. Payment Schedule & Milestones',
    content:
      'A non-refundable booking advance of 30% is required to lock dates. 50% is due on or before the primary event date, and the remaining 20% balance is payable upon final album delivery.',
  },
  {
    id: 'c3',
    title: '3. Cancellation & Postponement Policy',
    content:
      'In the event of cancellation by the client, the booking advance remains non-refundable. Event postponements are subject to team availability and potential rate adjustments for new dates.',
  },
  {
    id: 'c4',
    title: '4. Artistic Copyright & Studio Portfolio Rights',
    content:
      'VK Creation retains artistic copyright over all created media, reserving the right to publish highlights on social media, websites, and portfolio exhibits for studio promotion unless explicitly opted out in writing prior to event coverage.',
  },
  {
    id: 'c5',
    title: '5. Technical Coverage & Travel Logistics',
    content:
      'Outstation travel, stay, and local logistics for the studio crew shall be provided or reimbursed by the client unless explicitly bundled into a destination package.',
  },
];

const DEFAULT_AGREEMENTS: WeddingAgreement[] = [
  {
    id: 'VK-AGR-2026-001',
    agreementNumber: 'VK-AGR-2026-001',
    bookingNumber: 'VKCREATION-2026-001',
    clientName: 'Rahul & Sneha Sharma',
    clientPhone: '+91 9876543210',
    clientEmail: 'rahul.s@gmail.com',
    clientAddress: 'Vijay Nagar, Indore, MP',
    eventType: 'Grand Wedding & Reception',
    eventDate: '2026-11-20',
    venue: 'Sayaji Hotel, Indore',
    city: 'Indore',
    totalContractAmount: 180000,
    advancePaid: 75000,
    clauses: DEFAULT_CONTRACT_CLAUSES,
    deliverables: [
      '1 Traditional Photographer + 1 Candid Photographer',
      '1 Cinematic 4K Videographer + Drone Coverage',
      'Full HD Cinematic Teaser (3-5 min) + Feature Film',
      '2 Premium Flush Mount Photobooks (40 Pages each)',
      '1TB Hard Drive with Complete Raw Data',
    ],
    studioSignatory: 'Aman Sharma (Founder & Creative Director)',
    clientSignatureName: 'Rahul Sharma',
    clientSignatureDate: '2026-07-02',
    isSigned: true,
    status: 'Signed',
    createdAt: new Date().toISOString(),
  },
];

export class AgreementRepository {
  static getAll(): WeddingAgreement[] {
    if (typeof window === 'undefined') return DEFAULT_AGREEMENTS;
    const saved = localStorage.getItem('vk_studio_agreements');
    if (!saved) {
      localStorage.setItem('vk_studio_agreements', JSON.stringify(DEFAULT_AGREEMENTS));
      return DEFAULT_AGREEMENTS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_AGREEMENTS;
    }
  }

  static getByNumber(agreementNumber: string): WeddingAgreement | null {
    const agreements = this.getAll();
    return agreements.find((a) => a.agreementNumber === agreementNumber || a.id === agreementNumber) || null;
  }

  static save(agreement: WeddingAgreement): void {
    if (typeof window === 'undefined') return;
    const agreements = this.getAll();
    const index = agreements.findIndex((a) => a.id === agreement.id || a.agreementNumber === agreement.agreementNumber);
    if (index >= 0) {
      agreements[index] = agreement;
    } else {
      agreements.unshift(agreement);
    }
    localStorage.setItem('vk_studio_agreements', JSON.stringify(agreements));
  }

  static generateWhatsAppContractLink(agreement: WeddingAgreement): string {
    const cleanPhone = agreement.clientPhone.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const text = encodeURIComponent(
      `Hello ${agreement.clientName}! ✨\n\n` +
        `Here is your official *Wedding Photography Coverage Agreement* from VK Creation Studio.\n\n` +
        `📜 *Contract Ref:* ${agreement.agreementNumber}\n` +
        `🗓 *Event Date:* ${agreement.eventDate}\n` +
        `💰 *Contract Value:* ₹${agreement.totalContractAmount.toLocaleString('en-IN')}\n\n` +
        `Please review and complete your digital acceptance signature here:\n` +
        `${window.location.origin}/booking/agreement/${agreement.agreementNumber}\n\n` +
        `Thank you for choosing VK Creation!`
    );

    return `https://wa.me/${phone}?text=${text}`;
  }
}