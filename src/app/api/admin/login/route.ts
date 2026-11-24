import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ADMIN_SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, signAdminSession } from "@/lib/admin-session";

const attempts = new Map<string, { count: number; blockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function clientKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    const origin = request.headers.get("origin");
    if (origin) {
      let allowedOrigin: string;
      try {
        allowedOrigin = new URL(process.env.NEXTAUTH_URL || "").origin;
      } catch {
        return NextResponse.json({ error: "Server sozlamalari noto‘g‘ri." }, { status: 500 });
      }
      if (origin !== allowedOrigin) {
        return NextResponse.json({ error: "Noto‘g‘ri so‘rov manbasi." }, { status: 403, headers: { "Cache-Control": "no-store" } });
      }
    }
  }

  const key = clientKey(request);
  const now = Date.now();
  const state = attempts.get(key);
  if (state && state.blockedUntil > now) {
    return NextResponse.json(
      { error: "Juda ko‘p urinildi. 15 daqiqadan keyin qayta urinib ko‘ring." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((state.blockedUntil - now) / 1000)) } },
    );
  }
  if (state && state.blockedUntil <= now) attempts.delete(key);

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email va parolni kiriting." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  if (email.length > 254 || password.length > 256) {
    return NextResponse.json({ error: "Kiritilgan ma’lumotlar noto‘g‘ri." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const allowedRole = user && ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR", "MEDICAL_EXPERT"].includes(user.role);
    if (!allowedRole || !(await bcrypt.compare(password, user.passwordHash))) {
      const current = attempts.get(key);
      const count = (current?.count || 0) + 1;
      if (count >= MAX_ATTEMPTS) {
        attempts.set(key, { count, blockedUntil: now + WINDOW_MS });
        return NextResponse.json(
          { error: "Juda ko‘p urinildi. 15 daqiqadan keyin qayta urinib ko‘ring." },
          { status: 429, headers: { "Retry-After": String(WINDOW_MS / 1000), "Cache-Control": "no-store" } },
        );
      }
      attempts.set(key, { count, blockedUntil: 0 });
      return NextResponse.json({ error: "Email yoki parol noto‘g‘ri." }, { status: 401, headers: { "Cache-Control": "no-store" } });
    }

    attempts.delete(key);
    await prisma.auditLog.create({
      data: { userId: user.id, action: "ADMIN_LOGIN", entity: "Admin", entityId: user.id },
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: signAdminSession({
        userId: user.id,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } finally {
    await prisma.$disconnect();
  }
}
