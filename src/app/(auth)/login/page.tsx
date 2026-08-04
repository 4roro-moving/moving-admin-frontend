"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const adminLoginSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const onSubmit = async () => {
    setIsSubmitted(true);
  };

  return (
    <section className="bg-surface border-border rounded-3xl border p-8 shadow-sm">
      <div className="mb-8 space-y-2">
        <p className="text-muted text-sm font-medium">ADMIN AUTH</p>
        <h1 className="text-2xl font-semibold">MOVING 관리자 로그인</h1>
        <p className="text-muted text-sm">
          로그인 API 연결과 세션 복구는 이번 작업 범위에서 제외되어 있습니다.
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
          {errors.email ? <p className="text-sm text-red-600">{errors.email.message}</p> : null}
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
          로그인 준비 중
        </button>
      </form>

      {isSubmitted ? (
        <p className="bg-background text-muted mt-6 rounded-xl px-4 py-3 text-sm">
          관리자 로그인 API와 세션 복구 로직은 후속 작업에서 연결합니다.
        </p>
      ) : null}
    </section>
  );
}
