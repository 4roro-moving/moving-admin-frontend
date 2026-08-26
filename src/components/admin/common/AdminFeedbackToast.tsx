import Text from "@/components/admin/common/Text";
import { cn } from "@/lib/utils/cn";

export type AdminFeedbackToastTone = "error" | "success" | "info";

interface AdminFeedbackToastProps {
  tone: AdminFeedbackToastTone;
  message: string;
}

export default function AdminFeedbackToast({
  tone,
  message,
}: AdminFeedbackToastProps) {
  const toneClassName =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "success"
        ? "border-accent/30 bg-accent-muted text-accent"
        : "border-border bg-surface text-muted";

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "fixed right-5 bottom-5 z-40 rounded-lg border px-3 py-2 shadow",
        toneClassName,
      )}
    >
      <Text as="p" variant="xs-regular">
        {message}
      </Text>
    </div>
  );
}
