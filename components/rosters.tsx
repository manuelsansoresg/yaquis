"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarDays, ChartNoAxesColumnIncreasing, ChevronRight, Shield, UserRound, UsersRound } from "lucide-react";
import { dentistasPlayers, rosterTeams } from "@/data/rosters";
import type { Team } from "@/data/league";

function Crest({ team, large = false }: { team: Team; large?: boolean }) {
  return <span aria-hidden="true" className={`roster-crest ${large ? "roster-crest-large" : ""}`} style={{ background: `linear-gradient(145deg, ${team.colors[0]}, ${team.colors[1]})`, borderColor: team.colors[0] }}>{team.short}</span>;
}

const positionColors = { Portero: "#58baff", Defensa: "#efb44e", Medio: "#73e82d", Delantero: "#fa7f8c" };

export function Rosters() {
  const [division, setDivision] = useState("I");
  const [teamName, setTeamName] = useState("Dentistas FC");
  const team = rosterTeams.find((item) => item.name === teamName)!;
  const published = division === "I";
  const hasRoster = published && team.name === "Dentistas FC";

  return <>
    <div className="roster-divisions" role="group" aria-label="Seleccionar división">
      {["I", "II", "III"].map((item) => <button key={item} type="button" aria-pressed={division === item} onClick={() => { setDivision(item); setTeamName("Dentistas FC"); }} className={division === item ? "button-primary" : "button-secondary"}>División {item}</button>)}
    </div>
    {published ? <div className="roster-layout">
      <aside className="surface roster-sidebar" aria-label="Seleccionar equipo">
        <div className="surface-head"><h2 className="surface-title">Equipos</h2><span className="roster-count">{rosterTeams.length}</span></div>
        <div className="roster-team-list">{rosterTeams.map((item) => <button key={item.name} type="button" aria-pressed={team.name === item.name} onClick={() => setTeamName(item.name)} className={`roster-team ${team.name === item.name ? "is-selected" : ""}`}><Crest team={item} /><span>{item.name}</span><ChevronRight size={16} /></button>)}</div>
      </aside>
      <section className="surface roster-main" aria-labelledby="roster-team-heading">
        <div className="roster-team-header"><Crest team={team} large /><div><span className="roster-badge">División {division}</span><h2 id="roster-team-heading" className="display-font">{team.name}</h2><p><UserRound size={14} /> Director técnico: <span>{hasRoster ? "Dr. Carlos Méndez" : "Por confirmar"}</span></p><p><Shield size={14} /> Responsable: <span>{hasRoster ? "Juan Pérez" : "Por confirmar"}</span></p></div></div>
        <div className="surface-head"><h3 className="surface-title"><UsersRound size={21} className="green" />Plantilla</h3><span className="roster-count">{hasRoster ? `${dentistasPlayers.length} jugadores` : "Pendiente"}</span></div>
        {hasRoster ? <div className="roster-table-wrap"><table className="roster-table"><caption className="sr-only">Plantilla de {team.name}, División {division}</caption><thead><tr><th scope="col">#</th><th scope="col">Jugador</th><th scope="col">Posición</th><th scope="col">Estatus</th></tr></thead><tbody>{dentistasPlayers.map((player) => <tr key={player.number}><td>{player.number}</td><td>{player.name}</td><td style={{ color: positionColors[player.position] }}>{player.position}</td><td><span className="roster-status">Activo</span></td></tr>)}</tbody></table></div> : <div className="roster-empty"><UsersRound size={36} /><h3>Plantilla por publicar</h3><p>Próximamente podrás conocer a los jugadores de {team.name}.</p></div>}
      </section>
      <aside className="surface roster-details" aria-label={`Información de ${team.name}`}>
        <div className="roster-team-banner"><Crest team={team} large /><span className="page-kicker">Somos Familia Yaquis</span><strong className="display-font">{team.name}</strong></div>
        <section className="roster-info-section"><h3 className="surface-title"><UsersRound size={20} className="green" />Información del equipo</h3><dl className="roster-info"><div><dt>Nombre</dt><dd>{team.name}</dd></div><div><dt>División</dt><dd>{division}</dd></div><div><dt>Director técnico</dt><dd>{hasRoster ? "Dr. Carlos Méndez" : "Por confirmar"}</dd></div><div><dt>Responsable</dt><dd>{hasRoster ? "Juan Pérez" : "Por confirmar"}</dd></div></dl></section>
        <section className="roster-info-section"><h3 className="surface-title"><CalendarDays size={20} className="green" />Partidos</h3><Link href="/partidos" className="roster-calendar-link">Ver calendario completo <ArrowRight size={15} /></Link></section>
        <section className="roster-info-section"><h3 className="surface-title"><ChartNoAxesColumnIncreasing size={20} className="green" />Estadísticas del equipo</h3>{hasRoster ? <dl className="roster-stats">{[["Jugados", 6], ["Ganados", 4], ["Empatados", 1], ["Perdidos", 1], ["Goles a favor", 18], ["Goles en contra", 8]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : <p className="muted text-sm">Estadísticas por publicar.</p>}</section>
        <div className="roster-cheer"><Shield size={30} /><p className="display-font">¡Vamos, <span>{team.name}!</span></p></div>
      </aside>
    </div> : <section className="surface roster-empty" aria-live="polite"><UsersRound size={40} /><h2 className="display-font">División {division}</h2><p>Los equipos y sus plantillas se publicarán próximamente.</p></section>}
  </>;
}
