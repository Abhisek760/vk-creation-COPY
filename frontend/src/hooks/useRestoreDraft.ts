"use client";

import { useEffect } from "react";

import { BuilderState } from "@/types/builder";
import { loadDraft } from "@/lib/storage/builderDraft";

export function useRestoreDraft(
  loadBuilder: (builder: BuilderState) => void
) {
  useEffect(() => {
    const draft = loadDraft();

    if (!draft) return;

    loadBuilder(draft);
  }, [loadBuilder]);
}