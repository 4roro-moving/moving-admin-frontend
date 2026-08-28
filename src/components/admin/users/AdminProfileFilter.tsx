import { FilterOption, TableFilter } from "@/components/admin/users/TableFilter";
import type { AdminProfileFilterValue } from "@/types/adminUser";

interface AdminProfileFilterProps {
  isOpen: boolean;
  onToggle: () => void;
  value: AdminProfileFilterValue;
  onChange: (value: AdminProfileFilterValue) => void;
  isActive?: boolean;
}

export default function AdminProfileFilter({
  isOpen,
  onToggle,
  value,
  onChange,
  isActive = false,
}: AdminProfileFilterProps) {
  return (
    <TableFilter label="프로필 등록" isOpen={isOpen} onToggle={onToggle} isActive={isActive}>
      <FilterOption selected={value === "ALL"} onClick={() => onChange("ALL")}>
        전체
      </FilterOption>
      <FilterOption
        selected={value === "COMPLETED"}
        onClick={() => onChange("COMPLETED")}
      >
        완료
      </FilterOption>
      <FilterOption
        selected={value === "INCOMPLETE"}
        onClick={() => onChange("INCOMPLETE")}
      >
        미완료
      </FilterOption>
    </TableFilter>
  );
}
