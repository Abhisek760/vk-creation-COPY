import { ReactNode } from "react";

interface ServiceSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ServiceSection({
  title,
  description,
  children,
}: ServiceSectionProps) {
  return (
    <section className="mb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="mt-2 text-gray-600">
          {description}
        </p>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}