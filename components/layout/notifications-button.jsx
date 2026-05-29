"use client";

import { useState } from "react";
import {
  BellIcon,
  CheckCheckIcon,
  KeyRoundIcon,
  LogInIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  UserRoundCogIcon,
  XIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const initialNotifications = [
  { id: 1, icon: UserPlusIcon, tone: "teal", title: "New user registered", body: "Priya Sharma just created an account.", time: "2 min ago", unread: true },
  { id: 2, icon: LogInIcon, tone: "blue", title: "New device sign-in", body: "Marcus Lee signed in from Chrome on macOS.", time: "18 min ago", unread: true },
  { id: 3, icon: UserRoundCogIcon, tone: "violet", title: "Profile updated", body: "Elena Ortiz changed her contact details.", time: "1 hour ago", unread: true },
  { id: 4, icon: KeyRoundIcon, tone: "amber", title: "Role changed", body: "David Kim was promoted to Editor.", time: "3 hours ago", unread: false },
  { id: 5, icon: ShieldCheckIcon, tone: "emerald", title: "Security check passed", body: "Weekly account security scan completed.", time: "Yesterday", unread: false },
];

const toneClass = {
  teal: "bg-teal-50 text-[#18a8b3] dark:bg-[#18a8b3]/12 dark:text-[#77dce3]",
  blue: "bg-sky-50 text-sky-500 dark:bg-sky-400/12 dark:text-sky-300",
  violet: "bg-violet-50 text-violet-500 dark:bg-violet-400/12 dark:text-violet-300",
  amber: "bg-amber-50 text-amber-500 dark:bg-amber-400/12 dark:text-amber-300",
  emerald: "bg-emerald-50 text-emerald-500 dark:bg-emerald-400/12 dark:text-emerald-300",
};

export function NotificationsButton() {
  const [items, setItems] = useState(initialNotifications);
  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative size-10 rounded-full border-border bg-background text-muted-foreground shadow-none hover:bg-muted hover:text-foreground dark:border-white/[0.08] dark:bg-white/[0.04]"
        >
          <BellIcon className="size-4" />
          {unreadCount > 0 ? (
            <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-[#2db3bf] px-1 text-[10px] font-semibold leading-5 text-white">
              {unreadCount}
            </span>
          ) : null}
          <span className="sr-only">Notifications</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" showClose={false} className="w-full gap-0 p-0 sm:max-w-md">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 dark:border-white/[0.08]">
          <div>
            <SheetTitle className="text-base">Notifications</SheetTitle>
            <SheetDescription className="text-xs">
              {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
            </SheetDescription>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[#18a8b3] hover:bg-[#e7f7f8] hover:text-[#127b84] dark:hover:bg-white/[0.06]"
              >
                <CheckCheckIcon className="size-3.5" />
                Mark all read
              </Button>
            ) : null}
            <SheetClose asChild>
              <button
                type="button"
                aria-label="Close notifications"
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground dark:hover:bg-white/[0.08]"
              >
                <XIcon className="size-4" />
              </button>
            </SheetClose>
          </div>
        </div>

        <div className="scrollbar-hidden flex-1 overflow-y-auto px-2.5 py-2.5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 py-20 text-center">
              <BellIcon className="size-8 text-slate-300" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {items.map((n) => {
                const Icon = n.icon;
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setItems((prev) =>
                          prev.map((it) => (it.id === n.id ? { ...it, unread: false } : it))
                        )
                      }
                      className={cn(
                        "flex w-full cursor-pointer items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted/60 dark:hover:bg-white/[0.04]",
                        n.unread && "bg-[#f3fbfc] dark:bg-white/[0.03]"
                      )}
                    >
                      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", toneClass[n.tone])}>
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium text-foreground">{n.title}</span>
                          {n.unread ? <span className="size-2 shrink-0 rounded-full bg-[#2db3bf]" /> : null}
                        </span>
                        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{n.body}</span>
                        <span className="mt-1 block text-[11px] text-slate-400">{n.time}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
