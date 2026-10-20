import { PackagePreset as PPreset } from './package';

export type PackagePreset = PPreset;

export interface ServiceAddon {
  serviceId?: string;
  serviceName: string;
  quantity?: number;
  daysOrUnits?: number;
  rate?: number;
}

export interface StudioPackage {
  id: string;
  title: string;
  name?: string;
  tagline: string;
  price: number;
  popular?: boolean;
  isRecommended?: boolean;
  features: string[];
  deliverables?: string[];
  termsSummary?: string;
  includedServices: ServiceAddon[];
}

export type Service = StudioService;

export interface StudioService {
  id: string;
  name: string;
  title?: string;       // Legacy bridge
  description?: string; // Legacy bridge
  category: 'Photography' | 'Videography' | 'Drone' | 'Album' | 'Editing' | 'Other' | string;
  rate?: number;
  basePrice?: number;
  unit?: 'Per Day' | 'Per Event' | 'Per Book' | 'Per Reel' | string;
  pricingType?: 'per_day' | 'fixed' | string; // Legacy bridge
}