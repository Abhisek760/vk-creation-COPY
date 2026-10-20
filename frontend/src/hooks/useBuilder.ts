'use client';

import { useState, useCallback } from 'react';

export interface DeliverablesState {
  rawPhotos?: boolean;
  editedPhotos?: boolean;
  videoTeaser?: boolean;
  fullVideo?: boolean;
  albumPrinted?: boolean;
  [key: string]: any;
}

export interface BuilderState {
  id?: string;
  quoteId?: string;
  quoteNumber?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customer?: any;
  event?: any;
  discount?: number;
  advancePaid?: number;
  includeGST?: boolean;
  applyGST?: boolean;
  agreementTerms?: string;
  agreementAccepted?: boolean;
  services: any[];
  deliverables: DeliverablesState;
  notes: string;
  grandTotal?: number;
  totalAmount?: number;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

const initialBuilderState: BuilderState = {
  services: [],
  deliverables: {
    rawPhotos: true,
    editedPhotos: true,
    videoTeaser: false,
    fullVideo: false,
    albumPrinted: false,
  },
  notes: '',
  discount: 0,
  advancePaid: 0,
  includeGST: false,
  applyGST: false,
  agreementAccepted: false,
  grandTotal: 0,
  status: 'draft',
};

export const useBuilder = () => {
  const [builder, setBuilder] = useState<BuilderState>(initialBuilderState);

  const loadBuilder = useCallback((savedData: any) => {
    if (!savedData) return;
    setBuilder((prev) => ({
      ...prev,
      ...savedData,
      notes: savedData.notes ?? prev.notes ?? '',
      deliverables: {
        ...prev.deliverables,
        ...(savedData.deliverables || {}),
      },
      services: savedData.services || prev.services || [],
    }));
  }, []);

  const updateCustomerInfo = useCallback((info: Partial<BuilderState>) => {
    setBuilder((prev) => ({ ...prev, ...info }));
  }, []);

  const updateCustomer = useCallback((customerData: any) => {
    setBuilder((prev) => ({
      ...prev,
      customer: customerData,
      customerName: customerData?.name || prev.customerName,
      customerEmail: customerData?.email || prev.customerEmail,
      customerPhone: customerData?.phone || prev.customerPhone,
    }));
  }, []);

  const updateEvent = useCallback((eventData: any) => {
    setBuilder((prev) => ({
      ...prev,
      event: eventData,
    }));
  }, []);

  const updateDiscount = useCallback((discount: number) => {
    setBuilder((prev) => ({
      ...prev,
      discount,
    }));
  }, []);

  const updateAdvancePaid = useCallback((advancePaid: number) => {
    setBuilder((prev) => ({
      ...prev,
      advancePaid,
    }));
  }, []);

  const toggleGST = useCallback((val?: boolean) => {
    setBuilder((prev) => {
      const nextState = typeof val === 'boolean' ? val : !(prev.includeGST || prev.applyGST);
      return {
        ...prev,
        includeGST: nextState,
        applyGST: nextState,
      };
    });
  }, []);

  const updateAgreement = useCallback((agreementData: any) => {
    setBuilder((prev) => ({
      ...prev,
      agreement: agreementData,
      agreementTerms: typeof agreementData === 'string' ? agreementData : agreementData?.terms || prev.agreementTerms,
      agreementAccepted: typeof agreementData === 'boolean' ? agreementData : !!agreementData?.accepted,
    }));
  }, []);

  const toggleService = useCallback((serviceId: string, serviceData?: any) => {
    setBuilder((prev) => {
      const exists = prev.services.some(
        (service: any) => (service.id || service.serviceId) === serviceId
      );

      if (exists) {
        return {
          ...prev,
          services: prev.services.filter(
            (service: any) => (service.id || service.serviceId) !== serviceId
          ),
        };
      }

      const newService = serviceData || { serviceId, id: serviceId };
      return {
        ...prev,
        services: [...prev.services, newService],
      };
    });
  }, []);

  const updateServiceValues = useCallback(
    (serviceId: string, values: Record<string, any>) => {
      setBuilder((prev) => {
        const exists = prev.services.find(
          (service: any) => (service.id || service.serviceId) === serviceId
        );

        if (!exists) {
          return {
            ...prev,
            services: [...prev.services, { serviceId, id: serviceId, ...values }],
          };
        }

        return {
          ...prev,
          services: prev.services.map((service: any) =>
            (service.id || service.serviceId) === serviceId
              ? { ...service, ...values }
              : service
          ),
        };
      });
    },
    []
  );

  const updateDeliverables = useCallback((deliverables: Partial<DeliverablesState>) => {
    setBuilder((prev) => ({
      ...prev,
      deliverables: {
        ...prev.deliverables,
        ...deliverables,
      },
    }));
  }, []);

  const updateNotes = useCallback((notes: string) => {
    setBuilder((prev) => ({ ...prev, notes: notes || '' }));
  }, []);

  const resetBuilder = useCallback(() => {
    setBuilder(initialBuilderState);
  }, []);

  return {
    builder,
    builderState: builder,
    state: builder,
    loadBuilder,
    setBuilder,
    updateCustomerInfo,
    updateCustomer,
    updateEvent,
    updateDiscount,
    updateAdvancePaid,
    toggleGST,
    updateAgreement,
    toggleService,
    updateServiceValues,
    updateDeliverables,
    updateNotes,
    resetBuilder,
  };
};

export default useBuilder;
