"use client";

import { useEffect, useState } from "react";

import { getLastSavedTime } from "@/lib/storage/builderDraft";

export function useLastSaved() {
  const [lastSaved, setLastSaved] =
    useState<string>("");

  useEffect(() => {
    const update = () => {
      const value = getLastSavedTime();

      if (!value) {
        setLastSaved("");
        return;
      }

      setLastSaved(value);
    };

    update();

    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, []);

  return lastSaved;
}