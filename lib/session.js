import { findUserById, publicUser } from "@/lib/db";
import { getSessionPayload } from "@/lib/auth";

export async function getCurrentUser() {
  const payload = await getSessionPayload();
  if (!payload) return null;
  const user = await findUserById(payload.sub);
  return user ? publicUser(user) : null;
}
