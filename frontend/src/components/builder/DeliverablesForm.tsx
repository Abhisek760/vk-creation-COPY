'use client';

import React from "react";

interface DeliverableItem {
  key: string;
  label: string;
  enabled?: boolean;
}

interface DeliverablesFormProps {
  items?: DeliverableItem[];
  deliverables?: Record<string, boolean>;
  onChange?: (keyOrValues: any, value?: boolean) => void;
  onToggle?: (key: string) => void;
}

export const DeliverablesForm: React.FC<DeliverablesFormProps> = ({
  items = [],
  deliverables = {},
  onChange,
  onToggle,
}) => {
  const handleCheckChange = (itemKey: string, checked: boolean) => {
    if (onChange) {
      // Handles both object-style (updateDeliverables({ [key]: val })) 
      // and direct key-value style (onChange(key, val))
      try {
        onChange({ [itemKey]: checked });
      } catch {
        onChange(itemKey, checked);
      }
    }
    if (onToggle) {
      onToggle(itemKey);
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const itemKey = String(item.key || idx);
        const isChecked = deliverables[itemKey] ?? !!item.enabled;

        return (
          <label
            key={itemKey}
            className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-800 bg-stone-900/50 p-4 transition hover:border-stone-700"
          >
            <div className="flex items-center gap-3 text-white">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleCheckChange(itemKey, e.target.checked)}
                className="h-4 w-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default DeliverablesForm;
