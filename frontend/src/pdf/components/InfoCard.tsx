import { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  children: ReactNode;
}

export default function InfoCard({
  title,
  children,
}: InfoCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
      <div className="border-b bg-blue-600 px-5 py-3">
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
      </div>

      <div className="space-y-3 p-5 text-sm leading-6 text-gray-700">
        {children}
      </div>
    </section>
  );
}