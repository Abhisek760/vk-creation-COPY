"use client";

import { useCallback, useState } from "react";

export type SaveStatusType =
  | "idle"
  | "saving"
  | "saved"
  | "error";

export function useSaveStatus() {
  const [status, setStatus] =
    useState<SaveStatusType>("idle");

  const [lastSaved, setLastSaved] =
    useState<Date | null>(null);

  const saving = useCallback(() => {
    setStatus("saving");
  }, []);

  const saved = useCallback(() => {
    setStatus("saved");

    setLastSaved(new Date());

    setTimeout(() => {
      setStatus("idle");
    }, 2500);
  }, []);

  const error = useCallback(() => {
    setStatus("error");

    setTimeout(() => {
      setStatus("idle");
    }, 3000);
  }, []);

  return {
    status,
    lastSaved,
    saving,
    saved,
    error,
  };
}