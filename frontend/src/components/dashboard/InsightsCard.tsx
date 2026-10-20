import { DashboardStats } from "@/types/dashboard";

interface Props {
  stats: DashboardStats;
}

export default function InsightsCard({
  stats,
}: Props) {
  const avg =
    stats.totalQuotes === 0
      ? 0
      : Math.round(
          stats.totalRevenue / stats.totalQuotes
        );

  return (
    <div className="rounded-2xl border border-white/10 bg-[#161b22] p-6">
      <h2 className="mb-5 text-xl font-semibold text-white">
        Insights
      </h2>

      <div className="space-y-4 text-sm">

        <div className="flex justify-between">
          <span className="text-gray-400">
            Average Deal
          </span>

          <span className="font-semibold text-green-400">
            ₹{avg.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">
            Quotes Created
          </span>

          <span className="text-white">
            {stats.totalQuotes}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">
            Highest Sale
          </span>

          <span className="text-yellow-400">
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