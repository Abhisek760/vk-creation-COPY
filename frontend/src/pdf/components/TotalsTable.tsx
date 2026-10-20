import { formatCurrency } from "@/lib/formatCurrency";

interface TotalsTableProps {
  subtotal: number;
  discount: number;
  gst: number;
  grandTotal: number;
}

export default function TotalsTable({
  subtotal,
  discount,
  gst,
  grandTotal,
}: TotalsTableProps) {
  return (
    <div className="mt-10 flex justify-end">
      <div className="w-[360px] overflow-hidden rounded-xl border border-gray-300 shadow-sm">
        <div className="bg-blue-600 px-5 py-3">
          <h3 className="text-lg font-semibold text-white">
            Price Summary
          </h3>
        </div>

        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b">
              <td className="px-5 py-3">
                Subtotal
              </td>

              <td className="px-5 py-3 text-right font-medium">
                {formatCurrency(subtotal)}
              </td>
            </tr>

            <tr className="border-b">
              <td className="px-5 py-3">
                Discount
              </td>

              <td className="px-5 py-3 text-right font-medium text-red-600">
                - {formatCurrency(discount)}
              </td>
            </tr>

            <tr className="border-b">
              <td className="px-5 py-3">
                GST
              </td>

              <td className="px-5 py-3 text-right font-medium">
                {formatCurrency(gst)}
              </td>
            </tr>

            <tr className="bg-blue-50">
              <td className="px-5 py-4 text-base font-bold">
                Grand Total
              </td>

              <td className="px-5 py-4 text-right text-lg font-bold text-blue-700">
                {formatCurrency(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}