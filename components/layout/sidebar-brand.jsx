import Link from "next/link";
import { HexagonIcon } from "lucide-react";

export function SidebarBrand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
      <div className="relative flex size-11 items-center justify-center rounded-2xl bg-white/15 text-white shadow-[0_10px_25px_-15px_rgba(15,23,42,0.8)] ring-1 ring-white/20 backdrop-blur">
        <HexagonIcon className="size-6 fill-white/20" />
        <span className="absolute text-sm font-black">M</span>
      </div>
      <div className="space-y-0.5">
        <p className="font-heading text-[1.45rem] font-semibold leading-none tracking-tight text-white">
          MedClap
        </p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/[0.65]">
          User Hub
        </p>
      </div>
    </Link>
  );
}
