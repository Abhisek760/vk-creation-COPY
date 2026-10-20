"use client";

interface ServiceSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ServiceSearch({
  value,
  onChange,
}: ServiceSearchProps) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="🔍 Search services..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#161b22] px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-yellow-400"
      />
    </div>
  );
}