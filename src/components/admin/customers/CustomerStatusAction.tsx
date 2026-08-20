import type { AdminAccountStatus } from "@/types/adminUser";

export default function CustomerStatusAction({
  status,
  onToggle,
}: {
  status: AdminAccountStatus;
  onToggle: () => void;
}) {
  if (status === "WITHDRAWN") return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={
        status === "SUSPENDED"
          ? "rounded-lg border border-border px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-background-hover"
          : "rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
      }
    >
      {status === "SUSPENDED" ? "정지 해제" : "계정 정지"}
    </button>
  );
}
