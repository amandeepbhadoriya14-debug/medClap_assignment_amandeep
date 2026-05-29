import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { buildGoogleAuthUrl, googleConfigured } from "@/lib/google";

const STATE_COOKIE = "g_oauth_state";

export async function GET(request) {
  if (!googleConfigured()) {
    const url = new URL("/login?error=google_not_configured", request.url);
    return NextResponse.redirect(url);
  }

  const state = crypto.randomUUID();
  const store = await cookies();
  store.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return NextResponse.redirect(buildGoogleAuthUrl(state));
}
