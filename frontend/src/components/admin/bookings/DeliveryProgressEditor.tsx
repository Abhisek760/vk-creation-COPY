'use client';

import React from "react";
import { DeliveryProgress } from "@/types/booking";

interface DeliveryProgressEditorProps {
  progress?: DeliveryProgress;
  onProgressChange: (key: keyof DeliveryProgress, value: boolean) => void;
}

export const DeliveryProgressEditor: React.FC<DeliveryProgressEditorProps> = ({
  progress = {},
  onProgressChange,
}) => {
  const items: DeliveryProgress = progress || {};

  const labels: Record<keyof DeliveryProgress, string> = {
    rawPhotosDelivered: "Raw Photos Delivered",
    editedPhotosDelivered: "Edited Photos Delivered",
    videoTeaserDelivered: "Video Teaser Delivered",
    fullVideoDelivered: "Full Video Delivered",
    albumPrinted: "Album Printed",
  };

  const keys = Object.keys(labels) as Array<keyof DeliveryProgress>;

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
        Delivery Progress Tracker
      </h3>

      <div className="space-y-2 text-sm text-stone-700">
        {keys.map((key) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!items[key]}
              onChange={(e) => onProgressChange(key, e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
            <span>{labels[key]}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default DeliveryProgressEditor;
