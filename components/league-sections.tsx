"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { LeagueData, LeagueTeam } from "@/lib/league";
export function Crest({
  team,
  large = false,
}: {
  team?: LeagueTeam;
  large?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`roster-crest ${large ? "roster-crest-large" : ""}`}
      style={{
        background: `linear-gradient(145deg,${team?.color1 ?? "#73e82d"},${team?.color2 ?? "#102b49"})`,
        borderColor: team?.color1 ?? "#73e82d",
      }}
    >
      {team?.logo_id ? (
        <Image
          width={80}
          height={94}
          src={`/api/media/${team.logo_id}`}
          alt=""
          className="h-full w-full object-contain rounded-[inherit]"
        />
      ) : (
        (team?.short ?? "LY")
      )}
    </span>
  );
}
export function LeagueSection({
  data,
  kind,
  full = false,
}: {
  data: LeagueData;
  kind: "matches" | "standings" | "scorers" | "calendar" | "teams";
  full?: boolean;
}) {
  const [division, setDivision] = useState(""),
    [category, setCategory] = useState("");
  const [month, setMonth] = useState(() => {
    const value = data.matches.find((m) => m.status === "scheduled")?.kickoff;
    return value
      ? value.slice(0, 7)
      : new Date()
          .toLocaleDateString("sv-SE", { timeZone: "America/Merida" })
          .slice(0, 7);
  });
  const [day, setDay] = useState("");
  const filteredTeams = data.teams.filter(
    (t) =>
      (!division || String(t.division_id) === division) &&
      (!category || String(t.category_id) === category),
  );
  const ids = new Set(filteredTeams.map((t) => t.id));
  const matches = data.matches.filter(
    (m) => ids.has(m.home_id) && ids.has(m.away_id),
  );
  const team = (id: number) => data.teams.find((t) => t.id === id);
  const filters = (
    <div className="flex flex-wrap gap-2 p-3">
      <select
        aria-label="Filtrar división"
        className="rounded border border-[#365164] bg-[#0b1b29] p-2 text-xs"
        value={division}
        onChange={(e) => setDivision(e.target.value)}
      >
        <option value="">Todas las divisiones</option>
        {data.catalogs
          .filter((c) => c.kind === "division")
          .map((c) => (
            <option key={c.id} value={c.id}>
              División {c.name}
            </option>
          ))}
      </select>
      <select
        aria-label="Filtrar categoría"
        className="rounded border border-[#365164] bg-[#0b1b29] p-2 text-xs"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {data.catalogs
          .filter((c) => c.kind === "category")
          .map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
      </select>
    </div>
  );
  const empty = (message: string) => (
    <p className="muted text-sm p-6 text-center">{message}</p>
  );
  const matchCards = (items: typeof matches) => (
    <div className="grid gap-2 px-3 pb-4">
      {items.map((m) => (
        <article
          key={m.id}
          className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-md border border-[#274257] bg-[#091b2a]/60 p-3"
        >
          <div className="flex items-center justify-end gap-2 text-right">
            <span className="text-xs font-bold">{m.home}</span>
            <Crest team={team(m.home_id)} />
          </div>
          <div className="text-center">
            <strong className="green text-xl">
              {m.status === "played"
                ? `${m.home_score} : ${m.away_score}`
                : "VS"}
            </strong>
            <span className="block muted text-xs">
              {m.status === "cancelled"
                ? "Cancelado"
                : m.status === "played"
                  ? "Finalizado"
                  : m.kickoff.slice(11, 16)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Crest team={team(m.away_id)} />
            <span className="text-xs font-bold">{m.away}</span>
          </div>
          <p className="col-span-3 text-center text-xs muted">
            {m.kickoff.slice(0, 10)} · {m.venue} · Jornada {m.round}
          </p>
        </article>
      ))}
    </div>
  );
  if (kind === "matches") {
    const shown = full
      ? matches
      : matches.filter((m) => m.status === "scheduled").slice(0, 4);
    return (
      <>
        {filters}
        {shown.length
          ? matchCards(shown)
          : empty("No hay partidos publicados para esta selección.")}
        {!full && (
          <div className="p-3 text-center">
            <Link href="/partidos" className="button-secondary">
              Ver todos los partidos
            </Link>
          </div>
        )}
      </>
    );
  }
  if (kind === "standings") {
    // Each division/category is a separate competition; rank them independently.
    const groups = Array.from(
      new Set(filteredTeams.map((t) => `${t.division_id}:${t.category_id}`)),
    );
    return (
      <>
        {filters}
        {!groups.length && empty("Aún no hay equipos registrados.")}
        <div className="overflow-x-auto">
          {groups.map((group) => {
            const [div, cat] = group.split(":").map(Number);
            const list = data.standings.filter(
              (s) =>
                ids.has(s.team_id) &&
                team(s.team_id)?.division_id === div &&
                team(s.team_id)?.category_id === cat,
            );
            return (
              <table key={group} className="roster-table min-w-[510px]">
                <caption className="text-left px-4 py-2 green text-xs">
                  División {data.catalogs.find((c) => c.id === div)?.name} ·{" "}
                  {data.catalogs.find((c) => c.id === cat)?.name}
                </caption>
                <thead>
                  <tr>
                    {["#", "Equipo", "PJ", "G", "E", "P", "DG", "PTS"].map(
                      (h) => (
                        <th key={h}>{h}</th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {list.map((s, i) => (
                    <tr key={s.team_id}>
                      <td>{i + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Crest team={team(s.team_id)} />
                          {s.team}
                        </div>
                      </td>
                      {[s.pj, s.g, s.e, s.p, s.dg, s.pts].map((v, j) => (
                        <td
                          key={j}
                          className={j === 5 ? "green font-bold" : ""}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })}
        </div>
        {!full && (
          <div className="p-3 text-right">
            <Link href="/posiciones" className="text-link">
              Ver tabla completa
            </Link>
          </div>
        )}
      </>
    );
  }
  if (kind === "scorers") {
    const list = data.scorers
      .filter((s) => ids.has(s.team_id))
      .slice(0, full ? undefined : 5);
    return (
      <>
        {filters}
        {list.length ? (
          <div className="divide-y divide-[#294052]">
            {list.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 p-4">
                <span className="green font-bold">{i + 1}</span>
                <Crest team={team(s.team_id)} />
                <div className="flex-1">
                  <strong className="text-sm">{s.name}</strong>
                  <p className="muted text-xs">{s.team}</p>
                </div>
                <strong className="green text-xl">
                  {s.goals} <span className="text-xs">goles</span>
                </strong>
              </div>
            ))}
          </div>
        ) : (
          empty(
            "Los goleadores aparecerán al registrar anotaciones en los partidos finalizados.",
          )
        )}
      </>
    );
  }
  if (kind === "teams")
    return (
      <>
        {filters}
        {!filteredTeams.length ? (
          empty("Aún no hay equipos publicados.")
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTeams.map((t) => {
              const stats = data.standings.find((s) => s.team_id === t.id);
              return (
                <article key={t.id} className="surface p-5">
                  <div className="flex items-center gap-4">
                    <Crest team={t} large />
                    <div>
                      <p className="green text-xs">
                        División {t.division} · {t.category}
                      </p>
                      <h2 className="display-font text-2xl font-bold">
                        {t.name}
                      </h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 text-center mt-5 border-t border-[#294052] pt-4">
                    {[
                      [stats?.pts ?? 0, "PTS"],
                      [stats?.g ?? 0, "GANADOS"],
                      [
                        data.players.filter(
                          (p) => p.team_id === t.id && p.active,
                        ).length,
                        "JUGADORES",
                      ],
                    ].map(([v, label]) => (
                      <div key={label}>
                        <strong className="text-xl">{v}</strong>
                        <span className="block muted text-xs">{label}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/plantillas?equipo=${t.id}`}
                    className="text-link block mt-4"
                  >
                    Ver plantilla →
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </>
    );
  const safeMonth = /^\d{4}-\d{2}$/.test(month)
    ? month
    : new Date().toISOString().slice(0, 7);
  const [year, monthNum] = safeMonth.split("-").map(Number);
  const date = new Date(year, monthNum - 1, 1);
  const offset = (date.getDay() + 6) % 7;
  const count = new Date(year, monthNum, 0).getDate();
  const monthMatches = matches.filter((m) => m.kickoff.startsWith(safeMonth));
  const selected = monthMatches.filter(
    (m) => !day || m.kickoff.startsWith(day),
  );
  function move(delta: number) {
    const next = new Date(year, monthNum - 1 + delta, 1);
    setMonth(
      `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`,
    );
    setDay("");
  }
  return (
    <>
      {filters}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            aria-label="Mes anterior"
            className="button-secondary"
            onClick={() => move(-1)}
          >
            ‹
          </button>
          <strong className="capitalize">
            {date.toLocaleDateString("es-MX", {
              month: "long",
              year: "numeric",
            })}
          </strong>
          <button
            aria-label="Mes siguiente"
            className="button-secondary"
            onClick={() => move(1)}
          >
            ›
          </button>
        </div>
        <div className="grid grid-cols-7 text-center gap-1">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <span key={i} className="muted text-xs p-2">
              {d}
            </span>
          ))}
          {Array.from({ length: offset }, (_, i) => (
            <span key={`empty${i}`} />
          ))}
          {Array.from({ length: count }, (_, i) => {
            const value = `${safeMonth}-${String(i + 1).padStart(2, "0")}`;
            const has = monthMatches.some((m) => m.kickoff.startsWith(value));
            return (
              <button
                key={value}
                aria-pressed={day === value}
                onClick={() => setDay(day === value ? "" : value)}
                className={`rounded p-2 text-xs ${day === value ? "bg-[#73e82d] text-[#06111f]" : has ? "border border-[#73e82d] green" : "text-[#8fa4b4]"}`}
              >
                {i + 1}
                {has && <span className="block">•</span>}
              </button>
            );
          })}
        </div>
      </div>
      {selected.length
        ? matchCards(selected)
        : empty("No hay partidos programados en esta fecha.")}
    </>
  );
}
