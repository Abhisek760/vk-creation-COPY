export interface PortfolioShowcaseItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface TestimonialItem {
  id: string;
  coupleName: string;
  venue: string;
  quote: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface WebsiteCMSConfig {
  hero: {
    title: string;
    subtitle: string;
    heroImageUrl: string;
    ctaButtonText: string;
  };
  portfolioShowcase: PortfolioShowcaseItem[];
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
  contactAndFooter: {
    studioAddress: string;
    phonePrimary: string;
    emailPrimary: string;
    instagramUrl: string;
    youtubeUrl: string;
    gstinNumber: string;
  };
}