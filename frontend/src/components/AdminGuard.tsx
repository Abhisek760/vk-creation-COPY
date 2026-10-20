'use client';

import React from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  // 🔥 PURANA USERNAME/PASSWORD FORM HATA DIYA GAYA HAI
  // Direct children Render honge taaki Firebase Auth system (admin/page.tsx) control le sake.
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {children}
    </div>
  );
}