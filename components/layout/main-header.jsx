"use client";

import Link from "next/link";
import {
  ChevronDownIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  UserRoundIcon,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsButton } from "@/components/layout/notifications-button";
import { useSession, initials } from "@/components/session-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MainHeader({ title, onOpenNavigation }) {
  const { user, logout } = useSession();

  return (
    <header className="border-b border-border/70 bg-background/95 px-4 py-3.5 backdrop-blur sm:px-6 lg:px-8 dark:border-white/[0.05]">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-10 rounded-full border-border bg-background text-foreground shadow-none hover:bg-muted dark:border-white/[0.08] dark:bg-white/[0.04] lg:hidden"
          onClick={onOpenNavigation}
        >
          <MenuIcon className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>

        <div className="min-w-0 flex-1 lg:hidden">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        </div>

        <div className="ml-auto hidden min-w-[320px] flex-1 justify-end lg:flex">
          <div className="relative w-full max-w-md">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users, activity, settings..."
              className="h-11 rounded-full border-border bg-muted/60 pl-11 pr-4 text-foreground shadow-none dark:border-white/[0.08] dark:bg-white/[0.04]"
            />
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <NotificationsButton />

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-border bg-background p-1 shadow-sm transition-colors hover:bg-muted sm:gap-3 sm:py-1.5 sm:pr-3 sm:pl-1.5 dark:border-white/[0.08] dark:bg-white/[0.04]"
              >
                <Avatar size="lg" className="size-9">
                  {user?.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                  <AvatarFallback className="bg-[linear-gradient(135deg,#2db3bf,#0f172a)] text-xs font-semibold text-white">
                    {initials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden min-w-0 max-w-[140px] text-left sm:block">
                  <p className="truncate text-sm font-medium text-foreground">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <ChevronDownIcon className="hidden size-4 text-muted-foreground sm:block" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={12}
              className="w-64 min-w-64 rounded-2xl p-2"
            >
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-2.5 py-2.5 dark:bg-white/[0.04]">
                <Avatar size="lg" className="size-10">
                  {user?.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                  <AvatarFallback className="bg-[linear-gradient(135deg,#2db3bf,#0f172a)] text-xs font-semibold text-white">
                    {initials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="my-2 h-px bg-border" />

              <DropdownMenuItem asChild>
                <Link href="/profile" className="gap-3 rounded-xl px-2.5 py-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground dark:bg-white/[0.06]">
                    <UserRoundIcon className="size-4" />
                  </span>
                  <span className="text-sm font-medium">My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="gap-3 rounded-xl px-2.5 py-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground dark:bg-white/[0.06]">
                    <LayoutDashboardIcon className="size-4" />
                  </span>
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
              </DropdownMenuItem>

              <div className="my-2 h-px bg-border" />

              <DropdownMenuItem
                variant="destructive"
                className="gap-3 rounded-xl px-2.5 py-2"
                onSelect={() => logout()}
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <LogOutIcon className="size-4" />
                </span>
                <span className="text-sm font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative mt-3 lg:hidden">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="h-11 rounded-full border-border bg-muted/60 pl-11 pr-4 text-foreground shadow-none dark:border-white/[0.08] dark:bg-white/[0.04]"
        />
      </div>
    </header>
  );
}
