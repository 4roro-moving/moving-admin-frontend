import { cn } from "@/lib/utils/cn";
import type { AdminAccountStatus } from "@/types/adminUser";

interface UserStatusActionProps {
  status: AdminAccountStatus;
  onClick: () => void;
}

export default function UserStatusAction({
  status,
  onClick,
}: UserStatusActionProps) {
  if (status === "WITHDRAWN") return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-semibold",
        status === "SUSPENDED"
          ? "border border-border text-text-secondary hover:bg-background-hover"
          : "bg-status-suspended-background text-status-suspended-foreground hover:opacity-80",
      )}
    >
      {status === "SUSPENDED" ? "정지 해제" : "계정 정지"}
    </button>
  );
}
