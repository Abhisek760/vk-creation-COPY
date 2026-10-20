export function calculatePerDay(days: number, rate: number) {
  return { total: (days || 1) * (rate || 0) };
}

export function calculatePerHour(hours: number, rate: number) {
  return { total: (hours || 1) * (rate || 0) };
}

export function calculatePerPhoto(count: number, rate: number) {
  return { total: (count || 1) * (rate || 0) };
}

export function calculatePerReel(count: number, rate: number) {
  return { total: (count || 1) * (rate || 0) };
}

export function calculateFixed(rate: number) {
  return { total: rate || 0 };
}

export function calculateServicePrice(service: any): number {
  if (!service) return 0;
  if (typeof service.calculatedPrice === 'number') return service.calculatedPrice;
  if (typeof service.price === 'number') return service.price;

  const type = service.pricingType || service.type;
  const rate = service.rate || service.amount || 0;

  if (type === 'per_day') return calculatePerDay(service.days || 1, rate).total;
  if (type === 'per_hour') return calculatePerHour(service.hours || 1, rate).total;
  if (type === 'per_photo') return calculatePerPhoto(service.count || 1, rate).total;
  if (type === 'per_reel') return calculatePerReel(service.count || 1, rate).total;

  return calculateFixed(rate).total;
}

export default calculateServicePrice;
