'use client';

import { useMemo } from 'react';
import { BuilderState } from './useBuilder';

export function calculateServicePrice(service: any): number {
  if (!service) return 0;
  if (typeof service.price === 'number') return service.price;
  if (typeof service.calculatedPrice === 'number') return service.calculatedPrice;
  return Number(service.price || service.amount || service.cost || 0);
}

export function useQuote(builder: BuilderState) {
  const services = useMemo(() => {
    if (!builder?.services || !Array.isArray(builder.services)) return [];
    return builder.services.map((service: any) => ({
      ...service,
      price: calculateServicePrice(service),
    }));
  }, [builder?.services]);

  const subtotal = useMemo(() => {
    return services.reduce((acc: number, s: any) => acc + (s.price || 0), 0);
  }, [services]);

  const discountAmount = useMemo(() => {
    return Number(builder?.discount || 0);
  }, [builder?.discount]);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  
  const gstAmount = useMemo(() => {
    if (builder?.includeGST || builder?.applyGST) {
      return Math.round(taxableAmount * 0.18);
    }
    return 0;
  }, [taxableAmount, builder?.includeGST, builder?.applyGST]);

  const grandTotal = useMemo(() => {
    return taxableAmount + gstAmount;
  }, [taxableAmount, gstAmount]);

  const advanceAmount = useMemo(() => {
    return Number(builder?.advancePaid || 0);
  }, [builder?.advancePaid]);

  const remainingBalance = Math.max(0, grandTotal - advanceAmount);

  return {
    services,
    subtotal,
    discountAmount,
    taxableAmount,
    gstAmount,
    grandTotal,
    advanceAmount,
    remainingBalance,
  };
}

export default useQuote;
