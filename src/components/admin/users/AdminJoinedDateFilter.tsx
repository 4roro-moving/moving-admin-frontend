import SortIcon from "@/components/admin/users/SortIcon";
import { TableFilter } from "@/components/admin/users/TableFilter";
import Text from "@/components/admin/common/Text";
import type { SortDirection } from "@/lib/utils/user/sort";

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onReset: () => void;
  sortDirection: SortDirection;
  onSort: () => void;
}

export default function AdminJoinedDateFilter({
  isOpen,
  onToggle,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onReset,
  sortDirection,
  onSort,
}: Props) {
  return (
    <div className="flex items-center gap-1">
      <TableFilter
        align="end"
        menuWidth={274}
        label="가입일"
        isOpen={isOpen}
        onToggle={onToggle}
        isActive={Boolean(fromDate || toDate)}
      >
        <div className="flex w-full flex-col gap-3 p-3 text-left">
          <label>
            <Text as="span" variant="xs-medium" className="text-text-secondary">
              시작일
            </Text>
            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(event) => onFromDateChange(event.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-2 text-xs text-foreground outline-none focus:border-border-brand"
            />
          </label>
          <label>
            <Text as="span" variant="xs-medium" className="text-text-secondary">
              종료일
            </Text>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(event) => onToDateChange(event.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-2 text-xs text-foreground outline-none focus:border-border-brand"
            />
          </label>
          <button
            type="button"
            onClick={onReset}
            className="self-end text-xs font-medium text-text-subtle hover:text-foreground"
          >
            <Text as="span" variant="xs-medium">날짜 초기화</Text>
          </button>
        </div>
      </TableFilter>
      <button
        type="button"
        aria-label="가입일 정렬"
        onClick={onSort}
        className="rounded p-0.5 text-text-subtle hover:bg-background-hover hover:text-text-secondary"
      >
        <SortIcon direction={sortDirection} />
      </button>
    </div>
  );
}
