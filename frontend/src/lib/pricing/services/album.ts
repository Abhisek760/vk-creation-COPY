import { calculateFixed } from '@/lib/calculateServicePrice';
export default function album(rate: number) {
  return calculateFixed(rate);
}
