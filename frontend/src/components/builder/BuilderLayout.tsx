import { ReactNode } from "react";

interface BuilderLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export default function BuilderLayout({
  children,
  sidebar,
}: BuilderLayoutProps) {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-12">

      {/* Left Content */}

      <div className="space-y-8 lg:col-span-8">
        {children}
      </div>

      {/* Right Sidebar */}

      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-6">
          {sidebar}
        </div>
      </aside>

    </section>
  );
}