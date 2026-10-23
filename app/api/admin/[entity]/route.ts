import { cookies } from "next/headers";
import { currentUser, digest, hashPassword, sameOrigin } from "@/lib/auth";
import { pool, rows, type SqlValue } from "@/lib/db";
import {
  choice,
  email,
  InputError,
  integer,
  password,
  text,
} from "@/lib/validation";
import type { RowDataPacket } from "mysql2/promise";
const entities = [
  "users",
  "catalogs",
  "teams",
  "players",
  "matches",
  "match_goals",
  "news",
  "registrations",
];
type Context = { params: Promise<{ entity: string }> };
export async function GET(_: Request, { params }: Context) {
  if ((await currentUser())?.role !== "admin")
    return Response.json(
      { error: "Acceso reservado a administradores." },
      { status: 403 },
    );
  const { entity } = await params;
  if (!entities.includes(entity))
    return Response.json({ error: "Módulo inválido." }, { status: 404 });
  const fields =
    entity === "users" ? "id,name,email,role,active,created_at" : "*";
  return Response.json(
    await rows(`SELECT ${fields} FROM ${entity} ORDER BY id DESC`),
  );
}
async function mutate(request: Request, { params }: Context, remove = false) {
  const user = await currentUser();
  if (user?.role !== "admin")
    return Response.json(
      { error: "Acceso reservado a administradores." },
      { status: 403 },
    );
  const { entity } = await params;
  if (!entities.includes(entity))
    return Response.json({ error: "Módulo inválido." }, { status: 404 });
  const db = await pool.getConnection();
  try {
    sameOrigin(request);
    const body = await request.json();
    const id = body.id ? integer(body.id, "Identificador") : null;
    await db.beginTransaction();
    // Serialize administration writes so validation and dependent updates stay consistent.
    await db.query("SELECT id FROM users ORDER BY id FOR UPDATE");
    const query = async (sql: string, values: SqlValue[] = []) => {
      const [result] = await db.execute<RowDataPacket[]>(sql, values);
      return result;
    };
    const reference = async (value: unknown, kind: string) => {
      const ref = integer(value, kind);
      const [item] = await query(
        "SELECT id FROM catalogs WHERE id=? AND kind=? AND active=1",
        [ref, kind],
      );
      if (!item)
        throw new InputError("Selecciona un catálogo activo válido: " + kind);
      return ref;
    };
    if (
      id &&
      !(await query(`SELECT id FROM ${entity} WHERE id=?`, [id])).length
    )
      throw new InputError("El registro ya no existe.");
    if (remove) {
      if (!id) throw new InputError("Selecciona el registro.");
      if (entity === "users") {
        if (id === user.id)
          throw new InputError("No puedes eliminar tu propia cuenta.");
        const admins = await query(
          "SELECT id FROM users WHERE role='admin' AND active=1",
        );
        if (admins.length === 1 && admins[0].id === id)
          throw new InputError(
            "Debe existir al menos un administrador activo.",
          );
      }
      if (
        entity === "matches" &&
        (await query("SELECT id FROM match_goals WHERE match_id=?", [id]))
          .length
      )
        throw new InputError("Elimina primero las anotaciones del partido.");
      await db.execute(`DELETE FROM ${entity} WHERE id=?`, [id]);
    } else if (entity === "registrations") {
      if (!id) throw new InputError("Selecciona una inscripción.");
      const status = choice(body.status, ["approved", "rejected"], "Estado");
      const [registration] = await query(
        "SELECT * FROM registrations WHERE id=? FOR UPDATE",
        [id],
      );
      if (registration.status !== "pending")
        throw new InputError("Esta solicitud ya fue revisada.");
      let teamId = null;
      if (status === "approved") {
        for (const kind of ["division", "category", "season"])
          await reference(registration[`${kind}_id`], kind);
        const [result] = await db.execute(
          "INSERT INTO teams(name,short,division_id,category_id,season_id,manager,logo_id) VALUES (?,?,?,?,?,?,?)",
          [
            registration.team_name,
            String(registration.team_name).slice(0, 3).toUpperCase(),
            registration.division_id,
            registration.category_id,
            registration.season_id,
            registration.manager,
            registration.logo_id,
          ],
        );
        teamId = (result as { insertId: number }).insertId;
      }
      await db.execute(
        "UPDATE registrations SET status=?,team_id=? WHERE id=?",
        [status, teamId, id],
      );
    } else {
      const data: Record<string, SqlValue> = {};
      if (entity === "users") {
        data.name = text(body.name, "Nombre");
        data.email = email(body.email);
        data.role = choice(body.role, ["admin", "user"], "Rol");
        data.active = body.active === false || body.active === 0 ? 0 : 1;
        if (id === user.id && (!data.active || data.role !== "admin"))
          throw new InputError("No puedes quitarte el acceso administrativo.");
        if (!id || body.password)
          data.password_hash = hashPassword(password(body.password));
        if (id && (!data.active || data.role !== "admin")) {
          const admins = await query(
            "SELECT id FROM users WHERE role='admin' AND active=1",
          );
          if (admins.length === 1 && admins[0].id === id)
            throw new InputError(
              "Debe existir al menos un administrador activo.",
            );
        }
      }
      if (entity === "catalogs") {
        data.kind = choice(
          body.kind,
          ["division", "category", "season", "venue", "position"],
          "Tipo",
        );
        data.name = text(body.name, "Nombre");
        data.active = body.active === false || body.active === 0 ? 0 : 1;
        if (id) {
          const [old] = await query("SELECT kind FROM catalogs WHERE id=?", [
            id,
          ]);
          if (old.kind !== data.kind)
            throw new InputError(
              "El tipo de un catálogo existente no se puede cambiar.",
            );
        }
      }
      if (entity === "teams") {
        data.name = text(body.name, "Nombre");
        data.short = text(body.short, "Abreviatura", 10);
        for (const kind of ["division", "category", "season"])
          data[`${kind}_id`] = await reference(body[`${kind}_id`], kind);
        data.coach = text(body.coach ?? "", "Director técnico", 120, true);
        data.manager = text(body.manager ?? "", "Responsable", 120, true);
        data.logo_id = body.logo_id || null;
        if (
          data.logo_id &&
          !(await query("SELECT id FROM media WHERE id=?", [data.logo_id]))
            .length
        )
          throw new InputError("Logo inválido.");
        for (const color of ["color1", "color2"]) {
          data[color] = body[color] || "#102b49";
          if (!/^#[0-9a-f]{6}$/i.test(String(data[color])))
            throw new InputError("Color inválido.");
        }
        data.active = body.active === false || body.active === 0 ? 0 : 1;
        if (id) {
          const [old] = await query("SELECT * FROM teams WHERE id=?", [id]);
          if (
            ["division_id", "category_id", "season_id"].some(
              (key) => old[key] !== data[key],
            ) &&
            (
              await query(
                "SELECT id FROM matches WHERE home_id=? OR away_id=?",
                [id, id],
              )
            ).length
          )
            throw new InputError(
              "No se puede cambiar la competencia de un equipo que ya tiene partidos.",
            );
        }
      }
      if (entity === "players") {
        data.team_id = integer(body.team_id, "Equipo");
        if (
          !(
            await query("SELECT id FROM teams WHERE id=? AND active=1", [
              data.team_id,
            ])
          ).length
        )
          throw new InputError("Equipo inválido.");
        data.name = text(body.name, "Nombre");
        data.number = integer(body.number, "Número", 0, 999);
        data.position_id = await reference(body.position_id, "position");
        data.active = body.active === false || body.active === 0 ? 0 : 1;
        if (id) {
          const [old] = await query("SELECT team_id FROM players WHERE id=?", [
            id,
          ]);
          if (
            old.team_id !== data.team_id &&
            (await query("SELECT id FROM match_goals WHERE player_id=?", [id]))
              .length
          )
            throw new InputError(
              "No se puede transferir un jugador que tiene goles registrados.",
            );
        }
      }
      if (entity === "matches") {
        data.home_id = integer(body.home_id, "Local");
        data.away_id = integer(body.away_id, "Visitante");
        if (data.home_id === data.away_id)
          throw new InputError("Selecciona dos equipos distintos.");
        const selected = await query(
          "SELECT * FROM teams WHERE id IN (?,?) AND active=1",
          [data.home_id, data.away_id],
        );
        if (
          selected.length !== 2 ||
          ["season_id", "category_id"].some(
            (key) => selected[0][key] !== selected[1][key],
          )
        )
          throw new InputError(
            "Los equipos deben pertenecer a la misma temporada y categoría. Pueden ser de distintas divisiones para un partido interzona.",
          );
        data.venue_id = await reference(body.venue_id, "venue");
        data.round = integer(body.round, "Jornada", 1, 999);
        const kickoff = text(body.kickoff, "Fecha", 19).replace("T", " ");
        if (
          !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(kickoff) ||
          !Number.isFinite(Date.parse(kickoff))
        )
          throw new InputError("Fecha inválida.");
        data.kickoff = kickoff;
        data.status = choice(
          body.status,
          ["scheduled", "played", "cancelled"],
          "Estado",
        );
        data.home_score =
          data.status === "played"
            ? integer(body.home_score, "Goles local", 0, 999)
            : null;
        data.away_score =
          data.status === "played"
            ? integer(body.away_score, "Goles visitante", 0, 999)
            : null;
        if (id) {
          const existing = await query(
            "SELECT p.team_id,SUM(g.goals) total FROM match_goals g JOIN players p ON p.id=g.player_id WHERE g.match_id=? GROUP BY p.team_id",
            [id],
          );
          if (
            existing.length &&
            (data.status !== "played" ||
              existing.some(
                (g) =>
                  ![data.home_id, data.away_id].includes(g.team_id) ||
                  Number(g.total) >
                    Number(
                      g.team_id === data.home_id
                        ? data.home_score
                        : data.away_score,
                    ),
              ))
          )
            throw new InputError(
              "Revisa las anotaciones antes de cambiar el resultado o los equipos.",
            );
        }
      }
      if (entity === "match_goals") {
        data.match_id = integer(body.match_id, "Partido");
        data.player_id = integer(body.player_id, "Jugador");
        data.goals = integer(body.goals, "Goles", 1, 999);
        const [match] = await query("SELECT * FROM matches WHERE id=?", [
          data.match_id,
        ]);
        const [player] = await query("SELECT * FROM players WHERE id=?", [
          data.player_id,
        ]);
        if (
          !match ||
          !player ||
          match.status !== "played" ||
          ![match.home_id, match.away_id].includes(player.team_id)
        )
          throw new InputError(
            "Elige un jugador de un equipo del partido y un partido finalizado.",
          );
        const [total] = await query(
          "SELECT COALESCE(SUM(g.goals),0) total FROM match_goals g JOIN players p ON p.id=g.player_id WHERE g.match_id=? AND p.team_id=? AND g.id<>?",
          [data.match_id, player.team_id, id ?? 0],
        );
        if (
          Number(total.total) + Number(data.goals) >
          Number(
            player.team_id === match.home_id
              ? match.home_score
              : match.away_score,
          )
        )
          throw new InputError(
            "Los goles individuales no pueden superar el marcador del equipo.",
          );
      }
      if (entity === "news") {
        data.tag = text(body.tag, "Etiqueta", 80);
        data.title = text(body.title, "Título", 180);
        data.copy = text(body.copy, "Contenido", 10000);
        data.published_on = text(body.published_on, "Fecha", 10);
        data.active = body.active === false || body.active === 0 ? 0 : 1;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.published_on)))
          throw new InputError("Fecha inválida.");
      }
      const keys = Object.keys(data);
      if (id)
        await db.execute(
          `UPDATE ${entity} SET ${keys.map((key) => `${key}=?`).join(",")} WHERE id=?`,
          [...Object.values(data), id],
        );
      else
        await db.execute(
          `INSERT INTO ${entity} (${keys.join(",")}) VALUES (${keys.map(() => "?").join(",")})`,
          Object.values(data),
        );
      if (entity === "users" && id && id !== user.id)
        await db.execute("DELETE FROM sessions WHERE user_id=?", [id]);
      if (entity === "users" && id === user.id && body.password) {
        const token = (await cookies()).get("liga_session")?.value ?? "";
        await db.execute(
          "DELETE FROM sessions WHERE user_id=? AND token_hash<>?",
          [id, digest(token)],
        );
      }
    }
    await db.commit();
    return Response.json({ ok: true });
  } catch (error) {
    await db.rollback();
    const code = (error as { code?: string }).code;
    const message =
      error instanceof InputError
        ? error.message
        : code === "ER_DUP_ENTRY"
          ? "Ya existe un registro con esos datos."
          : code === "ER_ROW_IS_REFERENCED_2"
            ? "Este registro tiene datos relacionados. Desactívalo o elimina primero sus relaciones."
            : "No se pudo guardar. Revisa los datos e intenta nuevamente.";
    return Response.json({ error: message }, { status: 400 });
  } finally {
    db.release();
  }
}
export async function POST(request: Request, context: Context) {
  return mutate(request, context);
}
export async function DELETE(request: Request, context: Context) {
  return mutate(request, context, true);
}
