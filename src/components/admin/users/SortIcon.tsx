import type { SortDirection } from "@/lib/utils/user/sort";
import {
  SortAscendingIcon,
  SortDescendingIcon,
  SortNeutralIcon,
} from "@/icons";

export default function SortIcon({ direction }: { direction: SortDirection }) {
  const Icon =
    direction === "desc"
      ? SortDescendingIcon
      : direction === "asc"
        ? SortAscendingIcon
        : SortNeutralIcon;

  return <Icon className="size-4" />;
}
