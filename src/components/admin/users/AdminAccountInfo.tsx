import Text from "@/components/admin/common/Text";
import { formatJoinedDate } from "@/lib/utils/user/date";

interface AdminAccount {
  name: string;
  email: string;
  phone: string;
  authProvider: string;
  isProfileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ItemProps {
  label: string;
  value: string;
}

interface AdminAccountInfoProps {
  account: AdminAccount;
}

function Item({ label, value }: ItemProps) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 border-b border-border py-3 last:border-b-0">
      <Text as="dt" variant="md-medium" className="text-muted">
        {label}
      </Text>
      <Text as="dd" variant="md-regular" className="min-w-0 text-foreground">
        {value}
      </Text>
    </div>
  );
}

export default function AdminAccountInfo({ account }: AdminAccountInfoProps) {
  return (
    <section className="rounded-20 border border-border bg-surface p-5 shadow-select">
      <Text as="h2" variant="lg-semibold" className="text-foreground">
        계정 정보
      </Text>
      <dl className="mt-4">
        <Item label="이름" value={account.name} />
        <Item label="이메일" value={account.email} />
        <Item label="연락처" value={account.phone} />
        <Item label="가입 방식" value={account.authProvider} />
        <Item
          label="프로필 등록 여부"
          value={account.isProfileCompleted ? "완료" : "미완료"}
        />
        <Item label="가입일" value={formatJoinedDate(account.createdAt)} />
        <Item label="최근 수정일" value={formatJoinedDate(account.updatedAt)} />
      </dl>
    </section>
  );
}
