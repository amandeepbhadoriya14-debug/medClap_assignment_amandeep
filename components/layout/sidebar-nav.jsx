"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SidebarNav({ onNavigate }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = !item.soon && pathname === item.href;

        const inner = (
          <>
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-xl transition-colors",
                active
                  ? "bg-slate-950 text-white shadow-[0_12px_20px_-16px_rgba(15,23,42,0.75)] dark:bg-[#2db3bf]/20 dark:text-[#84e5ed]"
                  : "bg-white/10 text-white dark:bg-white/[0.05] dark:text-slate-200"
              )}
            >
              <Icon className="size-4" />
            </span>
            <span className="flex-1">{item.label}</span>
            {item.soon ? (
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/70">
                Soon
              </span>
            ) : null}
          </>
        );

        const baseClasses =
          "flex h-12 w-full items-center gap-3 rounded-2xl px-3.5 text-left text-sm font-medium transition-all";

        if (item.soon) {
          return (
            <button
              key={item.label}
              type="button"
              disabled
              aria-disabled="true"
              className={cn(
                baseClasses,
                "cursor-not-allowed text-white/[0.55] dark:text-slate-500"
              )}
            >
              {inner}
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              baseClasses,
              active
                ? "bg-white text-slate-900 dark:border dark:border-white/[0.06] dark:bg-white/[0.06] dark:text-white"
                : "text-white/[0.85] hover:bg-white/[0.12] hover:text-white dark:text-slate-300 dark:hover:bg-white/[0.04] dark:hover:text-white"
            )}
          >
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
