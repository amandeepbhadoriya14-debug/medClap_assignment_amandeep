import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getDb, publicUser } from "@/lib/db";

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const users = db.data.users.map(publicUser);

  return NextResponse.json({ users });
}
