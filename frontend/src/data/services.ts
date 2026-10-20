import { Service } from "@/types/service";

export const defaultServices: Service[] = [
  {
    id: "trad-photo",
    name: "Traditional Photography",
    category: "photography",
    description: "Classic coverage for your special day.",
    pricingType: "per_day",
    basePrice: 15000,
  },
  {
    id: "trad-video",
    name: "Traditional Videography",
    category: "videography",
    description: "Full event video recording.",
    pricingType: "per_day",
    basePrice: 20000,
  },
  {
    id: "album",
    name: "Photobook Album",
    category: "album",
    description: "Custom printed premium album.",
    pricingType: "fixed",
    basePrice: 10000,
  },
];

export const services = defaultServices;