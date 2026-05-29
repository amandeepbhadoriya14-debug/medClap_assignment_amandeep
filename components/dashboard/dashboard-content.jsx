"use client";

import { useEffect, useState } from "react";
import {
  ActivityIcon,
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  KeyRoundIcon,
  LogInIcon,
  TrendingDownIcon,
  UserPlusIcon,
  UserRoundCheckIcon,
  UserRoundCogIcon,
  UsersIcon,
} from "lucide-react";

import { useSession, initials } from "@/components/session-provider";
import { GoogleIcon } from "@/components/google-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { RoleDonut } from "@/components/dashboard/role-donut";

const cardClass =
  "border-0 bg-white py-0 ring-1 ring-[#dfecef] shadow-[0_16px_36px_-30px_rgba(148,163,184,0.4)] dark:bg-[#162230] dark:ring-white/[0.05] dark:shadow-none";

const statTone = {
  teal: { icon: UsersIcon, surface: "bg-teal-50 text-[#18a8b3] dark:bg-[#18a8b3]/12 dark:text-[#77dce3]" },
  blue: { icon: UserRoundCheckIcon, surface: "bg-sky-50 text-sky-500 dark:bg-sky-400/12 dark:text-sky-300" },
  amber: { icon: UserPlusIcon, surface: "bg-amber-50 text-amber-500 dark:bg-amber-400/12 dark:text-amber-300" },
  rose: { icon: TrendingDownIcon, surface: "bg-rose-50 text-rose-500 dark:bg-rose-400/12 dark:text-rose-300" },
};

const activityIcon = {
  signup: UserPlusIcon,
  login: LogInIcon,
  update: UserRoundCogIcon,
  role: KeyRoundIcon,
};

export function DashboardContent() {
  const { user } = useSession();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => active && setData(json))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-5">
      <WelcomeCard user={user} />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data
          ? data.stats.map((stat) => <StatCard key={stat.key} stat={stat} />)
          : [1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className={cardClass}>
          <CardContent className="px-5 py-5 sm:px-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">New Signups</p>
                <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  This Week
                </p>
              </div>
              <Badge variant="outline" className="gap-1 rounded-full border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <ArrowUpRightIcon className="size-3" /> 8.7%
              </Badge>
            </div>
            {data ? <TrendChart data={data.signupTrend} /> : <Skeleton className="h-[232px] w-full rounded-xl" />}
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardContent className="px-5 py-5 sm:px-6">
            <p className="mb-5 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Role Distribution
            </p>
            {data ? <RoleDonut data={data.roleDistribution} /> : <Skeleton className="h-[180px] w-full rounded-xl" />}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className={cardClass}>
          <CardContent className="px-5 py-5 sm:px-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                Recent Users
              </p>
              <UsersIcon className="size-4 text-slate-400" />
            </div>
            {data ? <RecentUsers users={data.recentUsers} /> : <TableSkeleton />}
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardContent className="px-5 py-5 sm:px-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                Recent Activity
              </p>
              <ActivityIcon className="size-4 text-slate-400" />
            </div>
            {data ? <ActivityFeed items={data.activity} /> : <FeedSkeleton />}
          </CardContent>
        </Card>
      </section>

      {error && (
        <p className="text-center text-sm text-rose-500">
          Couldn&apos;t load dashboard data. Please refresh.
        </p>
      )}
    </div>
  );
}

