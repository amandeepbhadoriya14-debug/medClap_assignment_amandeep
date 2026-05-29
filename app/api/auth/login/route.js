import { NextResponse } from "next/server";

import { findUserByEmail, publicUser } from "@/lib/db";
import { createToken, setSessionCookie, verifyPassword } from "@/lib/auth";
import { loginSchema, fieldErrors } from "@/lib/validation";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) },
      { status: 422 }
    );
  }

  const { email, password } = parsed.data;
  const user = await findUserByEmail(email);

  const invalid = NextResponse.json(
    { message: "Incorrect email or password." },
    { status: 401 }
  );

  if (!user) return invalid;

  if (user.provider === "google" && !user.passwordHash) {
    return NextResponse.json(
      { message: "This account uses Google sign-in. Continue with Google instead." },
      { status: 401 }
    );
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return invalid;

  const token = await createToken(user);
  await setSessionCookie(token);

  return NextResponse.json({ user: publicUser(user) });
}
