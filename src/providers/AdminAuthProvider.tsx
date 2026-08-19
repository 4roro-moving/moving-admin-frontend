"use client";

import { type ReactNode, useLayoutEffect } from "react";

import { recoverAdminSession } from "@/lib/auth/recoverAdminSession";

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    void recoverAdminSession();
  }, []);

  return children;
}
