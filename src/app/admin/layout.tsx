"use client";

import AdminShell from "@/components/admin/AdminShell";
import { AuthProvider } from "@/contexts/AuthContext";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
