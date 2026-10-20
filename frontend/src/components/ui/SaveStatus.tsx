"use client";

import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from "lucide-react";

import { SaveStatusType } from "@/hooks/useSaveStatus";

interface Props {
  status: SaveStatusType;
  lastSaved?: Date | null;
}

export default function SaveStatus({
  status,
  lastSaved,
}: Props) {
  if (status === "idle" && !lastSaved) {
    return null;
  }

  if (status === "saving") {
    return (
      <div className="flex items-center justify-between rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
        <div className="flex items-center gap-2">
          <Loader2
            size={18}
            className="animate-spin"
          />

          Saving quotation...
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        <AlertCircle size={18} />

        Failed to save quotation
      </div>
    );
  }

  if (status === "saved") {
    return (
      <div className="flex items-center justify-between rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} />

          Saved Successfully
        </div>

        {lastSaved && (
          <div className="flex items-center gap-1 text-xs opacity-80">
            <Clock3 size={14} />

            {lastSaved.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-500/30 bg-gray-500/10 px-4 py-3 text-sm text-gray-300">
      <Clock3 size={18} />

      Last Saved{" "}
      {lastSaved?.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </div>
  );
}