"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { ChevronDownIcon } from "@/icons";
import Text from "@/components/admin/common/Text";

export function TableFilter({
  label,
  isOpen,
  onToggle,
  children,
  align = "start",
  triggerClassName = "",
  menuClassName = "",
  menuWidth = 132,
  isActive = false,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  align?: "start" | "end";
  triggerClassName?: string;
  menuClassName?: string;
  menuWidth?: number;
  isActive?: boolean;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const updateMenuPosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();

    if (!rect) return;

    setMenuPosition({
      top: rect.bottom + 8,
      left:
        align === "end"
          ? Math.max(8, rect.right - menuWidth)
          : Math.max(8, rect.left),
    });
  }, [align, menuWidth]);

  useEffect(() => {
    if (!isOpen) return;

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    // 캡처 단계에서 구독해야 표의 가로 스크롤 컨테이너도 감지할 수 있습니다.
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isOpen, updateMenuPosition]);

  const handleToggle = () => {
    if (!isOpen) updateMenuPosition();

    onToggle();
  };

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-1 font-medium transition ${isOpen || isActive ? "text-accent" : "hover:text-text-secondary"} ${triggerClassName}`}
      >
        <Text as="span" variant="sm-medium">
          {label}
        </Text>
        {isActive ? (
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
        ) : null}
        <ChevronDownIcon
          className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && menuPosition
        ? createPortal(
            <div
              style={{
                position: "fixed",
                top: menuPosition.top,
                left: menuPosition.left,
                width: menuWidth,
              }}
              className={`z-50 overflow-hidden rounded-xl border border-border bg-surface py-1 text-left shadow-select ${menuClassName}`}
            >
              {children}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export function FilterOption({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full px-4 py-2.5 text-left text-sm font-medium transition hover:bg-background-hover ${selected ? "bg-background text-accent" : "text-text-secondary"}`}
    >
      <Text as="span" variant="md-medium">
        {children}
      </Text>
    </button>
  );
}
