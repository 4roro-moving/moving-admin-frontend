"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
} from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/admin/common/Button";
import FormField from "@/components/admin/common/FormField";
import Text from "@/components/admin/common/Text";
import { useCreateAdminAccount } from "@/hooks/useCreateAdminAccount";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  createAdminFormSchema,
  type CreateAdminFormValues,
} from "@/lib/schema/adminCreateSchema";
import { cn } from "@/lib/utils/cn";
import type { CreateAdminAccountPayload } from "@/types/adminAccount";

const DEFAULT_VALUES: CreateAdminFormValues = {
  email: "",
  name: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

interface CreateAdminTextFieldProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  error?: string;
  hint?: string;
}

const CreateAdminTextField = forwardRef<
  HTMLInputElement,
  CreateAdminTextFieldProps
>(function CreateAdminTextField(
  { id, label, error, hint, className, ...props },
  ref,
) {
  const errorId = useId();
  const hintId = useId();
  const describedBy =
    [error ? errorId : undefined, hint ? hintId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <FormField
      label={label}
      labelFor={id}
      labelVariant="sm-semibold"
      className="gap-2"
    >
      <input
        {...props}
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          "border-border bg-surface text-foreground placeholder:text-text-placeholder h-12 w-full rounded-xl border px-4 text-sm outline-none transition-[border-color,box-shadow] focus:border-border-brand focus:shadow-input disabled:cursor-not-allowed disabled:opacity-60",
          error && "border-border-error",
          className,
        )}
      />
      {hint ? (
        <Text
          as="p"
          id={hintId}
          variant="xs-regular"
          className="text-muted"
        >
          {hint}
        </Text>
      ) : null}
      {error ? (
        <Text
          as="p"
          id={errorId}
          variant="xs-regular"
          className="text-text-error"
        >
          {error}
        </Text>
      ) : null}
    </FormField>
  );
});

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
    createAdminMutation.reset();

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
      aria-busy={isPending}
    >
      <CreateAdminTextField
        {...register("email")}
        id="create-admin-email"
        label="이메일"
        type="email"
        autoComplete="off"
        placeholder="admin@moving.com"
        disabled={isPending}
        error={errors.email?.message}
      />

      <CreateAdminTextField
        {...register("name")}
        id="create-admin-name"
        label="이름"
        type="text"
        autoComplete="off"
        placeholder="홍길동"
        disabled={isPending}
        error={errors.name?.message}
      />

      <CreateAdminTextField
        {...register("phone")}
        id="create-admin-phone"
        label="휴대전화 번호"
        type="tel"
        autoComplete="off"
        inputMode="tel"
        placeholder="010-1234-5678"
        disabled={isPending}
        hint="하이픈 없이 입력해도 됩니다."
        error={errors.phone?.message}
      />

      <CreateAdminTextField
        {...register("password")}
        id="create-admin-password"
        label="비밀번호"
        type="password"
        autoComplete="new-password"
        placeholder="8자 이상 입력해 주세요"
        disabled={isPending}
        error={errors.password?.message}
      />

      <CreateAdminTextField
        {...register("confirmPassword")}
        id="create-admin-confirm-password"
        label="비밀번호 확인"
        type="password"
        autoComplete="new-password"
        placeholder="비밀번호를 한 번 더 입력해 주세요"
        disabled={isPending}
        error={errors.confirmPassword?.message}
      />

      <Button
        type="submit"
        variant="solid"
        size="cta"
        fullWidth
        disabled={isPending}
        aria-busy={isPending}
      >
        {isPending ? "생성 중" : "관리자 계정 생성"}
      </Button>

      {errorMessage ? (
        <Text
          as="p"
          role="alert"
          variant="md-medium"
          className="bg-status-suspended-background text-text-error rounded-xl px-4 py-3"
        >
          {errorMessage}
        </Text>
      ) : null}
    </form>
  );
}
