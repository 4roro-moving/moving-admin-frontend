import AdminMembersPage from "@/components/admin/members/AdminMembersPage";
import { parseMemberListFilters } from "@/lib/utils/admin/membersSearchParams";
import type { SearchParamsInput } from "@/lib/utils/urlSearchParams";

export default async function MembersPage({ searchParams }: { searchParams: Promise<SearchParamsInput> }) {
  return <AdminMembersPage initialFilters={parseMemberListFilters(await searchParams)} />;
}
