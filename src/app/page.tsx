import { redirect } from "next/navigation";

import { APP_ROUTES } from "@/lib/constants/appRoutes";

export default function HomePage() {
  redirect(APP_ROUTES.DASHBOARD);
}
