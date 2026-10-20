import { PricingType } from "@/types/pricing";

export type InputType = "number" | "select" | "checkbox";

export interface SelectOption {
  label: string;
  value: string;
  price?: number;
}

export interface InputField {
  id: string;
  label: string;
  type: InputType;
  placeholder?: string;
  options?: SelectOption[];
}

export interface ServiceRuleSet {
  normalRate?: number;
  bulkRate?: number;
  bulkThreshold?: number;
  hdRate?: number;
  fourKRate?: number;
  pendrivePrice?: number;
  dayRate?: number;
  reelRate?: number;
  photoRate?: number;
  fixedPrice?: number;
}

export interface ServiceConfig {
  pricingType: PricingType;

  inputs: InputField[];

  rules: ServiceRuleSet;

  defaults: Record<string, unknown>;
}

export const pricingConfig: Record<string, ServiceConfig> = {
TP001: {
  pricingType: "per_photo",
    inputs: [
      {
        id: "photos",
        label: "Total Photos",
        type: "number",
        placeholder: "Enter total photos",
      },
    ],
    rules: {
      normalRate: 8,
      bulkRate: 7,
      bulkThreshold: 2000,
    },
    defaults: {
      photos: 2000,
    },
  },

  TV001: {
    pricingType: "per_hour",
    inputs: [
      {
        id: "quality",
        label: "Video Quality",
        type: "select",
        options: [
          {
            label: "HD",
            value: "hd",
          },
          {
            label: "4K",
            value: "4k",
          },
        ],
      },
      {
        id: "hours",
        label: "Coverage Hours",
        type: "number",
      },
      {
        id: "pendrive",
        label: "Include Pendrive",
        type: "checkbox",
      },
    ],
    rules: {
      hdRate: 3500,
      fourKRate: 4500,
      pendrivePrice: 1500,
    },
    defaults: {
      quality: "hd",
      hours: 4,
      pendrive: false,
    },
  },

  CP001: {
    pricingType: "per_day",
    inputs: [
      {
        id: "days",
        label: "Coverage Days",
        type: "number",
      },
    ],
    rules: {
      dayRate: 5000,
    },
    defaults: {
      days: 1,
    },
  },

  CF001: {
    pricingType: "per_day",
    inputs: [
      {
        id: "days",
        label: "Coverage Days",
        type: "number",
      },
    ],
    rules: {
      dayRate: 20000,
    },
    defaults: {
      days: 1,
    },
  },

  DR001: {
    pricingType: "per_day",
    inputs: [
      {
        id: "days",
        label: "Coverage Days",
        type: "number",
      },
    ],
    rules: {
      dayRate: 5000,
    },
    defaults: {
      days: 1,
    },
  },

  RL001: {
    pricingType: "per_reel",
    inputs: [
      {
        id: "reels",
        label: "Number of Reels",
        type: "number",
      },
    ],
    rules: {
      reelRate: 2000,
    },
    defaults: {
      reels: 1,
    },
  },

  EP001: {
    pricingType: "per_photo",
    inputs: [
      {
        id: "photos",
        label: "Edited Photos",
        type: "number",
      },
    ],
    rules: {
      photoRate: 25,
    },
    defaults: {
      photos: 20,
    },
  },

  DV001: {
    pricingType: "fixed",
    inputs: [],
    rules: {
      fixedPrice: 1500,
    },
    defaults: {},
  },

  AL001: {
    pricingType: "per_sheet",
    inputs: [
      {
        id: "sheetType",
        label: "Sheet Type",
        type: "select",
        options: [
          { label: "Transparent", value: "transparent", price: 450 },
          { label: "NTR", value: "ntr", price: 400 },
          { label: "Silk Matt", value: "silk-matt", price: 425 },
          { label: "NTR Matt", value: "ntr-matt", price: 425 },
          { label: "Velvet", value: "velvet", price: 430 },
          { label: "Royal Metallic", value: "royal-metallic", price: 450 },
          { label: "Texture", value: "texture", price: 475 },
          { label: "High Glossy", value: "high-glossy", price: 325 },
        ],
      },
      {
        id: "coverType",
        label: "Cover Type",
        type: "select",
        options: [
          { label: "Normal", value: "normal", price: 750 },
          { label: "Sparkle", value: "sparkle", price: 1000 },
          { label: "3D", value: "3d", price: 1200 },
          { label: "Acrylic", value: "acrylic", price: 1200 },
        ],
      },
      {
        id: "sheetCount",
        label: "Number of Sheets",
        type: "number",
        placeholder: "Enter total sheets",
      },
    ],
    rules: {},
    defaults: {
      sheetType: "transparent",
      coverType: "normal",
      sheetCount: 20,
    },
  },
};