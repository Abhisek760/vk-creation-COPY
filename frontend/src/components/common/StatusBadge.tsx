'use client';

import React from 'react';

export type StatusType =
  | 'Paid'
  | 'Partially Paid'
  | 'Pending'
  | 'Overdue'
  | 'Scheduled'
  | 'In Progress'
  | 'Completed'
  | 'Draft'
  | 'Sent'
  | 'Fully Executed'
  | 'Confirmed';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStyle = (s: string) => {
    switch (s) {
      case 'Paid':
      case 'Completed':
      case 'Fully Executed':
      case 'Confirmed':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
      case 'Partially Paid':
      case 'In Progress':
      case 'Scheduled':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/60';
      case 'Pending':
      case 'Draft':
      case 'Sent':
        return 'bg-stone-900 text-stone-300 border-stone-800';
      case 'Overdue':
      case 'Cancelled':
        return 'bg-red-950/80 text-red-400 border-red-800/60';
      default:
        return 'bg-stone-900 text-stone-400 border-stone-800';
    }
  };

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider uppercase font-mono ${getStyle(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;