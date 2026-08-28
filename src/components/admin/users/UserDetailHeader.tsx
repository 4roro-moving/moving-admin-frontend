import type { ReactNode } from "react";

import Text from "@/components/admin/common/Text";
import AdminStatusBadge from "@/components/admin/users/AdminStatusBadge";
import { ChevronLeftIcon } from "@/icons";
import type { AdminAccountStatus } from "@/types/adminUser";

interface UserDetailHeaderProps {
  name: string;
  status: AdminAccountStatus;
  backLabel: string;
  onBack: () => void;
  action?: ReactNode;
}

export default function UserDetailHeader({
  name,
  status,
  backLabel,
  onBack,
  action,
}: UserDetailHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={backLabel}
          title={backLabel}
          onClick={onBack}
          className="flex size-9 items-center justify-center rounded-lg text-text-secondary hover:bg-background-hover hover:text-foreground"
        >
          <ChevronLeftIcon aria-hidden="true" className="size-5" />
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <Text as="h1" variant="2xl-semibold" className="text-foreground">
            {name}
          </Text>
          <AdminStatusBadge status={status} />
        </div>
      </div>
      {action}
    </header>
  );
}
