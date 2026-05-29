"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { MainHeader } from "@/components/layout/main-header";
import { MainSidebar } from "@/components/layout/main-sidebar";
import { SessionProvider } from "@/components/session-provider";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const titles = {
  "/dashboard": "Dashboard",
  "/profile": "My Profile",
};

export function AppShell({ user, children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = titles[pathname] ?? "Dashboard";

  return (
    <SessionProvider initialUser={user}>
      <div className="h-svh overflow-hidden bg-[#eef5f7] dark:bg-[#060c11]">
        <div className="flex h-full w-full overflow-hidden bg-white dark:bg-[#0f1720]">
          <MainSidebar className="hidden lg:flex" />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent side="left" className="w-[290px] max-w-[290px] border-0 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <MainSidebar
                className="min-h-svh w-full"
                onNavigate={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col dark:bg-[#101826]">
            <MainHeader title={title} onOpenNavigation={() => setMobileOpen(true)} />

            <main className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(220,245,247,0.95),_rgba(255,255,255,0)_36%),linear-gradient(180deg,_#f5fbfc_0%,_#ffffff_100%)] p-4 dark:bg-[radial-gradient(circle_at_top,_rgba(45,179,191,0.18),_rgba(16,24,38,0)_34%),linear-gradient(180deg,_#101826_0%,_#0b1220_100%)] sm:p-6 xl:p-8">
              <div key={pathname} className="mx-auto w-full max-w-[1400px] animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
