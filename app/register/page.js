"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockKeyholeIcon,
  MailIcon,
  UserRoundIcon,
} from "lucide-react";
import { toast } from "sonner";

import { registerSchema } from "@/lib/validation";
import { AuthScaffold } from "@/components/auth/auth-scaffold";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "" },
  });

  const password = watch("password") || "";
  const strength = getStrength(password);

  const onSubmit = async (values) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (data.errors) {
        Object.entries(data.errors).forEach(([field, message]) =>
          setError(field, { message })
        );
      }
      if (!data.errors) setError("root", { message: data.message || "Unable to register." });
      return;
    }

    toast.success("Account created! Welcome to MedClap.");
    router.replace("/dashboard");
    router.refresh();
  };

  return (
    <AuthScaffold title="Create your account" subtitle="Start managing your profile in minutes">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
            Full Name
          </Label>
          <div className="relative">
            <UserRoundIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="name"
              placeholder="Jane Doe"
              aria-invalid={Boolean(errors.name)}
              className="h-11 rounded-2xl border-[#dde7eb] bg-white pl-11 text-sm shadow-none dark:border-white/[0.08] dark:bg-white/[0.04]"
              {...register("name")}
            />
          </div>
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
            Email Address
          </Label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              className="h-11 rounded-2xl border-[#dde7eb] bg-white pl-11 text-sm shadow-none dark:border-white/[0.08] dark:bg-white/[0.04]"
              {...register("email")}
            />
          </div>
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
            Password
          </Label>
          <div className="relative">
            <LockKeyholeIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              aria-invalid={Boolean(errors.password)}
              className="h-11 rounded-2xl border-[#dde7eb] bg-white px-11 text-sm shadow-none dark:border-white/[0.08] dark:bg-white/[0.04]"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              <span className="sr-only">{showPassword ? "Hide" : "Show"} password</span>
            </button>
          </div>
          {password ? <StrengthMeter strength={strength} /> : null}
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </div>

        {errors.root && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {errors.root.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-2xl bg-[#2db3bf] text-sm font-semibold text-white shadow-[0_18px_30px_-22px_rgba(40,178,189,0.92)] hover:bg-[#1fa3ae]"
        >
          {isSubmitting && <Loader2Icon className="size-4 animate-spin" />}
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>

        <div className="flex w-full items-center gap-3 py-0.5">
          <div className="h-px flex-1 bg-[#e6edf0] dark:bg-white/[0.08]" />
          <span className="shrink-0 text-[12px] text-slate-400 dark:text-slate-500">or sign up with</span>
          <div className="h-px flex-1 bg-[#e6edf0] dark:bg-white/[0.08]" />
        </div>

        <GoogleButton label="Sign up with Google" />

        <p className="pt-1 text-center text-[13px] text-slate-500 dark:text-slate-300">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#18a8b3] transition-colors hover:text-[#1197a1] dark:text-[#77dfe7]">
            Sign in
          </Link>
        </p>
      </form>
    </AuthScaffold>
  );
}

function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function StrengthMeter({ strength }) {
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={{ backgroundColor: i < strength ? colors[strength] : "rgba(148,163,184,0.25)" }}
          />
        ))}
      </div>
      <p className="text-[11px] font-medium" style={{ color: colors[strength] }}>
        {labels[strength]}
      </p>
    </div>
  );
}

function FieldError({ children }) {
  return <p className="text-[12px] font-medium text-red-600 dark:text-red-300">{children}</p>;
}
