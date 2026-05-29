import { NextResponse } from "next/server";

import { findUserById, publicUser, updateUser } from "@/lib/db";
import { clearSessionCookie, getSessionPayload } from "@/lib/auth";
import { refreshGoogleSession } from "@/lib/google";

export async function GET() {
  const payload = await getSessionPayload();
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await findUserById(payload.sub);
  if (!user) {
    await clearSessionCookie();
    return NextResponse.json({ user: null }, { status: 401 });
  }

  if (user.provider === "google") {
    const result = await refreshGoogleSession(user.googleRefreshToken);
    if (result.revoked) {
      await updateUser(user.id, { googleRefreshToken: null });
      await clearSessionCookie();
      return NextResponse.json(
        { user: null, reason: "google_session_revoked" },
        { status: 401 }
      );
    }
  }

  return NextResponse.json({ user: publicUser(user) });
}
