"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { loginAdmin } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

const adminLoginSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const establishSession = useAdminAuthStore((state) => state.establishSession);
  const isCheckingAuth = useAdminAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const userRole = useAdminAuthStore((state) => state.user?.role);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isCheckingAuth) {
      return;
    }

    if (isAuthenticated && userRole === "ADMIN") {
      router.replace(APP_ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isCheckingAuth, router, userRole]);

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
      router.replace(APP_ROUTES.DASHBOARD);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "로그인에 실패했습니다."));
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="bg-background text-muted flex min-h-[12rem] items-center justify-center rounded-3xl px-6 py-12">
        <p className="text-sm font-medium">관리자 세션을 확인하는 중입니다...</p>
      </div>
    );
  }

  if (isAuthenticated && userRole === "ADMIN") {
    return (
      <div className="bg-background text-muted flex min-h-[12rem] items-center justify-center rounded-3xl px-6 py-12">
        <p className="text-sm font-medium">관리자 페이지로 이동하는 중입니다...</p>
      </div>
    );
  }

  return (
    <section className="bg-surface border-border rounded-3xl border p-8 shadow-sm">
      <div className="mb-8 space-y-2">
        <p className="text-muted text-sm font-medium">ADMIN AUTH</p>
        <h1 className="text-2xl font-semibold">MOVING 관리자 로그인</h1>
        <p className="text-muted text-sm">
          관리자 계정으로 로그인해 회원 및 운영 기능에 접근합니다.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            이메일
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="border-border bg-background focus:border-brand focus:ring-brand/15 w-full rounded-xl border px-4 py-3 outline-none focus:ring-4"
            placeholder="admin@moving.com"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="border-border bg-background focus:border-brand focus:ring-brand/15 w-full rounded-xl border px-4 py-3 outline-none focus:ring-4"
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
          className="bg-brand text-brand-foreground w-full rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-60"
        >
          {isSubmitting ? "로그인 중" : "로그인"}
        </button>
      </form>

      {errorMessage ? (
        <p
          role="alert"
          className="bg-[#ffeef0] mt-6 rounded-xl px-4 py-3 text-sm text-red-600"
        >
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}
