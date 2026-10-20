"use client";

import { memo, useId } from "react";
import { InputField } from "@/config/pricing";

interface InputRendererProps {
  field: InputField;
  value: unknown;
  onChange: (value: unknown) => void;
}

function InputRenderer({
  field,
  value,
  onChange,
}: InputRendererProps) {
  const inputId = useId();

  switch (field.type) {
    case "number":
      return (
        <div>
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {field.label}
          </label>

          <input
            id={inputId}
            type="number"
            placeholder={field.placeholder}
            value={Number(value ?? "")}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-600"
          />
        </div>
      );

    case "select":
      return (
        <div>
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {field.label}
          </label>

          <select
            id={inputId}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-600"
          >
            {field.options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-3">
          <input
            id={inputId}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-5 w-5"
          />

          <label
            htmlFor={inputId}
            className="cursor-pointer text-gray-700"
          >
            {field.label}
          </label>
        </div>
      );

    default:
      return null;
  }
}

export default memo(InputRenderer);