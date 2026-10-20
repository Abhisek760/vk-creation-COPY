"use client";

import { company } from "@/config/company";

export default function BrandSettingsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-bold">
        Studio Branding
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Current branding configuration
      </p>

      <div className="mt-6 space-y-4">

        <Field
          label="Studio Name"
          value={company.name}
        />

        <Field
          label="Tagline"
          value={company.tagline}
        />

        <Field
          label="Phone"
          value={company.phone}
        />

        <Field
          label="Email"
          value={company.email}
        />

        <Field
          label="Website"
          value={company.website}
        />

        <Field
          label="Address"
          value={company.address}
        />

      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
}

function Field({
  label,
  value,
}: FieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-600">
        {label}
      </label>

      <input
        value={value}
        readOnly
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          bg-slate-50
          px-4
          py-3
          text-slate-700
        "
      />
    </div>
  );
}