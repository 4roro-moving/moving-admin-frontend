import { cn } from "@/lib/utils/cn";
import type { AdminAccountStatus } from "@/types/adminUser";

interface CustomerStatusActionProps {
  status: AdminAccountStatus;
}

export default function CustomerStatusAction({
  status,
}: CustomerStatusActionProps) {
  if (status === "WITHDRAWN") return null;

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled
        aria-describedby="customer-status-action-pending"
        className={cn(
          "rounded-lg px-3 py-2 text-sm font-semibold opacity-60",
          status === "SUSPENDED"
            ? "border border-border text-text-subtle"
            : "bg-status-suspended-background text-status-suspended-foreground",
        )}
      >
        {status === "SUSPENDED" ? "정지 해제" : "계정 정지"}
      </button>
      <span id="customer-status-action-pending" className="text-xs text-text-subtle">
        준비 중
      </span>
    </div>
  );
}
