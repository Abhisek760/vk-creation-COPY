import { ReactNode } from "react";

interface Props {
  title: string;

  value: string | number;

  icon: ReactNode;

  color: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#161b22] p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h2>
        </div>

        <div
          className={`rounded-xl p-4 ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}