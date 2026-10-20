"use client";

import React, { useState } from "react";
import { Booking } from "@/types/booking";
import { generateInvoicePdf } from "@/lib/pdf/generateInvoicePdf";
import { toast } from "@/lib/toast";

interface DownloadInvoiceButtonProps {
  booking: Booking;
  className?: string;
}

export const DownloadInvoiceButton: React.FC<DownloadInvoiceButtonProps> = ({
  booking,
  className = "px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-medium flex items-center gap-2",
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      await generateInvoicePdf(booking);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error generating invoice PDF:", error);
      toast.error("Failed to generate invoice PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={className}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      {isGenerating ? "Generating..." : "Download Invoice"}
    </button>
  );
};

export default DownloadInvoiceButton;