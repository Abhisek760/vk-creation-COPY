"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  FileSignature,
  FileText,
  Receipt,
  Package,
  Boxes,
  Camera,
  Sparkles
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings & Requests", href: "/admin/bookings", icon: CalendarCheck },
  { name: "Shoots & Operations", href: "/admin/shoots", icon: Camera },
  { name: "Agreements & Contracts", href: "/admin/agreement", icon: FileSignature },
  { name: "Invoices", href: "/admin/invoices", icon: FileText },
  { name: "Receipts Ledger", href: "/admin/receipts", icon: Receipt },
  { name: "Packages", href: "/admin/packages", icon: Package },
  { name: "Services Catalog", href: "/admin/services", icon: Boxes },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-stone-950 border-r border-stone-800/80 min-h-screen p-4 flex flex-col font-sans">
      <div className="mb-8 px-3 pt-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-black text-white tracking-wider uppercase font-mono">
            VK_Creation
          </h2>
        </div>
        <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-0.5">
          VIP Studio Control Center
        </p>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/5"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-900"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-stone-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-stone-800/80 px-3 text-[10px] text-stone-500 font-mono">
        <p className="font-bold text-stone-400">Owner: Ashutosh Vishwakarma</p>
        <p className="text-[9px] text-stone-600 mt-0.5">VK_Creation Studio Engine v2.0</p>
      </div>
    </aside>
  );
}