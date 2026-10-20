interface AdminCardProps {
  title: string;
  description: string;
}

export default function AdminCard({
  title,
  description,
}: AdminCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}