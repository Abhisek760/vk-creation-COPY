
import { BuilderState } from "@/types/builder";

const DRAFT_KEY = "vkcreation_builder_draft";

export function saveDraft(builder: BuilderState) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify(builder)
  );

  localStorage.setItem(
    `${DRAFT_KEY}_time`,
    new Date().toISOString()
  );
}

export function loadDraft(): BuilderState | null {
  if (typeof window === "undefined") return null;

  const draft = localStorage.getItem(DRAFT_KEY);

  if (!draft) return null;

  try {
    return JSON.parse(draft);
  } catch {
    return null;
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(`${DRAFT_KEY}_time`);
}

export function getLastSavedTime() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(
    `${DRAFT_KEY}_time`
  );
}