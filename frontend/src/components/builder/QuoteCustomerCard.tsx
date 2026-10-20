"use client";

import {
  User,
  Phone,
  Mail,
} from "lucide-react";

import { BuilderState } from "@/types/builder";
import EmptyState from "@/components/common/EmptyState";

interface QuoteCustomerCardProps {
  customer: BuilderState["customer"];
}

export default function QuoteCustomerCard({
  customer,
}: QuoteCustomerCardProps) {
  const hasCustomer =
    customer.name ||
    customer.phone ||
    customer.email;

  if (!hasCustomer) {
    return (
      <EmptyState
        icon={<User size={28} />}
        title="No Customer Added"
        description="Enter customer details to display them here."
      />
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#161b22] p-5 shadow-lg">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
          <User size={22} />
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Customer
          </h3>

          <p className="text-xs text-gray-400">
            Client Information
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {customer.name && (
          <div className="flex items-center gap-3">
            <User size={16} className="text-gray-500" />
            <span className="text-sm text-gray-200">
              {customer.name}
            </span>
          </div>
        )}

        {customer.phone && (
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-gray-500" />
            <span className="text-sm text-gray-200">
              {customer.phone}
            </span>
          </div>
        )}

        {customer.email && (
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-gray-500" />
            <span className="break-all text-sm text-gray-200">
              {customer.email}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}