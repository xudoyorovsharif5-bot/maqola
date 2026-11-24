import { createHmac, timingSafeEqual } from "node:crypto";
import type { Role } from "@prisma/client";

export const ADMIN_SESSION_COOKIE = "median_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export type AdminSession = {
  userId: string;
  role: Role;
  exp: number;
};

function secret(): string {
  const value = process.env.NEXTAUTH_SECRET;
  if (!value || value.length < 32 || value.includes("replace-with") || value.includes("change-this")) {
    throw new Error("NEXTAUTH_SECRET is not configured");
  }
  return value;
}

export function signAdminSession(session: AdminSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAdminSession(token: string | undefined): AdminSession | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, providedSignature] = parts;
  if (!payload || !providedSignature) return null;

  const expectedSignature = createHmac("sha256", secret()).update(payload).digest("base64url");
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession;
    if (!session.userId || !["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR", "MEDICAL_EXPERT"].includes(session.role)) {
      return null;
    }
    if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}
