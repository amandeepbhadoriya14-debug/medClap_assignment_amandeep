"use client";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";

import { GoogleIcon } from "@/components/google-icon";
import { Button } from "@/components/ui/button";

export function GoogleButton({ label = "Continue with Google" }) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        window.location.href = "/api/auth/google";
      }}
      className="h-11 w-full rounded-2xl border-[#e3eaee] bg-white text-sm font-semibold text-slate-700 shadow-none hover:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-100 dark:hover:bg-white/[0.06]"
    >
      {loading ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : (
        <GoogleIcon className="size-4.5" />
      )}
      {label}
    </Button>
  );
}
