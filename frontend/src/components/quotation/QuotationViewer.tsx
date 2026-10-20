"use client";

import React from "react";
import { Quote } from "@/types/quote";
import { companyConfig } from "@/config/company";
import { formatCurrency } from "@/lib/formatCurrency";

interface QuotationViewerProps {
  quote: Quote;
  onDownloadPdf?: () => void;
}

export const QuotationViewer: React.FC<QuotationViewerProps> = ({
  quote,
  onDownloadPdf,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 max-w-4xl mx-auto my-6 text-stone-800">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-stone-200 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            {companyConfig.name}
          </h1>
          <p className="text-sm text-stone-500 mt-1">{companyConfig.tagline}</p>
        </div>
        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold uppercase tracking-wider">
            Quotation
          </span>
          <p className="text-xs text-stone-400 mt-2">
            Quote ID: <span className="font-mono text-stone-700">{quote.id || "Draft"}</span>
          </p>
        </div>
      </div>

      {/* Customer & Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-stone-50 p-4 rounded-xl">
        <div>
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
            Prepared For
          </h3>
          <p className="font-semibold text-stone-900">{quote.customer?.name || "Client Name N/A"}</p>
          <p className="text-sm text-stone-600">{quote.customer?.email || "Email N/A"}</p>
          <p className="text-sm text-stone-600">{quote.customer?.phone || "Phone N/A"}</p>
        </div>
        <div>
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
            Event Information
          </h3>
          <p className="text-sm text-stone-700">
            <span className="font-medium">Type:</span> {quote.event?.eventType || "N/A"}
          </p>
          <p className="text-sm text-stone-700">
            <span className="font-medium">Location:</span> {quote.event?.location || "N/A"}
          </p>
          <p className="text-sm text-stone-700">
            <span className="font-medium">Date:</span> {quote.event?.startDate || "N/A"}
          </p>
        </div>
      </div>

      {/* Services Table */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
          Selected Services
        </h3>
        <div className="border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-100 text-stone-600 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {quote.services && quote.services.length > 0 ? (
                quote.services.map((service, idx) => (
                  <tr key={service.id || idx}>
                    <td className="py-3 px-4 font-medium text-stone-900">{service.name}</td>
                    <td className="py-3 px-4 text-stone-500 text-xs">
                      {service.notes || "Standard coverage"}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-stone-900">
                      {formatCurrency(service.calculatedPrice || 0)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-stone-400 italic">
                    No services added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-full md:w-1/2 space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200">
          <div className="flex justify-between text-sm text-stone-600">
            <span>Subtotal</span>
            <span>{formatCurrency(quote.totals?.subtotal || 0)}</span>
          </div>
          {quote.totals?.discount ? (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Discount</span>
              <span>-{formatCurrency(quote.totals.discount)}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-base font-bold text-stone-900 border-t border-stone-200 pt-2 mt-2">
            <span>Grand Total</span>
            <span className="text-amber-700">{formatCurrency(quote.totals?.grandTotal || 0)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {onDownloadPdf && (
        <div className="flex justify-end pt-4 border-t border-stone-200">
          <button
            onClick={onDownloadPdf}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition shadow-md flex items-center gap-2"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default QuotationViewer;