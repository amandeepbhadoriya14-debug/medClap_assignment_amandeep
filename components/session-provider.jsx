"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SessionContext = createContext(null);

const POLL_INTERVAL_MS = 60_000;

export function SessionProvider({ initialUser, children }) {
  const [user, setUser] = useState(initialUser);
  const router = useRouter();
  const loggingOut = useRef(false);

  const handleInvalid = useCallback(
    (reason) => {
      if (loggingOut.current) return;
      loggingOut.current = true;
      if (reason === "google_session_revoked") {
        toast.error("Your Google session ended", {
          description: "Sign in again to continue.",
        });
      }
      router.replace("/login");
    },
    [router]
  );

  const revalidate = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      if (res.status === 401) {
        const data = await res.json().catch(() => ({}));
        handleInvalid(data.reason);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (data.user) setUser(data.user);
      }
    } catch {
      void 0;
    }
  }, [handleInvalid]);

  useEffect(() => {
    const id = setInterval(revalidate, POLL_INTERVAL_MS);
    const onFocus = () => revalidate();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [revalidate]);

  const logout = useCallback(async () => {
    loggingOut.current = true;
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
    }
  }, [router]);

  return (
    <SessionContext.Provider value={{ user, setUser, logout, revalidate }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}

export function initials(name) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
