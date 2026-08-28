"use client";

import { formatKoreanDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { AdminTermsListItem } from "@/types/adminTerms";
import {
  ADMIN_TERMS_AUDIENCE_LABELS,
  ADMIN_TERMS_STATUS_LABELS,
  ADMIN_TERMS_TYPE_LABELS,
  getAdminTermsStatusTone,
} from "@/types/adminTerms";

interface AdminTermsTableProps {
  items: AdminTermsListItem[];
  onSelectTerms: (termsId: number) => void;
}

/** 시행일은 날짜만 의미가 있어 시각은 표시하지 않습니다. */
function formatEffectiveDate(value: string | null) {
  return value ? formatKoreanDate(value) : "-";
}

function TermsBadges({ terms }: { terms: AdminTermsListItem }) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
      <span>{ADMIN_TERMS_TYPE_LABELS[terms.type]}</span>
      <span aria-hidden>·</span>
      <span>{ADMIN_TERMS_AUDIENCE_LABELS[terms.audience]}</span>
      {!terms.isRequired ? (
        <>
          <span aria-hidden>·</span>
          <span>선택 동의</span>
        </>
      ) : null}
    </div>
  );
}

function StatusBadge({
  status,
  className,
}: {
  status: AdminTermsListItem["status"];
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs",
        getAdminTermsStatusTone(status),
        className,
      )}
    >
      {ADMIN_TERMS_STATUS_LABELS[status]}
    </span>
  );
}

export default function AdminTermsTable({ items, onSelectTerms }: AdminTermsTableProps) {
  return (
    <>
      {/* 데스크톱 */}
      <div className="hidden overflow-x-auto rounded-2xl border border-[#efefef] xl:block">
        <div className="min-w-[880px]">
          <div className="grid grid-cols-[72px_minmax(0,1fr)_100px_110px_120px_130px] bg-background text-sm text-muted">
            {["ID", "제목", "버전", "상태", "시행일", "작성자"].map((label) => (
              <div key={label} className="px-3 py-3">
                {label}
              </div>
            ))}
          </div>

          {items.map((terms) => (
            <div
              key={terms.id}
              role="button"
              tabIndex={0}
              aria-label={`약관 ${terms.title} 상세`}
              onClick={() => onSelectTerms(terms.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectTerms(terms.id);
                }
              }}
              className="grid cursor-pointer grid-cols-[72px_minmax(0,1fr)_100px_110px_120px_130px] border-t border-[#efefef] bg-surface text-sm transition-colors hover:bg-[#faf7f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f9502e]/30"
            >
              <div className="px-3 py-4 text-muted">#{terms.id}</div>
              <div className="min-w-0 px-3 py-4 text-foreground">
                <span className="block truncate">{terms.title}</span>
                <TermsBadges terms={terms} />
              </div>
              <div className="px-3 py-4 text-muted">{terms.version}</div>
              <div className="px-3 py-4">
                <StatusBadge status={terms.status} className="min-w-[56px]" />
              </div>
              <div className="px-3 py-4 text-muted">{formatEffectiveDate(terms.effectiveAt)}</div>
              <div className="truncate px-3 py-4 text-foreground">
                {terms.author?.name ?? "-"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 태블릿 */}
      <div className="hidden gap-3 md:grid xl:hidden">
        {items.map((terms) => (
          <button
            key={terms.id}
            type="button"
            onClick={() => onSelectTerms(terms.id)}
            className="grid w-full grid-cols-[60px_minmax(0,1fr)_100px_120px] items-start rounded-[10px] border border-[#e8e5e3] bg-surface text-left transition hover:bg-[#faf7f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            <span className="px-3 py-4 text-sm leading-6 text-muted">#{terms.id}</span>
            <span className="min-w-0 px-3 py-4 text-sm leading-6 text-foreground">
              <span className="block truncate">{terms.title}</span>
              <TermsBadges terms={terms} />
            </span>
            <span className="px-3 py-4">
              <StatusBadge status={terms.status} />
            </span>
            <span className="px-3 py-4 text-right text-sm leading-6 text-muted">
              v{terms.version}
            </span>
          </button>
        ))}
      </div>

      {/* 모바일 */}
      <div className="grid gap-3 md:hidden">
        {items.map((terms) => (
          <button
            key={terms.id}
            type="button"
            onClick={() => onSelectTerms(terms.id)}
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-left transition hover:bg-[#faf7f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{terms.title}</p>
                <TermsBadges terms={terms} />
                <div className="mt-3">
                  <StatusBadge status={terms.status} />
                </div>
              </div>
              <span className="shrink-0 text-xs text-muted">v{terms.version}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
