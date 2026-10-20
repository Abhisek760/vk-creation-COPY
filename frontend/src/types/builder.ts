export interface SelectedService {
  id?: string;
  serviceId?: string;
  name?: string;
  price?: number;
  notes?: string;
  [key: string]: any;
}

export interface BuilderState {
  id?: string;
  quoteId?: string;
  quoteNumber?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  grandTotal?: number;
  totalAmount?: number;
  status?: string;
  createdAt?: string;
  selectedServices?: SelectedService[];
  [key: string]: any;
}
