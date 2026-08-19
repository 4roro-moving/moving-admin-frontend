"use client";

import Search from "@/components/admin/common/Search";
import Text from "@/components/admin/common/Text";
import {
  FilterOption,
  TableFilter,
} from "@/components/admin/users/TableFilter";

interface AdminListToolbarProps {
  title: string;
  totalCount: number;
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  onSearchSubmit: () => void;
  limit: number;
  isLimitOpen: boolean;
  onLimitToggle: () => void;
  onLimitChange: (limit: number) => void;
}

export default function AdminListToolbar({
  title,
  totalCount,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  onSearchClear,
  onSearchSubmit,
  limit,
  isLimitOpen,
  onLimitToggle,
  onLimitChange,
}: AdminListToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-baseline gap-3">
        <Text as="h2" variant="xl-semibold" className="text-foreground">
          {title}
        </Text>
        <Text as="p" variant="lg-medium" className="text-muted">
          총 <Text as="span" variant="lg-semibold" className="text-foreground">{totalCount}</Text>
          명
        </Text>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="w-full sm:max-w-[420px]">
          <Search
            size="responsive"
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={onSearchChange}
            onClear={onSearchClear}
            onSubmit={onSearchSubmit}
            className="w-full"
          />
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2 whitespace-nowrap">
          <Text as="span" variant="md-medium" className="text-muted">페이지당</Text>
          <TableFilter
            align="end"
            label={`${limit}명`}
            isOpen={isLimitOpen}
            onToggle={onLimitToggle}
            triggerClassName="h-11 rounded-2xl border border-border bg-surface px-4 text-foreground"
          >
            {[20, 50, 100].map((value) => (
              <FilterOption
                key={value}
                selected={limit === value}
                onClick={() => onLimitChange(value)}
              >
                {value}명
              </FilterOption>
            ))}
          </TableFilter>
        </div>
      </div>
    </div>
  );
}
