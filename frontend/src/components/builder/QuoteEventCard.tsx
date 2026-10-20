"use client";

import {
  CalendarDays,
  Heart,
  UserRound,
  MapPin,
  Building2,
} from "lucide-react";

import { BuilderState } from "@/types/builder";
import EmptyState from "@/components/common/EmptyState";

interface QuoteEventCardProps {
  event: BuilderState["event"];
}

export default function QuoteEventCard({
  event,
}: QuoteEventCardProps) {
  const hasEvent =
    event.eventType ||
    event.eventDate ||
    event.brideName ||
    event.groomName ||
    event.venue ||
    event.city;

  if (!hasEvent) {
    return (
      <EmptyState
        icon={<Heart size={28} />}
        title="Wedding Details Missing"
        description="Fill event information to preview it here."
      />
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#161b22] p-5 shadow-lg">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400">
          <Heart size={22} />
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Wedding Details
          </h3>

          <p className="text-xs text-gray-400">
            Event Information
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {event.eventType && (
          <div className="flex items-center gap-3">
            <Heart size={16} className="text-gray-500" />
            <span className="text-sm text-gray-200">
              {event.eventType}
            </span>
          </div>
        )}

        {event.eventDate && (
          <div className="flex items-center gap-3">
            <CalendarDays size={16} className="text-gray-500" />
            <span className="text-sm text-gray-200">
              {event.eventDate}
            </span>
          </div>
        )}

        {event.brideName && (
          <div className="flex items-center gap-3">
            <Heart size={16} className="text-gray-500" />
            <span className="text-sm text-gray-200">
              Bride: {event.brideName}
            </span>
          </div>
        )}

        {event.groomName && (
          <div className="flex items-center gap-3">
            <UserRound size={16} className="text-gray-500" />
            <span className="text-sm text-gray-200">
              Groom: {event.groomName}
            </span>
          </div>
        )}

        {event.venue && (
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-gray-500" />
            <span className="text-sm text-gray-200">
              {event.venue}
            </span>
          </div>
        )}

        {event.city && (
          <div className="flex items-center gap-3">
            <Building2 size={16} className="text-gray-500" />
            <span className="text-sm text-gray-200">
              {event.city}
              {event.state ? `, ${event.state}` : ""}
            </span>
          </div>
        )}

        {event.pincode && (
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-gray-500" />
            <span className="text-sm text-gray-200">
              PIN: {event.pincode}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}