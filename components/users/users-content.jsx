"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react";

import { initials } from "@/components/session-provider";
import { GoogleIcon } from "@/components/google-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 8;

const cardClass =
  "rounded-2xl border-0 bg-white ring-1 ring-[#dfecef] shadow-[0_16px_36px_-30px_rgba(148,163,184,0.4)] dark:bg-[#101826] dark:ring-white/[0.05]";

export function UsersContent() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setUsers(d.users))
      .catch(() => setError(true));
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.toLowerCase();
    return users.filter(
      (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Users
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage and review all registered accounts.
        </p>
      </div>

      <div className={`${cardClass} px-4 py-4`}>
        <div className="relative w-full max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border-[#e4edf0] bg-white pl-10 text-sm shadow-none dark:border-white/[0.08] dark:bg-white/[0.04]"
          />
        </div>
      </div>

      <div className={cardClass}>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#edf2f4] hover:bg-transparent dark:border-white/[0.06]">
              <TableHead className="pl-5">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Provider</TableHead>
              <TableHead className="hidden sm:table-cell">Joined</TableHead>
              <TableHead className="hidden lg:table-cell">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center text-sm text-rose-500">
                  Couldn&apos;t load users. Please refresh.
                </TableCell>
              </TableRow>
            ) : !users ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <TableRow key={i} className="border-b border-[#edf2f4] dark:border-white/[0.06]">
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-9 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <UsersIcon className="size-8" />
                    <p className="text-sm">No users match your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((u) => (
                <TableRow
                  key={u.id}
                  className="border-b border-[#edf2f4] transition-colors dark:border-white/[0.06]"
                >
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        {u.avatar ? <AvatarImage src={u.avatar} alt={u.name} /> : null}
                        <AvatarFallback className="bg-[linear-gradient(135deg,#2db3bf,#0f172a)] text-xs font-semibold text-white">
                          {initials(u.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                          {u.name}
                        </p>
                        <p className="truncate text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-[#ddf5f7] text-[#127b84] dark:bg-[#18a8b3]/16 dark:text-[#7be0e7]"
                    >
                      {u.role || "Member"}
                    </Badge>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {u.provider === "google" ? (
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                        <GoogleIcon className="size-3.5" /> Google
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                        <ShieldCheckIcon className="size-3.5 text-slate-400" /> Email
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="hidden sm:table-cell text-sm text-slate-500 dark:text-slate-400">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {users && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-[#edf2f4] px-5 py-3.5 dark:border-white/[0.06]">
            <p className="text-xs text-slate-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length} users
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="size-8 rounded-lg border-[#e4edf0] dark:border-white/[0.08]"
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <span className="min-w-[60px] text-center text-xs text-slate-500">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="size-8 rounded-lg border-[#e4edf0] dark:border-white/[0.08]"
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
