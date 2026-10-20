export interface CompanyInfo {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  website: string;
}

export const companyConfig: CompanyInfo = {
  name: "VK Creation Studio",
  tagline: "Capturing Moments, Creating Memories",
  email: "contact@vkcreation.com",
  phone: "+91 98765 43210",
  address: "Studio 101, Film City Road, Mumbai, India",
  website: "https://vkcreation.com",
};

export const company = companyConfig;