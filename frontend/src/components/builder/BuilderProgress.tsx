'use client';

import React from 'react';

interface BuilderProgressProps {
  builder: any;
}

export const BuilderProgress: React.FC<BuilderProgressProps> = ({ builder }) => {
  const customerName = builder?.customer?.name || builder?.customerName || '';
  const customerPhone = builder?.customer?.phone || builder?.customerPhone || '';

  const eventType = builder?.event?.eventType || builder?.eventType || '';
  const eventDate = builder?.event?.eventDate || builder?.eventDate || '';

  const customerCompleted = customerName.trim() !== '' && customerPhone.trim() !== '';
  const eventCompleted = eventType.trim() !== '' || eventDate.trim() !== '';
  const servicesCompleted = Array.isArray(builder?.services) && builder.services.length > 0;

  const completedSteps = [customerCompleted, eventCompleted, servicesCompleted].filter(Boolean).length;
  const progressPercent = Math.round((completedSteps / 3) * 100);

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between text-xs text-stone-400">
        <span>Quote Progress</span>
        <span className="font-semibold text-amber-500">{progressPercent}% Completed</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-800">
        <div
          className="h-full bg-amber-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default BuilderProgress;
