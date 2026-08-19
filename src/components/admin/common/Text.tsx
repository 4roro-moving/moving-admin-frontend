import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

const textVariants = {
  "xs-medium":
    "text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium",
  "xs-semibold":
    "text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-semibold",
  "sm-medium":
    "text-[length:var(--font-size-13)] leading-[var(--line-height-22)] font-medium",
  "md-regular":
    "text-[length:var(--font-size-14)] leading-[var(--line-height-24)] font-normal",
  "md-medium":
    "text-[length:var(--font-size-14)] leading-[var(--line-height-24)] font-medium",
  "md-semibold":
    "text-[length:var(--font-size-14)] leading-[var(--line-height-24)] font-semibold",
  "lg-regular":
    "text-[length:var(--font-size-16)] leading-[var(--line-height-26)] font-normal",
  "lg-medium":
    "text-[length:var(--font-size-16)] leading-[var(--line-height-26)] font-medium",
  "lg-semibold":
    "text-[length:var(--font-size-16)] leading-[var(--line-height-26)] font-semibold",
  "2lg-regular":
    "text-[length:var(--font-size-18)] leading-[var(--line-height-26)] font-normal",
  "2lg-semibold":
    "text-[length:var(--font-size-18)] leading-[var(--line-height-26)] font-semibold",
  "xl-semibold":
    "text-[length:var(--font-size-20)] leading-[var(--line-height-32)] font-semibold",
  "2xl-semibold":
    "text-[length:var(--font-size-24)] leading-[var(--line-height-32)] font-semibold",
} as const;

export type TextVariant = keyof typeof textVariants;

export function getTextVariantClass(variant: TextVariant): string {
  return textVariants[variant];
}

type TextProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: TextVariant;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/** moving-frontend Text의 타이포 스케일을 관리자 공용 컴포넌트로 이식했습니다. */
export default function Text<T extends ElementType = "span">({
  as,
  children,
  className = "",
  variant = "md-regular",
  ...props
}: TextProps<T>) {
  const Component = as ?? "span";
  return (
    <Component className={`${textVariants[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
}
