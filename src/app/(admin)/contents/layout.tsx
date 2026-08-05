import type { ReactNode } from "react";

import AdminContentsTypeNav from "@/components/admin/contents/AdminContentsTypeNav";

export default function ContentsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-6 -my-8 flex min-h-full lg:-mx-10">
      <AdminContentsTypeNav />
      <div className="flex min-w-0 flex-1 flex-col px-5 py-6 lg:px-10 lg:py-9">{children}</div>
    </div>
  );
}
