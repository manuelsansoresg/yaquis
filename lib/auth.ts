import { cookies } from "next/headers";
import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { rows, execute } from "./db";
export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
};
export function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function verifyPassword(password: string, hash: string) {
  const [salt, value] = hash.split(":");
  if (!salt || !value) return false;
  const stored = Buffer.from(value, "hex");
  const candidate = scryptSync(password, salt, 64);
  return (
    stored.length === candidate.length && timingSafeEqual(stored, candidate)
  );
}
export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get("liga_session")?.value;
  if (!token) return null;
  return (
    (
      await rows<User>(
        "SELECT u.id,u.name,u.email,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>UTC_TIMESTAMP() AND u.active=1",
        [digest(token)],
      )
    )[0] ?? null
  );
}
export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  await execute("DELETE FROM sessions WHERE expires_at<UTC_TIMESTAMP()");
  await execute(
    "INSERT INTO sessions(token_hash,user_id,expires_at) VALUES (?,?,DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 DAY))",
    [digest(token), userId],
  );
  (await cookies()).set("liga_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 604800,
  });
}
export async function logout() {
  const store = await cookies();
  const token = store.get("liga_session")?.value;
  if (token)
    await execute("DELETE FROM sessions WHERE token_hash=?", [digest(token)]);
  store.delete("liga_session");
}
export async function rateLimit(key: string, limit: number, minutes: number) {
  await execute("DELETE FROM rate_limits WHERE expires_at<UTC_TIMESTAMP()");
  await execute(
    "INSERT INTO rate_limits(bucket,attempts,expires_at) VALUES (?,1,DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? MINUTE)) ON DUPLICATE KEY UPDATE attempts=attempts+1",
    [digest(key), minutes],
  );
  const [row] = await rows<{ attempts: number }>(
    "SELECT attempts FROM rate_limits WHERE bucket=?",
    [digest(key)],
  );
  if (row.attempts > limit)
    throw new Error("Demasiados intentos. Intenta nuevamente más tarde.");
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== request.headers.get("host"))
    throw new Error("Origen de solicitud no permitido.");
}
