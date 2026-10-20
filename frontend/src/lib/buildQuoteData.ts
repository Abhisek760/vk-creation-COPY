export function buildQuoteData(builder: any): any {
  return {
    ...builder,
    quoteNumber: builder?.quoteNumber || builder?.id || 'DRAFT',
    quoteDate: builder?.quoteDate || new Date().toISOString(),
    validTill: builder?.validTill || new Date(Date.now() + 7 * 86400000).toISOString(),
    customer: builder?.customer || { name: builder?.customerName || '', email: builder?.customerEmail || '', phone: builder?.customerPhone || '' },
    services: builder?.services || [],
  };
}
