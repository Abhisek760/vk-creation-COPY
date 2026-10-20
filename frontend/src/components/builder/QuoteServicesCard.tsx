"use client";

import {
  Camera,
  CircleCheckBig,
} from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import { ServiceRepository } from "@/lib/repositories/serviceRepository";
import { SelectedService } from "@/types/builder";
import { formatCurrency } from "@/lib/formatCurrency";

interface QuoteServicesCardProps {
  services: (SelectedService & {
    price: number;
  })[];
}

export default function QuoteServicesCard({
  services,
}: QuoteServicesCardProps) {
  const masterServices =
    ServiceRepository.getAll();

  if (services.length === 0) {
    return (
      <EmptyState
        icon={<Camera size={28} />}
        title="No Services Selected"
        description="Choose services to calculate the quotation."
      />
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#161b22] p-5 shadow-lg">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
          <Camera size={22} />
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Selected Services
          </h3>

          <p className="text-xs text-gray-400">
            {services.length} service
            {services.length > 1 ? "s" : ""} selected
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {services.map((selected) => {
          const service = masterServices.find(
            (item) =>
              item.id === selected.serviceId
          );

          return (
            <div
              key={selected.serviceId}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0f172a] p-3"
            >
              <div className="flex items-center gap-3">
                <CircleCheckBig
                  size={18}
                  className="text-green-400"
                />

                <div>
                  <p className="font-medium text-white">
                    {service?.title ??
                      selected.serviceId}
                  </p>

                  <p className="text-xs text-gray-400">
                    Included
                  </p>
                </div>
              </div>

              <span className="font-semibold text-yellow-400">
                {formatCurrency(selected.price)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}