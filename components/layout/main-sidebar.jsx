import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { SidebarBrand } from "@/components/layout/sidebar-brand";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export function MainSidebar({ className, onNavigate }) {
  return (
    <aside
      className={cn(
        "sticky top-0 flex h-svh w-[270px] shrink-0 flex-col overflow-hidden bg-[linear-gradient(180deg,#2db3bf_0%,#167f8a_45%,#0a4f56_100%)] px-6 py-8 text-white dark:border-r dark:border-white/[0.05] dark:bg-[radial-gradient(circle_at_top_left,_rgba(45,179,191,0.14),_rgba(16,24,38,0)_38%),linear-gradient(180deg,_#101826_0%,_#0b1220_100%)]",
        className
      )}
    >
      <div className="shrink-0 space-y-7">
        <SidebarBrand />
        <Separator className="bg-white/10" />
      </div>

      <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto py-6 pr-1">
        <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
          Menu
        </p>
        <SidebarNav onNavigate={onNavigate} />
      </div>

      <div className="shrink-0">
        <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur">
          <p className="text-sm font-semibold text-white">Need help?</p>
          <p className="mt-1 text-xs leading-5 text-white/70">
            Check the docs or reach out to support for assistance.
          </p>
        </div>
      </div>
    </aside>
  );
}
