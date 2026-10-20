import { company } from "@/config/company";
interface DocumentHeaderProps {
  title: string;
}

export default function DocumentHeader({
  title,
}: DocumentHeaderProps) {
  return (
    <header className="border-b-4 border-blue-600 pb-8">
      <div className="flex items-start justify-between">
        <div>
<h1 className="text-4xl font-bold">
  {company.name}
</h1>

<p className="mt-2 text-gray-500">
  {company.tagline}
</p>

          <p className="mt-1 text-sm text-gray-500">
            Professional Wedding Storytelling
          </p>
        </div>

        <div className="text-right">
          <h2 className="text-2xl font-bold uppercase text-gray-800">
            {title}
          </h2>

          <div className="mt-2 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
            Premium Wedding Quotation
          </div>
        </div>
      </div>
    </header>
  );
}