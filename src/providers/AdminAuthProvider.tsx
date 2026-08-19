"use client";

import { type ReactNode, useEffect } from "react";

import { recoverAdminSession } from "@/lib/auth/recoverAdminSession";

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void recoverAdminSession();
  }, []);

  return children;
}
