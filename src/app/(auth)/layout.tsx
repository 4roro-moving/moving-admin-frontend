import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-5 py-7 sm:px-8 sm:py-8 lg:px-10">
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-[0.08em] text-[#262524]">
            MOVING ADMIN
          </p>
          <p className="text-muted text-xs font-medium">관리자 영역</p>
        </div>

        <div className="flex flex-1 items-center justify-center py-10 sm:py-12">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
