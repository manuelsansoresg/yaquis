"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/auth";
type Row = Record<string, string | number | null | boolean>;
type Field = {
  key: string;
  label: string;
  type?: string;
  source?: string;
  kind?: string;
  options?: [string, string][];
  optional?: boolean;
};
const modules: Record<string, { title: string; fields: Field[] }> = {
  users: {
    title: "Usuarios",
    fields: [
      { key: "name", label: "Nombre" },
      { key: "email", label: "Correo", type: "email" },
      {
        key: "password",
        label: "Contraseña (al editar, deja vacío para conservarla)",
        type: "password",
      },
      {
        key: "role",
        label: "Rol",
        options: [
          ["user", "Usuario"],
          ["admin", "Administrador"],
        ],
      },
      { key: "active", label: "Activo", type: "checkbox" },
    ],
  },
  catalogs: {
    title: "Catálogos",
    fields: [
      {
        key: "kind",
        label: "Tipo",
        options: [
          ["division", "División"],
          ["category", "Categoría"],
          ["season", "Temporada"],
          ["venue", "Sede"],
          ["position", "Posición"],
        ],
      },
      { key: "name", label: "Nombre" },
      { key: "active", label: "Activo", type: "checkbox" },
    ],
  },
  teams: {
    title: "Equipos",
    fields: [
      { key: "name", label: "Nombre" },
      { key: "short", label: "Abreviatura" },
      {
        key: "division_id",
        label: "División",
        source: "catalogs",
        kind: "division",
      },
      {
        key: "category_id",
        label: "Categoría",
        source: "catalogs",
        kind: "category",
      },
      {
        key: "season_id",
        label: "Temporada",
        source: "catalogs",
        kind: "season",
      },
      { key: "coach", label: "Director técnico", optional: true },
      { key: "manager", label: "Responsable", optional: true },
      { key: "color1", label: "Color principal", type: "color" },
      { key: "color2", label: "Color secundario", type: "color" },
      { key: "active", label: "Activo", type: "checkbox" },
    ],
  },
  players: {
    title: "Jugadores",
    fields: [
      { key: "name", label: "Nombre" },
      { key: "team_id", label: "Equipo", source: "teams" },
      { key: "number", label: "Número de camiseta", type: "number" },
      {
        key: "position_id",
        label: "Posición",
        source: "catalogs",
        kind: "position",
      },
      { key: "active", label: "Activo", type: "checkbox" },
    ],
  },
  matches: {
    title: "Partidos y resultados",
    fields: [
      { key: "home_id", label: "Equipo local", source: "teams" },
      { key: "away_id", label: "Equipo visitante", source: "teams" },
      { key: "venue_id", label: "Sede", source: "catalogs", kind: "venue" },
      {
        key: "kickoff",
        label: "Fecha y hora (hora de la liga)",
        type: "datetime-local",
      },
      { key: "round", label: "Jornada", type: "number" },
      {
        key: "status",
        label: "Estado",
        options: [
          ["scheduled", "Programado"],
          ["played", "Finalizado"],
          ["cancelled", "Cancelado"],
        ],
      },
      {
        key: "home_score",
        label: "Goles local (solo finalizado)",
        type: "number",
        optional: true,
      },
      {
        key: "away_score",
        label: "Goles visitante (solo finalizado)",
        type: "number",
        optional: true,
      },
    ],
  },
  match_goals: {
    title: "Goles por jugador",
    fields: [
      { key: "match_id", label: "Partido finalizado", source: "matches" },
      { key: "player_id", label: "Jugador", source: "players" },
      { key: "goals", label: "Goles anotados", type: "number" },
    ],
  },
  news: {
    title: "Noticias",
    fields: [
      { key: "tag", label: "Etiqueta" },
      { key: "title", label: "Título" },
      { key: "copy", label: "Contenido", type: "textarea" },
      { key: "published_on", label: "Fecha", type: "date" },
      { key: "active", label: "Publicada", type: "checkbox" },
    ],
  },
  registrations: { title: "Inscripciones", fields: [] },
};
const labels: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
  scheduled: "Programado",
  played: "Finalizado",
  cancelled: "Cancelado",
  admin: "Administrador",
  user: "Usuario",
  division: "División",
  category: "Categoría",
  season: "Temporada",
  venue: "Sede",
  position: "Posición",
};
async function fetchAdminData() {
  const entries = await Promise.all(
    Object.keys(modules).map(async (key) => {
      const r = await fetch(`/api/admin/${key}`);
      if (!r.ok)
        throw new Error("No se pudo cargar el panel. Revisa tu sesión.");
      return [key, await r.json()] as const;
    }),
  );
  return Object.fromEntries(entries);
}
export function AdminPanel({ user }: { user: User }) {
  const router = useRouter();
  const [tab, setTab] = useState("registrations");
  const [data, setData] = useState<Record<string, Row[]>>({});
  const [edit, setEdit] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  async function load() {
    setData(await fetchAdminData());
  }
  useEffect(() => {
    fetchAdminData()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  function select(key: string) {
    setTab(key);
    setEdit(null);
    setError("");
    setMessage("");
    setDeleting(null);
    setFile(null);
  }
  function start(row?: Row) {
    setFile(null);
    setError("");
    setMessage("");
    setEdit(
      row
        ? {
            ...row,
            kickoff:
              typeof row.kickoff === "string"
                ? row.kickoff.replace(" ", "T").slice(0, 16)
                : "",
          }
        : {
            active: true,
            role: "user",
            kind: "division",
            status: "scheduled",
            color1: "#73e82d",
            color2: "#102b49",
          },
    );
  }
  function name(source: string, value: unknown): string {
    const row = data[source]?.find((r) => String(r.id) === String(value));
    if (!row) return "—";
    if (source === "matches")
      return `${name("teams", row.home_id)} vs ${name("teams", row.away_id)} · ${row.kickoff}`;
    return String(row.name ?? row.title ?? row.id);
  }
  function options(field: Field) {
    return (data[field.source!] ?? []).filter(
      (r) =>
        (!field.kind || r.kind === field.kind) &&
        (r.active === undefined ||
          Boolean(r.active) ||
          String(r.id) === String(edit?.[field.key])) &&
        (field.source !== "matches" || r.status === "played") &&
        (tab !== "match_goals" ||
          field.source !== "players" ||
          (() => {
            const match = data.matches?.find(
              (m) => String(m.id) === String(edit?.match_id),
            );
            return (
              match &&
              (r.team_id === match.home_id || r.team_id === match.away_id)
            );
          })()),
    );
  }
  async function perform(body: Row, method = "POST") {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (file && tab === "teams") {
        const fd = new FormData();
        fd.set("logo", file);
        const upload = await fetch("/api/media", { method: "POST", body: fd });
        const result = await upload.json();
        if (!upload.ok) throw new Error(result.error);
        body.logo_id = result.id;
      }
      const response = await fetch(`/api/admin/${tab}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setEdit(null);
      setDeleting(null);
      setFile(null);
      await load();
      router.refresh();
      setMessage("Cambios guardados correctamente.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    } finally {
      setBusy(false);
    }
  }
  const config = modules[tab];
  const list = data[tab] ?? [];
  return (
    <div className="container-shell page-content">
      <div className="admin-heading">
        <div>
          <p className="page-kicker">Administración de la liga</p>
          <h1 className="display-font text-4xl font-black">
            Panel administrativo
          </h1>
          <p className="muted">
            Hola, {user.name}. Gestiona la información que se publica en el
            sitio.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="button-secondary">
            Ver sitio
          </Link>
          <button
            className="button-secondary"
            onClick={async () => {
              const r = await fetch("/api/auth", { method: "DELETE" });
              if (r.ok) {
                router.push("/login");
                router.refresh();
              } else setError("No se pudo cerrar sesión.");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      <div className="admin-stats">
        {[
          [
            "Inscripciones pendientes",
            (data.registrations ?? []).filter((r) => r.status === "pending")
              .length,
          ],
          ["Equipos", data.teams?.length ?? 0],
          ["Jugadores", data.players?.length ?? 0],
          ["Partidos", data.matches?.length ?? 0],
        ].map(([label, value]) => (
          <div className="surface p-5" key={label}>
            <span className="muted text-sm">{label}</span>
            <strong className="display-font block text-3xl green mt-2">
              {value}
            </strong>
          </div>
        ))}
      </div>
      <div className="admin-layout">
        <nav className="surface admin-nav" aria-label="Módulos administrativos">
          {Object.entries(modules).map(([key, m]) => (
            <button
              key={key}
              className={key === tab ? "selected" : ""}
              onClick={() => select(key)}
            >
              {m.title}
              <span>{data[key]?.length ?? 0}</span>
            </button>
          ))}
        </nav>
        <section className="surface p-5 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-5">
            <h2 className="display-font text-2xl font-bold">{config.title}</h2>
            {tab !== "registrations" && (
              <button className="button-primary" onClick={() => start()}>
                Nuevo registro
              </button>
            )}
          </div>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="form-success">
              {message}
            </p>
          )}
          {edit && (
            <form
              className="admin-form"
              onSubmit={(e) => {
                e.preventDefault();
                void perform({ ...edit });
              }}
            >
              <h3 className="text-xl font-bold sm:col-span-2">
                {edit.id ? "Editar registro" : "Nuevo registro"}
              </h3>
              {config.fields.map((field) => (
                <label
                  key={field.key}
                  className={field.type === "textarea" ? "sm:col-span-2" : ""}
                >
                  {field.label}
                  {field.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={Boolean(edit[field.key])}
                      onChange={(e) =>
                        setEdit({ ...edit, [field.key]: e.target.checked })
                      }
                    />
                  ) : field.source || field.options ? (
                    <select
                      required
                      value={String(edit[field.key] ?? "")}
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          [field.key]: e.target.value,
                          ...(field.key === "match_id"
                            ? { player_id: "" }
                            : {}),
                        })
                      }
                    >
                      <option value="">Seleccionar…</option>
                      {field.options
                        ? field.options.map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))
                        : options(field).map((r) => (
                            <option key={String(r.id)} value={String(r.id)}>
                              {name(field.source!, r.id)}
                            </option>
                          ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      required
                      maxLength={10000}
                      value={String(edit[field.key] ?? "")}
                      onChange={(e) =>
                        setEdit({ ...edit, [field.key]: e.target.value })
                      }
                    />
                  ) : (
                    <input
                      type={field.type ?? "text"}
                      min={
                        field.key === "number" || field.key.includes("score")
                          ? 0
                          : 1
                      }
                      max={field.type === "number" ? 999 : undefined}
                      required={
                        !field.optional &&
                        !(field.key === "password" && Boolean(edit.id))
                      }
                      minLength={field.type === "password" ? 10 : undefined}
                      maxLength={
                        field.type === "password"
                          ? 128
                          : field.key === "short"
                            ? 10
                            : field.key === "title"
                              ? 180
                              : field.key === "email"
                                ? 190
                                : 120
                      }
                      autoComplete={
                        field.type === "password" ? "new-password" : undefined
                      }
                      value={String(edit[field.key] ?? "")}
                      onChange={(e) =>
                        setEdit({ ...edit, [field.key]: e.target.value })
                      }
                    />
                  )}
                </label>
              ))}
              {tab === "teams" && (
                <label>
                  Logo (PNG, JPG o WebP, máximo 2 MB)
                  {edit.logo_id && (
                    <Image
                      width={64}
                      height={64}
                      src={`/api/media/${edit.logo_id}`}
                      alt="Logo actual"
                      className="h-16 w-16 object-contain"
                    />
                  )}
                  <input
                    key={String(edit.id ?? "new")}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  {edit.logo_id && (
                    <button
                      type="button"
                      className="text-left text-sm green"
                      onClick={() => setEdit({ ...edit, logo_id: null })}
                    >
                      Quitar logo
                    </button>
                  )}
                </label>
              )}
              <div className="flex gap-3 sm:col-span-2">
                <button disabled={busy} className="button-primary">
                  {busy ? "Guardando…" : "Guardar"}
                </button>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => setEdit(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
          {deleting && (
            <div
              className="form-error flex flex-wrap items-center gap-3"
              role="alert"
            >
              <p>¿Eliminar este registro? Esta acción no se puede deshacer.</p>
              <button
                disabled={busy}
                className="button-secondary"
                onClick={() => perform({ id: deleting.id }, "DELETE")}
              >
                Confirmar eliminación
              </button>
              <button
                className="button-secondary"
                onClick={() => setDeleting(null)}
              >
                Cancelar
              </button>
            </div>
          )}
          {loading ? (
            <p className="muted">Cargando información…</p>
          ) : !list.length ? (
            <div className="roster-empty">
              <h3>No hay registros todavía</h3>
              <p>
                {tab === "registrations"
                  ? "Las solicitudes del formulario público aparecerán aquí."
                  : "Crea el primer registro para publicarlo en el sitio."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Registro</th>
                    <th>Detalles</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((row) => (
                    <tr key={String(row.id)}>
                      <td>
                        {row.logo_id && (
                          <Image
                            width={64}
                            height={64}
                            src={`/api/media/${row.logo_id}`}
                            className="h-10 w-10 object-contain mb-2"
                            alt="Logo del equipo"
                          />
                        )}
                        <strong>
                          {String(
                            row.name ??
                              row.title ??
                              row.team_name ??
                              (tab === "matches"
                                ? `${name("teams", row.home_id)} vs ${name("teams", row.away_id)}`
                                : name("players", row.player_id)),
                          )}
                        </strong>
                        <small className="muted block">#{row.id}</small>
                      </td>
                      <td>
                        {tab === "users" ? (
                          row.email
                        ) : tab === "catalogs" ? (
                          labels[String(row.kind)]
                        ) : tab === "teams" ? (
                          `${name("catalogs", row.division_id)} · ${name("catalogs", row.category_id)} · ${name("catalogs", row.season_id)}`
                        ) : tab === "players" ? (
                          `${name("teams", row.team_id)} · #${row.number} · ${name("catalogs", row.position_id)}`
                        ) : tab === "matches" ? (
                          `${row.kickoff} · J${row.round} · ${row.home_score ?? "—"} : ${row.away_score ?? "—"}`
                        ) : tab === "match_goals" ? (
                          `${name("matches", row.match_id)} · ${row.goals} goles`
                        ) : tab === "registrations" ? (
                          <>
                            <span className="block">
                              {row.manager} · {row.phone}
                            </span>
                            <span className="block">{row.email}</span>
                            <span className="block">
                              {name("catalogs", row.category_id)} · División{" "}
                              {name("catalogs", row.division_id)} ·{" "}
                              {name("catalogs", row.season_id)} ·{" "}
                              {row.player_count} jugadores
                            </span>
                          </>
                        ) : (
                          row.published_on
                        )}
                      </td>
                      <td>
                        {row.status
                          ? labels[String(row.status)]
                          : row.role
                            ? `${labels[String(row.role)]} · ${row.active ? "Activo" : "Inactivo"}`
                            : row.active !== undefined
                              ? row.active
                                ? "Activo"
                                : "Inactivo"
                              : "Registrado"}
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {tab === "registrations" ? (
                            row.status === "pending" ? (
                              <>
                                <button
                                  disabled={busy}
                                  className="admin-action"
                                  onClick={() =>
                                    perform({ id: row.id, status: "approved" })
                                  }
                                >
                                  Aprobar y crear equipo
                                </button>
                                <button
                                  disabled={busy}
                                  className="admin-action"
                                  onClick={() =>
                                    perform({ id: row.id, status: "rejected" })
                                  }
                                >
                                  Rechazar
                                </button>
                              </>
                            ) : (
                              <span className="muted text-xs">Revisada</span>
                            )
                          ) : (
                            <>
                              <button
                                className="admin-action"
                                onClick={() => start(row)}
                              >
                                Editar
                              </button>
                              <button
                                className="admin-action danger"
                                onClick={() => {
                                  setDeleting(row);
                                  setError("");
                                  setMessage("");
                                }}
                              >
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
