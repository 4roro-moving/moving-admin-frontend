"use client";

import type { ReactNode } from "react";

import AdminAuthProvider from "./AdminAuthProvider";
import QueryProvider from "./QueryProvider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AdminAuthProvider>{children}</AdminAuthProvider>
    </QueryProvider>
  );
}
