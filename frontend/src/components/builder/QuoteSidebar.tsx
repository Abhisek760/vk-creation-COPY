'use client';

import React from "react";
import QuoteStatusCard from "./QuoteStatusCard";
import QuoteActions from "./QuoteActions";

interface QuoteSidebarProps {
  builder?: any;
  dirty?: boolean;
  markSaved?: () => void;
  saveStatus?: any;
}

export const QuoteSidebar: React.FC<QuoteSidebarProps> = ({
  builder = {},
  dirty = false,
  markSaved,
  saveStatus,
}) => {
  const quoteNum = builder.quoteNumber || builder.id || "DRAFT";
  const quoteDateVal = builder.quoteDate || builder.createdAt || new Date().toISOString();
  const validTillVal = builder.validTill || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return (
    <div className="space-y-6">
      {/* Quote Status */}
      <QuoteStatusCard
        quoteNumber={quoteNum}
        quoteDate={quoteDateVal}
        validTill={validTillVal}
      />

      {/* Actions */}
      <QuoteActions
        {...({
          builder,
          dirty,
          markSaved,
          saveStatus,
        } as any)}
      />
    </div>
  );
};

export default QuoteSidebar;