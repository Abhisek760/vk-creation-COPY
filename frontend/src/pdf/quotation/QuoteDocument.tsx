'use client';
import React from 'react';

export const QuoteDocument = ({ quote = {} }: { quote: any }) => {
  const cust = quote?.customer || {};
  const evt = quote?.event || {};
  const deliv = quote?.deliverables || {};
  const agree = quote?.agreement || {};

  return (
    <div className="p-8 bg-stone-900 text-stone-100 space-y-6">
      <h1 className="text-xl font-bold">Quote: {quote?.quoteNumber || 'DRAFT'}</h1>
      <div>Customer: {cust?.name || quote?.customerName || '-'} | Phone: {cust?.phone || quote?.customerPhone || '-'}</div>
      <div>Event: {evt?.eventType || '-'} | Date: {evt?.eventDate || '-'}</div>
      <div>Total: ?{Number(quote?.grandTotal || 0).toLocaleString('en-IN')}</div>
    </div>
  );
};
export default QuoteDocument;
