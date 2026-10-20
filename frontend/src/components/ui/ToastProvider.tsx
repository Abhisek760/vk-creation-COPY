"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand
      duration={3000}
      toastOptions={{
        style: {
          borderRadius: "14px",
          fontSize: "14px",
        },
      }}
    />
  );
}