import { NextResponse } from "next/server";

import { createUser, findUserByEmail, publicUser } from "@/lib/db";
import { createToken, hashPassword, setSessionCookie } from "@/lib/auth";
import { registerSchema, fieldErrors } from "@/lib/validation";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) },
      { status: 422 }
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { message: "An account with this email already exists.", errors: { email: "Email already registered." } },
      { status: 409 }
    );
  }

  const now = new Date().toISOString();
  const user = await createUser({
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: await hashPassword(password),
    provider: "credentials",
    avatar: null,
    role: "Member",
    jobTitle: "",
    phone: "",
    location: "",
    bio: "",
    createdAt: now,
    updatedAt: now,
  });

  const token = await createToken(user);
  await setSessionCookie(token);

  return NextResponse.json({ user: publicUser(user) }, { status: 201 });
}
