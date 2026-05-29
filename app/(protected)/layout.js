import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { AppShell } from "@/components/layout/app-shell";

export default async function ProtectedLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <AppShell user={user}>{children}</AppShell>;
}
