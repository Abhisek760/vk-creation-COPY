"use client";

interface PricingAndPaymentFormProps {
  discount: number;
  gstEnabled: boolean;
  advancePaid: number;

  onDiscountChange: (discount: number) => void;
  onGSTChange: (enabled: boolean) => void;
  onAdvancePaidChange: (amount: number) => void;
}

export default function PricingAndPaymentForm({
  discount,
  gstEnabled,
  advancePaid,
  onDiscountChange,
  onGSTChange,
  onAdvancePaidChange,
}: PricingAndPaymentFormProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#161b22] p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Pricing & Payment
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Configure discount, tax and booking amount.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Discount (₹)
          </label>

          <input
            type="number"
            min={0}
            value={discount}
            onChange={(e) =>
              onDiscountChange(Number(e.target.value))
            }
            placeholder="0"
            className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-4 py-3 text-white outline-none transition focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Advance Paid (₹)
          </label>

          <input
            type="number"
            min={0}
            value={advancePaid}
            onChange={(e) =>
              onAdvancePaidChange(Number(e.target.value))
            }
            placeholder="0"
            className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-4 py-3 text-white outline-none transition focus:border-yellow-400"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0f172a] p-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">
                Apply GST
              </p>

              <p className="text-sm text-gray-400">
                Add 18% GST to quotation
              </p>
            </div>

            <input
              type="checkbox"
              checked={gstEnabled}
              onChange={(e) =>
                onGSTChange(e.target.checked)
              }
              className="h-5 w-5 accent-yellow-400"
            />
          </label>
        </div>
      </div>
    </div>
  );
}