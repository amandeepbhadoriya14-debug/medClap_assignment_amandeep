import { NextResponse } from "next/server";

import { findUserById, publicUser, updateUser } from "@/lib/db";
import { getSessionPayload } from "@/lib/auth";
import { profileSchema, fieldErrors } from "@/lib/validation";

async function requireUser() {
  const payload = await getSessionPayload();
  if (!payload) return null;
  return findUserById(payload.sub);
}

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ user: publicUser(user) });
}

export async function PUT(request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) },
      { status: 422 }
    );
  }

  const { name, phone, jobTitle, location, bio } = parsed.data;
  const updated = await updateUser(user.id, {
    name,
    phone: phone || "",
    jobTitle: jobTitle || "",
    location: location || "",
    bio: bio || "",
  });

  return NextResponse.json({ user: publicUser(updated) });
}
