import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** 조건부 클래스를 합치고 충돌하는 Tailwind 클래스를 마지막 값으로 정리합니다. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
