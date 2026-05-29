import Link from "next/link";
import { HexagonIcon } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent } from "@/components/ui/card";

export function AuthScaffold({ title, subtitle, children }) {
  return (
    <div className="min-h-svh overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(194,242,246,0.65),_rgba(255,255,255,0)_30%),radial-gradient(circle_at_bottom_left,_rgba(216,245,248,0.72),_rgba(255,255,255,0)_28%),linear-gradient(180deg,_#f8fcfd_0%,_#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(45,179,191,0.16),_rgba(8,17,27,0)_28%),linear-gradient(180deg,_#08111b_0%,_#050913_100%)]">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="relative mx-auto flex min-h-svh w-full max-w-7xl items-start justify-center px-4 py-8 sm:px-6 md:items-center">
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e8f7f8]/70 blur-3xl sm:h-80 sm:w-80 dark:bg-[#10343a]/50" />

        <Card className="relative z-10 w-full max-w-[420px] rounded-[26px] border-0 bg-white/96 py-0 ring-1 ring-[#e5edf0] shadow-[0_30px_90px_-56px_rgba(15,23,42,0.4)] backdrop-blur dark:bg-[#0f1720]/95 dark:ring-white/[0.06]">
          <CardContent className="px-5 py-6 sm:px-7 sm:py-8">
            <div className="flex flex-col items-center text-center">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative flex size-12 items-center justify-center rounded-2xl bg-[#0f172a] text-white dark:bg-white dark:text-[#0f172a]">
                  <HexagonIcon className="size-6 fill-current opacity-20" />
                  <span className="absolute text-base font-black">M</span>
                </div>
                <div className="text-left">
                  <p className="text-[1.4rem] font-semibold leading-none tracking-tight text-[#199eaa] dark:text-[#77dfe7]">
                    MedClap
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                    User Hub
                  </p>
                </div>
              </Link>

              <h1 className="mt-6 font-heading text-[1.7rem] font-semibold tracking-tight text-slate-950 dark:text-white">
                {title}
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                {subtitle}
              </p>
            </div>

            <div className="mt-6">{children}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
