import {
  FileText,
  IndianRupee,
  BarChart3,
  Trophy,
} from "lucide-react";

import { DashboardStats } from "@/types/dashboard";

import StatCard from "./StatCard";

interface Props {
  stats: DashboardStats;
}

export default function StatsGrid({
  stats,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Quotes"
        value={stats.totalQuotes}
        icon={<FileText className="text-white" />}
        color="bg-blue-600"
      />

      <StatCard
        title="Total Revenue"
        value={`₹${stats.totalRevenue.toLocaleString(
          "en-IN"
        )}`}
        icon={
          <IndianRupee className="text-white" />
        }
        color="bg-green-600"
      />

      <StatCard
        title="Average Quote"
        value={`₹${stats.averageQuote.toLocaleString(
          "en-IN"
        )}`}
        icon={<BarChart3 className="text-white" />}
        color="bg-violet-600"
      />

      <StatCard
        title="Highest Quote"
        value={`₹${stats.highestQuote.toLocaleString(
          "en-IN"
        )}`}
        icon={<Trophy className="text-white" />}
        color="bg-amber-500"
      />
    </div>
  );
}