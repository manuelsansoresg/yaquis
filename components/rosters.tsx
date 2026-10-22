"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  ChevronRight,
  Shield,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { LeagueData } from "@/lib/league";
import { Crest as LeagueCrest } from "./league-sections";

const positionColors = {
  Portero: "#58baff",
  Defensa: "#efb44e",
  Medio: "#73e82d",
  Delantero: "#fa7f8c",
};

export function Rosters({
  data,
  initialTeam,
}: {
  data: LeagueData;
  initialTeam?: number;
}) {
  const [division, setDivision] = useState(
    String(
      data.teams.find((t) => t.id === initialTeam)?.division_id ??
        data.catalogs.find((c) => c.kind === "division")?.id ??
        "",
    ),
  );
  const [teamName, setTeamName] = useState(
    data.teams.find((t) => t.id === initialTeam)?.name ??
      data.teams[0]?.name ??
      "",
  );
  const rosterTeams = data.teams.filter(
    (t) => String(t.division_id) === division,
  );
  const team =
    rosterTeams.find((item) => item.name === teamName) ?? rosterTeams[0];
  const published = Boolean(team);
  const players = data.players.filter((p) => p.team_id === team?.id);
  const hasRoster = players.length > 0;
  const stats = data.standings.find((s) => s.team_id === team?.id);
  const divisionName =
    data.catalogs.find((c) => String(c.id) === division)?.name ?? "";
  const divisions = data.catalogs.filter(
    (c) => c.kind === "division" && c.active,
  );

  return (
    <>
      <div
        className="roster-divisions"
        role="group"
        aria-label="Seleccionar división"
      >
        {divisions.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={division === String(item.id)}
            onClick={() => {
              setDivision(String(item.id));
              setTeamName("");
            }}
            className={
              division === String(item.id)
                ? "button-primary"
                : "button-secondary"
            }
          >
            División {item.name}
          </button>
        ))}
      </div>
      {published ? (
        <div className="roster-layout">
          <aside
            className="surface roster-sidebar"
            aria-label="Seleccionar equipo"
          >
            <div className="surface-head">
              <h2 className="surface-title">Equipos</h2>
              <span className="roster-count">{rosterTeams.length}</span>
            </div>
            <div className="roster-team-list">
              {rosterTeams.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  aria-pressed={team.name === item.name}
                  onClick={() => setTeamName(item.name)}
                  className={`roster-team ${team.name === item.name ? "is-selected" : ""}`}
                >
                  <LeagueCrest team={item} />
                  <span>{item.name}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </aside>
          <section
            className="surface roster-main"
            aria-labelledby="roster-team-heading"
          >
            <div className="roster-team-header">
              <LeagueCrest team={team} large />
              <div>
                <span className="roster-badge">División {divisionName}</span>
                <h2 id="roster-team-heading" className="display-font">
                  {team.name}
                </h2>
                <p>
                  <UserRound size={14} /> Director técnico:{" "}
                  <span>{team.coach || "Por confirmar"}</span>
                </p>
                <p>
                  <Shield size={14} /> Responsable:{" "}
                  <span>{team.manager || "Por confirmar"}</span>
                </p>
              </div>
            </div>
            <div className="surface-head">
              <h3 className="surface-title">
                <UsersRound size={21} className="green" />
                Plantilla
              </h3>
              <span className="roster-count">
                {hasRoster ? `${players.length} jugadores` : "Pendiente"}
              </span>
            </div>
            {hasRoster ? (
              <div className="roster-table-wrap">
                <table className="roster-table">
                  <caption className="sr-only">
                    Plantilla de {team.name}, División {divisionName}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Jugador</th>
                      <th scope="col">Posición</th>
                      <th scope="col">Estatus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player) => (
                      <tr key={player.number}>
                        <td>{player.number}</td>
                        <td>{player.name}</td>
                        <td
                          style={{
                            color:
                              positionColors[
                                player.position as keyof typeof positionColors
                              ] ?? "#b5c8d5",
                          }}
                        >
                          {player.position}
                        </td>
                        <td>
                          <span className="roster-status">
                            {player.active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="roster-empty">
                <UsersRound size={36} />
                <h3>Plantilla por publicar</h3>
                <p>
                  Próximamente podrás conocer a los jugadores de {team.name}.
                </p>
              </div>
            )}
          </section>
          <aside
            className="surface roster-details"
            aria-label={`Información de ${team.name}`}
          >
            <div className="roster-team-banner">
              <LeagueCrest team={team} large />
              <span className="page-kicker">Somos Familia Yaquis</span>
              <strong className="display-font">{team.name}</strong>
            </div>
            <section className="roster-info-section">
              <h3 className="surface-title">
                <UsersRound size={20} className="green" />
                Información del equipo
              </h3>
              <dl className="roster-info">
                <div>
                  <dt>Nombre</dt>
                  <dd>{team.name}</dd>
                </div>
                <div>
                  <dt>División</dt>
                  <dd>{divisionName}</dd>
                </div>
                <div>
                  <dt>Director técnico</dt>
                  <dd>{team.coach || "Por confirmar"}</dd>
                </div>
                <div>
                  <dt>Responsable</dt>
                  <dd>{team.manager || "Por confirmar"}</dd>
                </div>
              </dl>
            </section>
            <section className="roster-info-section">
              <h3 className="surface-title">
                <CalendarDays size={20} className="green" />
                Partidos
              </h3>
              <Link href="/partidos" className="roster-calendar-link">
                Ver calendario completo <ArrowRight size={15} />
              </Link>
            </section>
            <section className="roster-info-section">
              <h3 className="surface-title">
                <ChartNoAxesColumnIncreasing size={20} className="green" />
                Estadísticas del equipo
              </h3>
              {stats ? (
                <dl className="roster-stats">
                  {[
                    ["Jugados", stats?.pj ?? 0],
                    ["Ganados", stats?.g ?? 0],
                    ["Empatados", stats?.e ?? 0],
                    ["Perdidos", stats?.p ?? 0],
                    ["Goles a favor", stats?.gf ?? 0],
                    ["Goles en contra", stats?.gc ?? 0],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="muted text-sm">Estadísticas por publicar.</p>
              )}
            </section>
            <div className="roster-cheer">
              <Shield size={30} />
              <p className="display-font">
                ¡Vamos, <span>{team.name}!</span>
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <section className="surface roster-empty" aria-live="polite">
          <UsersRound size={40} />
          <h2 className="display-font">División {divisionName}</h2>
          <p>Los equipos y sus plantillas se publicarán próximamente.</p>
        </section>
      )}
    </>
  );
}
