'use client';
import React from 'react';

export interface ServiceInputsProps {
  serviceId?: string;
  service?: any;
  onUpdate?: (updates: any) => void;
  onChange?: (updates: any) => void;
}

export const ServiceInputs: React.FC<ServiceInputsProps> = ({ serviceId, service, onUpdate, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (onUpdate) onUpdate({ notes: val });
    if (onChange) onChange({ notes: val });
  };

  return (
    <div className="space-y-2">
      <label className="text-xs text-stone-500 block">Notes / Custom Instructions</label>
      <input
        type="text"
        placeholder="Add special requirements..."
        onChange={handleChange}
        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-amber-500"
      />
    </div>
  );
};
export default ServiceInputs;
