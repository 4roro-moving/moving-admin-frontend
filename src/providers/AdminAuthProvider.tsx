"use client";

import type { ReactNode } from "react";

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
  // TODO: Refresh Cookie 기반 세션 복구와 ADMIN 역할 검증을 여기서 연결합니다.
  return children;
}
