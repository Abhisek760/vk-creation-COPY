import { company } from "@/config/company";


export default function DocumentFooter() {
  return (
    <footer className="mt-16 border-t pt-6 text-center text-sm text-gray-500">
      Thank you for choosing {company.name}.

      <div className="mt-2">
        {company.website}
      </div>

      <div>
        {company.phone}
      </div>

      <div>
        {company.email}
      </div>
    </footer>
  );
}