function WelcomeCard({ user }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="border-0 bg-[linear-gradient(135deg,#ffffff_0%,#f4fcfe_46%,#edf6ff_100%)] py-0 ring-1 ring-[#dfecef] shadow-[0_18px_40px_-32px_rgba(148,163,184,0.35)] dark:bg-[radial-gradient(circle_at_right,_rgba(45,179,191,0.18),_rgba(22,34,48,0)_42%),linear-gradient(135deg,_#162230_0%,_#101a28_54%,_#0d1622_100%)] dark:ring-white/[0.05] dark:shadow-none">
      <CardContent className="flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Avatar className="size-12 shrink-0 ring-4 ring-white/70 sm:size-14 dark:ring-white/[0.06]">
            {user?.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
            <AvatarFallback className="bg-[linear-gradient(135deg,#2db3bf,#0f172a)] text-base font-semibold text-white">
              {initials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p suppressHydrationWarning className="text-xs font-medium text-slate-500 dark:text-slate-400">{today}</p>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-[1.6rem] dark:text-white">
              Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
            </h1>
            <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-2">
              <span className="max-w-full truncate text-sm text-slate-500 dark:text-slate-400">{user?.email}</span>
              {user?.provider === "google" ? (
                <Badge variant="outline" className="gap-1 rounded-full border-[#dbe7ea] bg-white/70 text-[11px] text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300">
                  <GoogleIcon className="size-3" /> Google
                </Badge>
              ) : (
                <Badge variant="outline" className="rounded-full border-[#dbe7ea] bg-white/70 text-[11px] text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300">
                  Email account
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ stat }) {
  const tone = statTone[stat.tone] ?? statTone.teal;
  const Icon = tone.icon;
  const positive = stat.change >= 0;
  const TrendIcon = positive ? ArrowUpRightIcon : ArrowDownRightIcon;
  const formatted = stat.value >= 1000 ? stat.value.toLocaleString() : stat.value;

  return (
    <Card className={cardClass}>
      <CardContent className="px-5 py-5">
        <div className="flex items-start justify-between">
          <div className={`flex size-11 items-center justify-center rounded-2xl ${tone.surface}`}>
            <Icon className="size-5" />
          </div>
          <span className={`flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-500" : "text-rose-500"}`}>
            <TrendIcon className="size-3" />
            {Math.abs(stat.change)}%
          </span>
        </div>
        <p className="mt-4 text-[1.9rem] font-semibold tracking-tight text-slate-900 dark:text-white">
          {formatted}{stat.suffix || ""}
        </p>
        <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
      </CardContent>
    </Card>
  );
}

function RecentUsers({ users }) {
  if (!users.length) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        No users yet — invite someone to get started.
      </p>
    );
  }
  return (
    <div className="-mx-2 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            <th className="px-2 pb-3">User</th>
            <th className="px-2 pb-3">Role</th>
            <th className="hidden px-2 pb-3 md:table-cell">Method</th>
            <th className="hidden px-2 pb-3 sm:table-cell">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
          {users.map((u) => (
            <tr key={u.id} className="text-sm">
              <td className="px-2 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    {u.avatar ? <AvatarImage src={u.avatar} alt={u.name} /> : null}
                    <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
                      {initials(u.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900 dark:text-white">{u.name}</p>
                    <p className="truncate text-xs text-slate-400">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-2 py-3">
                <Badge variant="secondary" className="rounded-full bg-[#ddf5f7] text-[#127b84] dark:bg-[#18a8b3]/16 dark:text-[#7be0e7]">
                  {u.role}
                </Badge>
              </td>
              <td className="hidden px-2 py-3 text-slate-500 md:table-cell dark:text-slate-400">
                {u.provider === "google" ? (
                  <span className="inline-flex items-center gap-1.5">
                    <GoogleIcon className="size-3.5" /> Google
                  </span>
                ) : (
                  "Email"
                )}
              </td>
              <td className="hidden px-2 py-3 text-slate-500 sm:table-cell dark:text-slate-400">
                {new Date(u.joined).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityFeed({ items }) {
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = activityIcon[item.type] ?? ActivityIcon;
        return (
          <div key={item.id} className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03]">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e7f7f8] text-[#18a8b3] dark:bg-[#18a8b3]/12 dark:text-[#77dce3]">
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm leading-5 text-slate-700 dark:text-slate-200">{item.text}</p>
              <p className="text-xs text-slate-400">{item.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatSkeleton() {
  return (
    <Card className={cardClass}>
      <CardContent className="px-5 py-5">
        <Skeleton className="size-11 rounded-2xl" />
        <Skeleton className="mt-4 h-8 w-24" />
        <Skeleton className="mt-2 h-4 w-20" />
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
