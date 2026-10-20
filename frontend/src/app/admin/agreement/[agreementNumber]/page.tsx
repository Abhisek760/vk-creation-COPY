'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { DocumentRepository } from '@/lib/documentRepository';
import { EmptyState } from '@/components/common/EmptyState';

interface ServiceAgreementType {
  agreementNumber: string;
  bookingNumber: string;
  clientName: string;
  eventDate: string;
  venue: string;
}

export default function AgreementDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const agreementNumber = params?.agreementNumber as string;
  const isClientMode = searchParams.get('mode') === 'client';

  const [agreement, setAgreement] = useState<ServiceAgreementType | null>(null);

  useEffect(() => {
    if (agreementNumber) {
      const found: any = DocumentRepository.getAgreement(agreementNumber);
      setAgreement(found);
    }
  }, [agreementNumber]);

  if (!agreement) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6">
        <EmptyState
          title="Service Agreement Not Found"
          description={`No contract agreement matching "${agreementNumber}" was found.`}
          actionLabel={isClientMode ? "Back to Portal" : "Back to Agreements"}
          onAction={() => router.push(isClientMode ? `/portal/${agreementNumber}` : '/admin/agreement')}
        />
      </div>
    );
  }

  const handleBackNavigation = () => {
    if (isClientMode) {
      router.push(`/portal/${agreement.bookingNumber}`);
    } else {
      router.push('/admin/agreement');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 md:p-10 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-4 gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
            {isClientMode ? 'VK Creation Studio — Client Portal' : 'Legal & Contract Management'}
          </span>
          <h1 className="text-2xl font-extrabold text-stone-100 mt-0.5">
            Service Agreement #{agreement.agreementNumber}
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => DocumentRepository.triggerBrowserPrint()}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400 transition"
          >
            🖨️ Print / Save Agreement
          </button>

          <button
            onClick={handleBackNavigation}
            className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-800 transition"
          >
            {isClientMode ? '← Back to Client Portal' : '← Back to Agreements'}
          </button>
        </div>
      </div>

      {/* Contract Document */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-10 space-y-6 text-xs text-stone-300 print:bg-white print:text-black print:border-none">
        <div className="border-b border-stone-800 print:border-gray-300 pb-4">
          <h2 className="text-xl font-black text-amber-500 print:text-amber-700 uppercase">
            WEDDING PHOTOGRAPHY & CINEMATOGRAPHY SERVICE AGREEMENT
          </h2>
          <p className="text-[11px] text-stone-400 print:text-gray-600 mt-1">
            Contract Ref: {agreement.agreementNumber} | Booking Ref: {agreement.bookingNumber}
          </p>
        </div>

        <div className="space-y-4">
          <p>This agreement is made between <strong>VK Creation Studio</strong> and <strong>{agreement.clientName}</strong> for coverage on date <strong>{agreement.eventDate}</strong> at venue <strong>{agreement.venue || 'Indore'}</strong>.</p>
          
          <div className="space-y-2 bg-stone-950 print:bg-gray-50 p-4 rounded-xl border border-stone-800 print:border-gray-200">
            <h3 className="font-bold text-stone-200 print:text-black uppercase text-[11px]">Key Terms & Deliverables:</h3>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-stone-400 print:text-gray-700">
              <li>Deliverables will be handed over post full payment clearance.</li>
              <li>RAW footage drive & photo selection gallery provided via Client Portal.</li>
              <li>Advance Token deposit is non-refundable upon cancellation within 15 days of event date.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}