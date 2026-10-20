'use client';

import React from 'react';

interface AgreementFormProps {
  agreement?: {
    foodIncluded?: boolean;
    travelIncluded?: boolean;
    deliveryDays?: number;
    paymentTerms?: string;
    cancellationPolicy?: string;
    copyright?: string;
  };
  onChange: (updatedAgreement: any) => void;
}

export const AgreementForm: React.FC<AgreementFormProps> = ({ agreement = {}, onChange }) => {
  const safeAgreement = {
    foodIncluded: agreement?.foodIncluded ?? true,
    travelIncluded: agreement?.travelIncluded ?? true,
    deliveryDays: agreement?.deliveryDays || 30,
    paymentTerms: agreement?.paymentTerms || '40% Advance, 50% On Event Date, 10% On Final Delivery',
    cancellationPolicy: agreement?.cancellationPolicy || 'Advance payment is non-refundable in case of cancellation.',
    copyright: agreement?.copyright || 'VK Creation retains copyright for promotional purposes.',
  };

  return (
    <div className="space-y-4 rounded-xl border border-stone-800 bg-stone-900/60 p-5">
      <h3 className="text-lg font-semibold text-stone-200">Agreement & Terms</h3>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex items-center space-x-3 cursor-pointer rounded-lg border border-stone-800 bg-stone-800/40 p-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-amber-500"
            checked={Boolean(safeAgreement.foodIncluded)}
            onChange={(e) =>
              onChange({
                ...safeAgreement,
                foodIncluded: e.target.checked,
              })
            }
          />
          <span className="text-sm text-stone-300">Food Provided by Client</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer rounded-lg border border-stone-800 bg-stone-800/40 p-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-amber-500"
            checked={Boolean(safeAgreement.travelIncluded)}
            onChange={(e) =>
              onChange({
                ...safeAgreement,
                travelIncluded: e.target.checked,
              })
            }
          />
          <span className="text-sm text-stone-300">Travel/Stay Provided by Client</span>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-400">Delivery Timeline (Days)</label>
          <input
            type="number"
            className="w-full rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            value={safeAgreement.deliveryDays}
            onChange={(e) =>
              onChange({
                ...safeAgreement,
                deliveryDays: Number(e.target.value) || 0,
              })
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-stone-400">Payment Terms</label>
          <input
            type="text"
            className="w-full rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            value={safeAgreement.paymentTerms}
            onChange={(e) =>
              onChange({
                ...safeAgreement,
                paymentTerms: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AgreementForm;
