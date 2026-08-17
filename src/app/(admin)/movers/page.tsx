import AdminMoversPage from "@/components/admin/movers/AdminMoversPage";
import { parseMoverListFilters } from "@/lib/utils/user/moversSearchParams";
import type { SearchParamsInput } from "@/lib/utils/urlSearchParams";

export default async function MoversPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  return (
    <AdminMoversPage
      initialFilters={parseMoverListFilters(await searchParams)}
    />
  );
}
