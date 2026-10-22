import { cookies } from "next/headers";
import { rows } from "@/lib/db";
import { sameOrigin } from "@/lib/auth";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { id } = await request.json();
    const [season] = await rows(
      "SELECT id FROM catalogs WHERE id=? AND kind=? AND active=1",
      [Number(id), "season"],
    );
    if (!season) throw new Error();
    (await cookies()).set("liga_season", String(id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Temporada inválida." }, { status: 400 });
  }
}
