interface BookingSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BookingSearch({
  value,
  onChange,
}: BookingSearchProps) {
  return (
    <input
      type="text"
      placeholder="Search booking, customer, phone..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
    />
  );
}