export interface IncludedPackageService {
  serviceId?: string;
  serviceName: string;
  daysOrUnits?: number;
  quantity?: number;
  rate?: number;
}

export interface PackagePreset {
  id: string;
  name: string;
  title?: string;
  description?: string;
  tagline?: string;
  price: number;
  popular?: boolean;
  isRecommended?: boolean;
  deliverables: string[];
  features?: string[];
  termsSummary?: string;
  includedServices: IncludedPackageService[];
}