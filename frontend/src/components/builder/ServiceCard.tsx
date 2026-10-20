'use client';

import React from 'react';
import { SelectedService } from '@/types/builder';
import ServiceInputs from './ServiceInputs';

interface ServiceCardProps {
  service: any;
  selectedServices?: SelectedService[];
  onSelectService?: (service: any) => void;
  onUpdateService?: (serviceId: string, updates: any) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  selectedServices = [],
  onSelectService,
  onUpdateService,
}) => {
  const isSelected = selectedServices.some(
    (s: any) => (s.id || s.serviceId) === (service.id || service.serviceId)
  );

  const containerClasses = isSelected
    ? 'p-5 rounded-2xl border transition shadow-sm border-amber-500 bg-amber-50/20'
    : 'p-5 rounded-2xl border transition shadow-sm border-stone-200 bg-white hover:border-stone-300';

  const buttonClasses = isSelected
    ? 'px-3 py-1.5 rounded-xl text-xs font-medium transition bg-amber-500 text-white'
    : 'px-3 py-1.5 rounded-xl text-xs font-medium transition bg-stone-100 text-stone-700 hover:bg-stone-200';

  const targetId = service.id || service.serviceId || '';

  return (
    <div className={containerClasses}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-semibold text-stone-900 text-base">
            {service.title || service.name}
          </h3>
          <p className="text-xs text-stone-500 mt-1">{service.description}</p>
        </div>
        {onSelectService && (
          <button
            onClick={() => onSelectService(service)}
            className={buttonClasses}
          >
            {isSelected ? 'Selected' : 'Add Service'}
          </button>
        )}
      </div>

      {isSelected && onUpdateService && (
        <div className="mt-4 pt-4 border-t border-stone-100">
          <ServiceInputs
            serviceId={targetId}
            onUpdate={(updates: any) => onUpdateService(targetId, updates)}
          />
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
