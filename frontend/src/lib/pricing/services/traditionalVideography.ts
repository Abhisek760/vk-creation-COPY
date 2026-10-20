import { calculatePerDay } from '@/lib/calculateServicePrice';
export default function traditionalVideography(days: number, rate: number) {
  return calculatePerDay(days, rate);
}
