"use client";

import { useEffect, useRef, useState } from "react";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const options = [
  { icon: SunIcon, label: "Light", value: "light" },
  { icon: MoonIcon, label: "Dark", value: "dark" },
  { icon: LaptopIcon, label: "System", value: "system" },
];

const baseButton =
  "flex size-8 items-center justify-center rounded-full transition-colors";
const inactiveButton =
  "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white";
const activeButton = "bg-[#2db3bf] text-white shadow-sm";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = options.find((o) => o.value === theme) ?? options[0];
  const ActiveIcon = mounted ? active.icon : SunIcon;

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-white p-1 dark:border-white/[0.08] dark:bg-white/[0.04]"
    >
      {open ? (
        options.map((option, index) => {
          const Icon = option.icon;
          const isActive = mounted && theme === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={option.label}
              title={option.label}
              style={{ animationDelay: `${index * 160}ms`, animationFillMode: "both" }}
              onClick={() => {
                setTheme(option.value);
                setOpen(false);
              }}
              className={cn(
                baseButton,
                "animate-in fade-in-0 slide-in-from-left-3 duration-700 ease-out",
                isActive ? activeButton : inactiveButton
              )}
            >
              <Icon className="size-4" />
            </button>
          );
        })
      ) : (
        <button
          type="button"
          aria-label="Change theme"
          aria-expanded={false}
          title="Change theme"
          onClick={() => setOpen(true)}
          className={cn(baseButton, inactiveButton)}
        >
          <ActiveIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
