"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useState,
  type ComponentPropsWithoutRef,
  type FormEvent,
} from "react";

import { getTextVariantClass } from "@/components/admin/common/Text";
import { ClearIcon, SearchIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

const searchVariants = cva(
  [
    "flex items-center rounded-16 border border-border bg-surface text-text-primary",
    "transition-[border-color,box-shadow] focus-within:border-border-brand focus-within:shadow-input",
  ],
  {
    variants: {
      size: {
        sm: "h-[52px] w-[260px] gap-[0.375rem] px-4 py-[0.875rem]",
        md: "h-[64px] w-[560px] gap-2 px-6 py-[0.875rem]",
        responsive:
          "h-[52px] gap-[0.375rem] px-4 py-[0.875rem] md:h-[64px] md:gap-2 md:px-6",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface SearchProps
  extends
    Omit<
      ComponentPropsWithoutRef<"input">,
      "size" | "type" | "defaultValue" | "value" | "onChange"
    >,
    VariantProps<typeof searchVariants> {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
}

const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  {
    size,
    className,
    placeholder = "검색",
    value,
    onChange,
    onSubmit,
    onClear,
    ...props
  },
  ref,
) {
  const [isFocused, setIsFocused] = useState(false);
  const resolvedSize = size ?? "md";
  const hasValue = value.length > 0;
  const isSmall = resolvedSize === "sm";
  const isResponsive = resolvedSize === "responsive";
  const iconSizeClass = isSmall
    ? "size-6"
    : isResponsive
      ? "size-6 md:size-9"
      : "size-9";
  const clearIconSizeClass = isSmall
    ? "size-5"
    : isResponsive
      ? "size-5 md:size-7"
      : "size-7";
  const actionGapClass = isSmall
    ? "gap-3"
    : isResponsive
      ? "gap-3 md:gap-4"
      : "gap-4";
  const textVariantClass = isResponsive
    ? cn(
        getTextVariantClass("md-regular"),
        "md:text-[length:var(--font-size-18)] md:leading-[var(--line-height-26)]",
      )
    : getTextVariantClass(isSmall ? "md-regular" : "2lg-regular");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[560px]">
      <div
        className={cn(searchVariants({ size: resolvedSize }), className)}
        onFocusCapture={() => setIsFocused(true)}
        onBlurCapture={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            setIsFocused(false);
          }
        }}
      >
        {!isFocused ? (
          <SearchIcon
            className={cn("shrink-0 text-icon-default", iconSizeClass)}
          />
        ) : null}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            textVariantClass,
            "placeholder:text-text-placeholder min-w-0 flex-1 bg-transparent outline-none",
          )}
          {...props}
        />
        {isFocused ? (
          <div className={cn("flex shrink-0 items-center", actionGapClass)}>
            {hasValue && onClear ? (
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={onClear}
                aria-label="검색어 지우기"
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2",
                  iconSizeClass,
                )}
              >
                <ClearIcon className={clearIconSizeClass} />
              </button>
            ) : null}
            <button
              type="submit"
              onMouseDown={(event) => event.preventDefault()}
              aria-label="검색"
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2",
                iconSizeClass,
              )}
            >
              <SearchIcon className={cn("text-icon-default", iconSizeClass)} />
            </button>
          </div>
        ) : null}
      </div>
    </form>
  );
});

export default Search;
