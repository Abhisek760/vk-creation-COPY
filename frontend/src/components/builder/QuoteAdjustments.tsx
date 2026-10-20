"use client";

interface QuoteAdjustmentsProps {
  discount: number;
  gstEnabled: boolean;
  onDiscountChange: (discount: number) => void;
  onGSTChange: (enabled: boolean) => void;
}

export default function QuoteAdjustments({
  discount,
  gstEnabled,
  onDiscountChange,
  onGSTChange,
}: QuoteAdjustmentsProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-semibold">
        Quote Adjustments
      </h2>

      <div className="mt-6 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Discount (₹)
          </label>

          <input
            type="number"
            min={0}
            value={discount}
            onChange={(e) =>
              onDiscountChange(Number(e.target.value))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Enter discount"
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={gstEnabled}
            onChange={(e) =>
              onGSTChange(e.target.checked)
            }
            className="h-5 w-5 accent-blue-600"
          />

          <span className="text-sm font-medium">
            Apply 18% GST
          </span>
        </label>
      </div>
    </div>
  );
}