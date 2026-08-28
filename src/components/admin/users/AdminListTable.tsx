import type { ReactNode } from "react";
import Text from "@/components/admin/common/Text";

export interface AdminListColumn<TItem> {
  id: string;
  width: string;
  header: ReactNode;
  cell: (item: TItem) => ReactNode;
}

interface AdminListTableProps<TItem extends { id: string }> {
  columns: Array<AdminListColumn<TItem>>;
  items: TItem[];
  emptyLabel: string;
  minWidth: string;
  onRowClick: (item: TItem) => void;
}

export default function AdminListTable<TItem extends { id: string }>({
  columns,
  items,
  emptyLabel,
  minWidth,
  onRowClick,
}: AdminListTableProps<TItem>) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${minWidth} table-fixed text-left text-sm`}>
        <colgroup>
          {columns.map((column) => (
            <col key={column.id} className={column.width} />
          ))}
        </colgroup>
        <thead className="whitespace-nowrap bg-background text-xs font-medium text-text-subtle">
          <tr>
            {columns.map((column) => (
              <th key={column.id} className="px-4 py-3">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr
              key={item.id}
              tabIndex={0}
              onClick={() => onRowClick(item)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onRowClick(item);
                }
              }}
              className="cursor-pointer transition-[background-color] hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-brand"
            >
              {columns.map((column) => (
                <td key={column.id} className="px-4 py-3.5">
                  {column.cell(item)}
                </td>
              ))}
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-24 text-center">
                <Text as="span" variant="md-regular" className="text-muted">
                  {emptyLabel}
                </Text>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
