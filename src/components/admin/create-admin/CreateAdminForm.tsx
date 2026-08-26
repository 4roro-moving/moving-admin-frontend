"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCreateAdminAccount } from "@/hooks/useCreateAdminAccount";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  createAdminFormSchema,
  type CreateAdminFormValues,
} from "@/lib/sheme/adminCreateScheme";
import type { CreateAdminAccountPayload } from "@/types/adminAccount";

const DEFAULT_VALUES: CreateAdminFormValues = {
  email: "",
  name: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const inputClassName =
  "border-border bg-surface text-foreground placeholder:text-text-placeholder h-12 w-full rounded-xl border px-4 text-sm outline-none transition-[border-color,box-shadow] focus:border-border-brand focus:shadow-input disabled:cursor-not-allowed disabled:opacity-60";

function toCreateAdminPayload(
  values: CreateAdminFormValues,
): CreateAdminAccountPayload {
  return {
    email: values.email.trim().toLowerCase(),
    name: values.name.trim(),
    phone: values.phone.replaceAll("-", ""),
    password: values.password,
  };
}

interface CreateAdminFormProps {
  onCreated: () => void;
}

export default function CreateAdminForm({ onCreated }: CreateAdminFormProps) {
  const createAdminMutation = useCreateAdminAccount();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const isPending = isSubmitting || createAdminMutation.isPending;

  const onSubmit = async (values: CreateAdminFormValues) => {
    try {
      await createAdminMutation.mutateAsync(toCreateAdminPayload(values));
      reset(DEFAULT_VALUES);
      onCreated();
    } catch {
      // API 에러는 mutation.error로 폼 하단에 표시합니다.
    }
  };

  const errorMessage = createAdminMutation.isError
    ? getApiErrorMessage(
        createAdminMutation.error,
        "관리자 계정 생성에 실패했습니다.",
      )
    : null;

  return (
    <form
      className="border-border bg-surface w-full max-w-[560px] space-y-5 rounded-2xl border px-5 py-6 shadow-select sm:px-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="space-y-2">
        <label htmlFor="create-admin-email" className="text-[13px] font-semibold text-[#262524]">
          이메일
        </label>
        <input
          id="create-admin-email"
          type="email"
          autoComplete="off"
          className={inputClassName}
          placeholder="admin@moving.com"
          disabled={isPending}
          {...register("email")}
        />
        {errors.email ? <p className="text-sm text-red-600">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="create-admin-name" className="text-[13px] font-semibold text-[#262524]">
          이름
        </label>
        <input
          id="create-admin-name"
          type="text"
          autoComplete="off"
          className={inputClassName}
          placeholder="홍길동"
          disabled={isPending}
          {...register("name")}
        />
        {errors.name ? <p className="text-sm text-red-600">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="create-admin-phone" className="text-[13px] font-semibold text-[#262524]">
          휴대전화 번호
        </label>
        <input
          id="create-admin-phone"
          type="tel"
          autoComplete="off"
          inputMode="tel"
          className={inputClassName}
          placeholder="010-1234-5678"
          disabled={isPending}
          {...register("phone")}
        />
        {errors.phone ? (
          <p className="text-sm text-red-600">{errors.phone.message}</p>
        ) : (
          <p className="text-muted text-xs">하이픈 없이 입력해도 됩니다.</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="create-admin-password"
          className="text-[13px] font-semibold text-[#262524]"
        >
          비밀번호
        </label>
        <input
          id="create-admin-password"
          type="password"
          autoComplete="new-password"
          className={inputClassName}
          placeholder="8자 이상 입력해 주세요"
          disabled={isPending}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="create-admin-confirm-password"
          className="text-[13px] font-semibold text-[#262524]"
        >
          비밀번호 확인
        </label>
        <input
          id="create-admin-confirm-password"
          type="password"
          autoComplete="new-password"
          className={inputClassName}
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          disabled={isPending}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-accent h-12 w-full rounded-xl px-4 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
      >
        {isPending ? "생성 중" : "관리자 계정 생성"}
      </button>

      {errorMessage ? (
        <p role="alert" className="rounded-xl bg-[#ffeef0] px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
