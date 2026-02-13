"use client";

import { AuthProvider } from "@/contexts/AuthContext";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
