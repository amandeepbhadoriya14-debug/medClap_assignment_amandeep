import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { getSessionPayload } from "@/lib/auth";

export async function GET() {
  const payload = await getSessionPayload();
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const db = await getDb();
  const totalUsers = db.data.users.length;

  const recentUsers = [...db.data.users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role || "Member",
      provider: u.provider,
      avatar: u.avatar || null,
      joined: u.createdAt,
    }));

  const rand = (min, max) => Math.round(min + Math.random() * (max - min));
  const jitter = (base, pct) => Math.round(base * (1 + (Math.random() - 0.5) * pct));
  const signed = (n) => Number(n.toFixed(1));

  const stats = [
    { key: "users", label: "Total Users", value: 8420 + totalUsers, change: signed(8 + Math.random() * 8), tone: "teal" },
    { key: "active", label: "Active Sessions", value: jitter(1284, 0.25), change: signed(1 + Math.random() * 6), tone: "blue" },
    { key: "new", label: "New This Week", value: jitter(326, 0.3), change: signed(4 + Math.random() * 7), tone: "amber" },
    { key: "churn", label: "Churn Rate", value: signed(1.2 + Math.random() * 1.4), suffix: "%", change: signed(-(Math.random() * 1.2)), tone: "rose" },
  ];

  const signupTrend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => ({
    label,
    value: rand(220, 460),
  }));

  const roles = [
    { label: "Members", color: "#2db3bf", weight: rand(50, 65) },
    { label: "Editors", color: "#6366f1", weight: rand(18, 28) },
    { label: "Admins", color: "#f4b860", weight: rand(6, 12) },
    { label: "Guests", color: "#f472b6", weight: rand(3, 8) },
  ];
  const weightTotal = roles.reduce((sum, r) => sum + r.weight, 0);
  let acc = 0;
  const roleDistribution = roles.map((r, i) => {
    const value = i === roles.length - 1 ? 100 - acc : Math.round((r.weight / weightTotal) * 100);
    acc += value;
    return { label: r.label, color: r.color, value };
  });

  const activity = [
    { id: 1, type: "signup", text: "Priya Sharma created an account", time: "2 minutes ago" },
    { id: 2, type: "login", text: "Marcus Lee signed in from a new device", time: "18 minutes ago" },
    { id: 3, type: "update", text: "Elena Ortiz updated her profile", time: "1 hour ago" },
    { id: 4, type: "role", text: "David Kim was promoted to Editor", time: "3 hours ago" },
    { id: 5, type: "signup", text: "Aisha Khan created an account", time: "5 hours ago" },
  ];

  return NextResponse.json({
    stats,
    signupTrend,
    roleDistribution,
    activity,
    recentUsers,
    generatedAt: new Date().toISOString(),
  });
}
