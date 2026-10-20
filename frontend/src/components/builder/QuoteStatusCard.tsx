"use client";

import {
  FileText,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

interface QuoteStatusCardProps {
  quoteNumber: string;
  quoteDate: string;
  validTill: string;
}

export default function QuoteStatusCard({
  quoteNumber,
  quoteDate,
  validTill,
}: QuoteStatusCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#161b22] p-5 shadow-lg">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/20 text-yellow-400">
          <FileText size={22} />
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Quote Status
          </h3>

          <p className="text-xs text-gray-400">
            Draft Quotation
          </p>
        </div>
      </div>

      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <span className="text-gray-400">
            Status
          </span>

          <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-400">
            Draft
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400">
            Quote No.
          </span>

          <span className="font-medium text-white">
            {quoteNumber}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-400">
            <CalendarDays size={15} />
            Created
          </span>

          <span className="text-white">
            {quoteDate}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-400">
            <ShieldCheck size={15} />
            Valid Till
          </span>

          <span className="text-white">
            {validTill}
          </span>
        </div>

      </div>
    </div>
  );
}