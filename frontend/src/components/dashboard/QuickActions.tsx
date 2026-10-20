import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#161b22] p-6">

      <h2 className="mb-6 text-xl font-semibold text-white">
        Quick Actions
      </h2>

      <div className="grid gap-4">

        <Link
          href="/builder"
          className="rounded-xl bg-blue-600 px-5 py-3 text-center font-medium text-white transition hover:bg-blue-700"
        >
          Create New Quote
        </Link>

        <Link
          href="/builder/saved"
          className="rounded-xl bg-green-600 px-5 py-3 text-center font-medium text-white transition hover:bg-green-700"
        >
          Saved Quotations
        </Link>

      </div>

    </div>
  );
}