import { Service } from "@/types/service";
import { defaultServices } from "@/data/services";
import { getStorageItem, setStorageItem } from "../storage/localStorageProvider";

const SERVICES_STORAGE_KEY = "studio_services_v1";

export const serviceRepository = {
  getAll: (): Service[] => {
    try {
      const stored = getStorageItem<Service[]>(SERVICES_STORAGE_KEY, []);
      if (Array.isArray(stored) && stored.length > 0) {
        return stored;
      }
      setStorageItem(SERVICES_STORAGE_KEY, defaultServices);
      return defaultServices;
    } catch (error) {
      console.error("Error fetching services:", error);
      return defaultServices;
    }
  },

  getById: (id: string): Service | null => {
    const services = serviceRepository.getAll();
    return services.find((s) => s.id === id) || null;
  },

  saveAll: (services: Service[]): void => {
    setStorageItem(SERVICES_STORAGE_KEY, services);
  },

  resetToDefaults: (): Service[] => {
    setStorageItem(SERVICES_STORAGE_KEY, defaultServices);
    return defaultServices;
  },
};

export const ServiceRepository = serviceRepository;
export default serviceRepository;