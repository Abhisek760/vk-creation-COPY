import { DashboardStats } from "@/types/dashboard";

interface Props {
  stats: DashboardStats;
}

export default function RevenueCard({
  stats,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#161b22] p-6">
      <h2 className="text-xl font-semibold text-white">
        Revenue Overview
      </h2>

      <div className="mt-6 space-y-4">

        <div className="flex justify-between">
          <span className="text-gray-400">
            Total Revenue
          </span>

          <span className="font-semibold text-green-400">
            ₹
            {stats.totalRevenue.toLocaleString(
              "en-IN"
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">
            Average Quote
          </span>

          <span className="font-semibold text-blue-400">
            ₹
            {stats.averageQuote.toLocaleString(
              "en-IN"
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">
            Highest Quote
          </span>

          <span className="font-semibold text-yellow-400">
            ₹
            {stats.highestQuote.toLocaleString(
              "en-IN"
            )}
          </span>
        </div>

      </div>
    </div>
  );
}