export function calculateFinalQuote(builder: any): any {
  if (!builder || !Array.isArray(builder.services)) {
    return { subtotal: 0, grandTotal: 0 };
  }
  const subtotal = builder.services.reduce((sum: number, service: any) => {
    return sum + Number(service?.price || service?.calculatedPrice || 0);
  }, 0);
  return { subtotal, grandTotal: subtotal };
}
