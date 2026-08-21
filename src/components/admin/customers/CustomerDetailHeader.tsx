import type { ReactNode } from "react";

import Text from "@/components/admin/common/Text";
import AdminStatusBadge from "@/components/admin/users/AdminStatusBadge";
import { ChevronLeftIcon } from "@/icons";
import type { AdminAccountStatus } from "@/types/adminUser";

interface CustomerDetailHeaderProps {
  name: string;
  status: AdminAccountStatus;
  onBack: () => void;
  action?: ReactNode;
}

export default function CustomerDetailHeader({
  name,
  status,
  onBack,
  action,
}: CustomerDetailHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="고객 목록으로"
          title="고객 목록으로"
          onClick={onBack}
          className="flex size-9 items-center justify-center rounded-lg text-text-secondary hover:bg-background-hover hover:text-foreground"
        >
          <ChevronLeftIcon className="size-5" />
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
