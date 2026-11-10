"use client";

import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { AuthProvider } from "@/contexts/AuthContext";

export default function AdminProviders({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}