import {
  currentUser,
  createSession,
  logout,
  rateLimit,
  sameOrigin,
  verifyPassword,
} from "@/lib/auth";
import { rows } from "@/lib/db";
import { email } from "@/lib/validation";
export async function GET() {
  return Response.json({ user: await currentUser() });
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const body = await request.json();
    const mail = email(body.email);
    await rateLimit(`login:${mail}`, 10, 15);
    if (typeof body.password !== "string" || body.password.length > 128)
      return Response.json(
        { error: "Credenciales incorrectas." },
        { status: 401 },
      );
    const [user] = await rows<{ id: number; password_hash: string }>(
      "SELECT id,password_hash FROM users WHERE email=? AND active=1",
      [mail],
    );
    if (!user || !verifyPassword(body.password, user.password_hash))
      return Response.json(
        { error: "Credenciales incorrectas." },
        { status: 401 },
      );
    await createSession(user.id);
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      {
        error:
          "No se pudo iniciar sesión. Revisa tus datos o intenta más tarde.",
      },
      { status: 400 },
    );
  }
}
export async function DELETE(request: Request) {
  try {
    sameOrigin(request);
    await logout();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }
}
