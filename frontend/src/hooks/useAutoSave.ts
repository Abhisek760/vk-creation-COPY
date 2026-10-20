"use client";

import { useEffect, useRef } from "react";

import { BuilderState } from "@/types/builder";
import { saveDraft } from "@/lib/storage/builderDraft";

export function useAutoSave(
  builder: BuilderState
) {
  const timeout = useRef<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      saveDraft(builder);
    }, 3000);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [builder]);
}