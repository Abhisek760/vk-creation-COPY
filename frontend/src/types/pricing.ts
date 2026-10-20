export type PricingType = 'per_day' | 'per_hour' | 'per_photo' | 'per_reel' | 'fixed' | string;

export interface ServicePricingInput {
  rate?: number;
  days?: number;
  hours?: number;
  count?: number;
  quantity?: number;
  [key: string]: any;
}

export interface ServicePricingResult {
  total: number;
  subtotal?: number;
  breakdown?: any;
  [key: string]: any;
}

export interface PricingConfig {
  [serviceId: string]: {
    inputs?: Array<{
      key: string;
      label?: string;
      type?: string;
      options?: Array<{ value: any; label: string }>;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
}
