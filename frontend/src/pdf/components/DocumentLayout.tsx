import { ReactNode } from "react";

interface DocumentLayoutProps {
  children: ReactNode;
}

export default function DocumentLayout({
  children,
}: DocumentLayoutProps) {
  return (
    <div className="flex justify-center bg-slate-100 py-10">
      <div
        className="
          w-full
          max-w-[210mm]
          min-h-[297mm]
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-2xl
          overflow-hidden

          print:max-w-none
          print:rounded-none
          print:border-0
          print:shadow-none
        "
      >
        <div className="p-12">
          {children}
        </div>
      </div>
    </div>
  );
}