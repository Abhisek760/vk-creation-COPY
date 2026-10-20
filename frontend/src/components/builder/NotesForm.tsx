'use client';

import React from 'react';

interface NotesFormProps {
  notes?: string;
  onChange?: (notes: string) => void;
  [key: string]: any;
}

export const NotesForm: React.FC<NotesFormProps> = ({
  notes = '',
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-300">
        Additional Notes & Instructions
      </label>
      <textarea
        value={notes || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        rows={4}
        placeholder="Enter any additional requirements, terms, or notes for the quote..."
        className="w-full rounded-xl border border-stone-800 bg-stone-900/50 p-4 text-sm text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      />
    </div>
  );
};

export default NotesForm;
