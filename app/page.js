import Link from "next/link";
import {
  ArrowRightIcon,
  HexagonIcon,
  ShieldCheckIcon,
  LayoutDashboardIcon,
  UserRoundCogIcon,
  KeyRoundIcon,
  ZapIcon,
  LockIcon,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: ShieldCheckIcon,
    title: "Secure JWT Auth",
    body: "HttpOnly cookie sessions signed with JSON Web Tokens, plus bcrypt-hashed passwords.",
  },
  {
    icon: KeyRoundIcon,
    title: "Google Sign-In",
    body: "One-tap OAuth with automatic logout the moment your Google session is revoked.",
  },
  {
    icon: LayoutDashboardIcon,
    title: "Live Dashboard",
    body: "A polished overview of your users, sessions, and activity in real time.",
  },
  {
    icon: UserRoundCogIcon,
    title: "Profile Management",
    body: "View and edit your details with instant updates persisted to the database.",
  },
];

export default function Home() {
  return (
    <div className="min-h-svh overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(194,242,246,0.6),_rgba(255,255,255,0)_32%),linear-gradient(180deg,_#f8fcfd_0%,_#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(45,179,191,0.16),_rgba(8,17,27,0)_30%),linear-gradient(180deg,_#08111b_0%,_#050913_100%)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="relative flex size-10 items-center justify-center rounded-2xl bg-[#0f172a] text-white dark:bg-white dark:text-[#0f172a]">
            <HexagonIcon className="size-6 fill-current opacity-20" />
            <span className="absolute text-sm font-black">M</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            MedClap
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            className="h-10 rounded-full px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.06]"
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            className="h-10 rounded-full bg-[#2db3bf] px-5 text-sm font-semibold text-white shadow-[0_18px_30px_-22px_rgba(40,178,189,0.92)] hover:bg-[#1fa3ae]"
          >
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <section className="flex flex-col items-center pt-16 pb-20 text-center sm:pt-24">
          <Badge
            variant="outline"
            className="mb-6 gap-1.5 rounded-full border-[#bfe7ea] bg-white/70 px-3 py-1 text-[12px] font-medium text-[#127b84] backdrop-blur dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-[#7be0e7]"
          >
            <ZapIcon className="size-3.5" />
            Modern user management, done right
          </Badge>

          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl md:text-6xl dark:text-white">
            Authentication & user control,{" "}
            <span className="bg-[linear-gradient(120deg,#2db3bf,#0f766e)] bg-clip-text text-transparent">
              beautifully simple
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg dark:text-slate-300">
            Register, sign in with email or Google, and manage your profile from
            a refined, responsive dashboard. Built with Next.js, JWT, and a
            secure-by-default approach.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-full bg-[#2db3bf] px-7 text-sm font-semibold text-white shadow-[0_22px_40px_-24px_rgba(40,178,189,0.95)] hover:bg-[#1fa3ae]"
            >
              <Link href="/register">
                Create your account
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-[#dbe7ea] bg-white px-7 text-sm font-semibold text-slate-700 shadow-none hover:bg-slate-50 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-white/[0.07]"
            >
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>

          <p className="mt-5 inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <LockIcon className="size-3.5" />
            No credit card. Your data stays yours.
          </p>
        </section>

        <section className="grid gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-[#e5edf0] bg-white/80 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)] dark:border-white/[0.07] dark:bg-white/[0.03]"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#e7f7f8] text-[#18a8b3] transition-colors group-hover:bg-[#2db3bf] group-hover:text-white dark:bg-[#18a8b3]/12 dark:text-[#77dce3]">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {feature.body}
                </p>
              </div>
            );
          })}
        </section>
      </main>

      <footer className="border-t border-[#e8eef0] py-8 dark:border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm text-slate-400 sm:flex-row sm:px-8 dark:text-slate-500">
          <p>© {new Date().getFullYear()} MedClap. Built with Next.js.</p>
          <div className="flex items-center gap-5">
            <Link href="/login" className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">
              Sign in
            </Link>
            <Link href="/register" className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
