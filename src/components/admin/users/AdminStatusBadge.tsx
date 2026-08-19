import {
  ADMIN_STATUS_CLASS,
  ADMIN_STATUS_LABEL,
  type AdminAccountStatus,
} from "@/types/adminUser";
import Text from "@/components/admin/common/Text";

export default function AdminStatusBadge({
  status,
}: {
  status: AdminAccountStatus;
}) {
  return (
    <Text
      as="span"
      variant="xs-semibold"
      className={`inline-flex rounded-full px-2.5 py-1 ring-1 ring-inset ${ADMIN_STATUS_CLASS[status]}`}
    >
      {ADMIN_STATUS_LABEL[status]}
    </Text>
  );
}
