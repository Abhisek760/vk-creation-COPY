'use client';

import React from "react";
import ServiceCard from "./ServiceCard";

interface ServiceListProps {
  services?: any[];
  selectedServices?: any[];
  builder?: any;
  toggleService?: (serviceId: string) => void;
  updateServiceValues?: (serviceId: string, values: Record<string, any>) => void;
  onSelectService?: (service: any) => void;
  onUpdateService?: (serviceId: string, updates: any) => void;
}

export const ServiceList: React.FC<ServiceListProps> = ({
  services = [],
  selectedServices = [],
  builder,
  toggleService,
  updateServiceValues,
  onSelectService,
  onUpdateService,
}) => {
  if (!services || services.length === 0) {
    return (
      <div className="p-8 text-center bg-stone-900/30 rounded-2xl border border-stone-800 text-stone-400">
        No services available.
      </div>
    );
  }

  const effectiveSelected = selectedServices.length > 0 
    ? selectedServices 
    : (builder?.selectedServices || builder?.services || []);

  const handleSelect = (service: any) => {
    const sId = service.id || service.serviceId;
    if (toggleService && sId) {
      toggleService(sId);
    } else if (onSelectService) {
      onSelectService(service);
    }
  };

  const handleUpdate = (serviceId: string, updates: any) => {
    if (updateServiceValues) {
      updateServiceValues(serviceId, updates);
    } else if (onUpdateService) {
      onUpdateService(serviceId, updates);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service, index) => (
        <ServiceCard
          key={service.id || service.serviceId || index}
          service={service}
          selectedServices={effectiveSelected}
          onSelectService={handleSelect}
          onUpdateService={handleUpdate}
        />
      ))}
    </div>
  );
};

export default ServiceList;
