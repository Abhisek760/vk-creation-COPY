"use client";

import { ServiceRepository } from "@/lib/repositories/serviceRepository";
import { SelectedService } from "@/types/builder";

import { calculateServicePrice } from "@/lib/calculateServicePrice";
import { formatCurrency } from "@/lib/formatCurrency";

interface ServicesTableProps {
  services: SelectedService[];
}

export default function ServicesTable({
  services,
}: ServicesTableProps) {
  const masterServices =
    ServiceRepository.getAll();

  return (
    <table className="mt-6 w-full border-collapse border border-gray-300 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-3 text-left">
            Service
          </th>

          <th className="border p-3 text-center">
            Amount
          </th>
        </tr>
      </thead>

      <tbody>
        {services.map((service) => {
          const master = masterServices.find(
            (item) =>
              item.id === service.serviceId
          );

          return (
            <tr key={service.serviceId}>
              <td className="border p-3 font-medium">
                {master?.title ??
                  service.serviceId}
              </td>

              <td className="border p-3 text-right font-semibold">
                {formatCurrency(
                  calculateServicePrice(service)
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}