"use client";

import { useEffect, useState } from "react";

export function useUnsavedChanges(
  dependencies: unknown[]
) {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(true);
  }, dependencies);

  const markSaved = () => setDirty(false);

  return {
    dirty,
    markSaved,
  };
}