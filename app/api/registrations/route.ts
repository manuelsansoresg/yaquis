import { rateLimit, sameOrigin } from "@/lib/auth";
import { pool, rows } from "@/lib/db";
import { email, InputError, integer, text } from "@/lib/validation";
import { storeLogo } from "@/lib/media";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    if (Number(request.headers.get("content-length")) > 2200000)
      throw new InputError(
        "La solicitud es demasiado grande. Máximo 2 MB para el logo.",
      );
    const data = await request.formData();
    if (data.get("website")) throw new InputError("Solicitud inválida.");
    const team = text(data.get("team_name"), "Equipo"),
      manager = text(data.get("manager"), "Responsable"),
      mail = email(data.get("email"));
    const phone = text(data.get("phone"), "Teléfono", 30);
    if (!/^[+\d\s()\-]{7,30}$/.test(phone))
      throw new InputError("Teléfono inválido.");
    const count = integer(data.get("player_count"), "Jugadores", 7, 40);
    const refs = [];
    for (const kind of ["category", "division", "season"]) {
      const id = integer(data.get(`${kind}_id`), kind);
      if (
        !(
          await rows(
            "SELECT id FROM catalogs WHERE id=? AND kind=? AND active=1",
            [id, kind],
          )
        ).length
      )
        throw new InputError("Selecciona una opción activa para " + kind);
      refs.push(id);
    }
    await rateLimit(`registration:${mail}`, 3, 60);
    const [duplicate] = await rows(
      "SELECT id FROM registrations WHERE team_name=? AND season_id=? AND status IN ('pending','approved')",
      [team, refs[2]],
    );
    if (duplicate)
      throw new InputError(
        "Este equipo ya tiene una solicitud en esta temporada.",
      );
    const file = data.get("logo");
    const logo =
      file instanceof File && file.size ? await storeLogo(file) : null;
    const [result] = await pool.execute(
      "INSERT INTO registrations(team_name,manager,email,phone,category_id,division_id,season_id,player_count,logo_id) VALUES (?,?,?,?,?,?,?,?,?)",
      [team, manager, mail, phone, ...refs, count, logo],
    );
    return Response.json({
      ok: true,
      id: (result as { insertId: number }).insertId,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof InputError
            ? error.message
            : "No se pudo enviar la solicitud. Intenta de nuevo más tarde.",
      },
      { status: 400 },
    );
  }
}
