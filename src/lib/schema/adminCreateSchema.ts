import { z } from "zod";

const BCRYPT_PASSWORD_MAX_BYTES = 72;
const PHONE_PATTERN = /^01[016789]-?\d{3,4}-?\d{4}$/;

export const createAdminFormSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "이메일을 입력해 주세요.")
      .max(255, "이메일은 255자 이하여야 합니다.")
      .email("이메일 형식이 올바르지 않습니다."),
    name: z
      .string()
      .trim()
      .min(1, "이름을 입력해 주세요.")
      .max(50, "이름은 50자 이하여야 합니다."),
    phone: z
      .string()
      .trim()
      .min(1, "휴대전화 번호를 입력해 주세요.")
      .regex(PHONE_PATTERN, "올바른 휴대전화 번호 형식이 아닙니다."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .max(100, "비밀번호는 100자 이하여야 합니다.")
      .refine(
        (password) =>
          new TextEncoder().encode(password).length <=
          BCRYPT_PASSWORD_MAX_BYTES,
        {
          message: "비밀번호는 UTF-8 기준 72바이트 이하여야 합니다.",
        },
      ),
    confirmPassword: z.string().min(1, "비밀번호를 한 번 더 입력해 주세요."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type CreateAdminFormValues = z.infer<typeof createAdminFormSchema>;
