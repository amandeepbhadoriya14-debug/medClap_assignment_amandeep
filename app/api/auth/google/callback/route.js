import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createUser, findUserByEmail, updateUser } from "@/lib/db";
import { createToken, setSessionCookie } from "@/lib/auth";
import { exchangeCodeForTokens, fetchGoogleProfile } from "@/lib/google";

const STATE_COOKIE = "g_oauth_state";

function redirectTo(request, path) {
  return NextResponse.redirect(new URL(path, request.url));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) return redirectTo(request, "/login?error=google_denied");
  if (!code) return redirectTo(request, "/login?error=google_failed");

  const store = await cookies();
  const savedState = store.get(STATE_COOKIE)?.value;
  store.set(STATE_COOKIE, "", { path: "/", maxAge: 0 });
  if (!state || state !== savedState) {
    return redirectTo(request, "/login?error=google_state");
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const profile = await fetchGoogleProfile(tokens.access_token);

    const email = profile.email?.toLowerCase();
    if (!email) return redirectTo(request, "/login?error=google_failed");

    const existing = await findUserByEmail(email);
    const now = new Date().toISOString();

    let user;
    if (existing) {
      user = await updateUser(existing.id, {
        provider: "google",
        googleId: profile.sub,
        avatar: profile.picture || existing.avatar,
        googleRefreshToken: tokens.refresh_token || existing.googleRefreshToken || null,
      });
    } else {
      user = await createUser({
        id: crypto.randomUUID(),
        name: profile.name || email.split("@")[0],
        email,
        passwordHash: null,
        provider: "google",
        googleId: profile.sub,
        avatar: profile.picture || null,
        role: "Member",
        jobTitle: "",
        phone: "",
        location: "",
        bio: "",
        googleRefreshToken: tokens.refresh_token || null,
        createdAt: now,
        updatedAt: now,
      });
    }

    const token = await createToken(user);
    await setSessionCookie(token);

    return redirectTo(request, "/dashboard");
  } catch (err) {
    console.error("Google callback error:", err);
    return redirectTo(request, "/login?error=google_failed");
  }
}
