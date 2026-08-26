"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { loginAdmin } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getAdminHomeRoute } from "@/lib/auth/adminRole";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

const adminLoginSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

const authCardClassName =
  "border-border bg-surface w-full rounded-2xl border px-5 py-7 shadow-sm sm:px-8 sm:py-8";

const authInputClassName =
  "border-border bg-surface text-foreground placeholder:text-text-placeholder h-12 w-full rounded-xl border px-4 text-sm outline-none transition-[border-color,box-shadow] focus:border-border-brand focus:shadow-input";

export default function AdminLoginPage() {
  const router = useRouter();
  const establishSession = useAdminAuthStore((state) => state.establishSession);
  const isCheckingAuth = useAdminAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const userRole = useAdminAuthStore((state) => state.user?.role);
  const adminRole = useAdminAuthStore((state) => state.user?.adminRole);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isCheckingAuth) {
      return;
    }

    if (isAuthenticated && userRole === "ADMIN") {
      router.replace(getAdminHomeRoute(adminRole));
    }
  }, [adminRole, isAuthenticated, isCheckingAuth, router, userRole]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    setErrorMessage(null);

    try {
      const session = await loginAdmin(values);
      establishSession({
        user: session.user,
        accessToken: session.accessToken,
      });
      router.replace(getAdminHomeRoute(session.user.adminRole));
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "로그인에 실패했습니다."));
    }
  };

  if (isCheckingAuth) {
    return (
      <section className={`${authCardClassName} text-muted`}>
        <div className="flex min-h-[260px] items-center justify-center">
          <p className="text-sm font-medium">관리자 세션을 확인하는 중입니다...</p>
        </div>
      </section>
    );
  }

  if (isAuthenticated && userRole === "ADMIN") {
    return (
      <section className={`${authCardClassName} text-muted`}>
        <div className="flex min-h-[260px] items-center justify-center">
          <p className="text-sm font-medium">관리자 페이지로 이동하는 중입니다...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={authCardClassName}>
      <div className="space-y-2">
        <h1 className="text-[28px] leading-[1.2] font-semibold text-[#262524] sm:text-[32px]">
          관리자 로그인
        </h1>
        <p className="text-muted text-sm">
          관리자 계정으로 로그인해주세요.
        </p>
      </div>

      <form className="mt-8 space-y-5 sm:mt-9" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-[13px] font-semibold text-[#262524]">
            이메일
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={authInputClassName}
            placeholder="admin@moving.com"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-[13px] font-semibold text-[#262524]">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={authInputClassName}
            placeholder="비밀번호를 입력해 주세요"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent text-brand-foreground h-12 w-full rounded-xl px-4 text-sm font-semibold transition-opacity disabled:opacity-60"
        >
          {isSubmitting ? "로그인 중" : "로그인"}
        </button>
      </form>

      {errorMessage ? (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-[#ffeef0] px-4 py-3 text-sm text-red-600"
        >
          {errorMessage}
        </p>
      ) : null}

      <p className="mt-6 text-xs text-[#8c8c8c]">MOVING 관리자 전용 페이지</p>
    </section>
  );
}
