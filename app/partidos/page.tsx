import type { Metadata } from "next";
import { MatchCalendar, UpcomingMatches } from "@/components/home-sections";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Partidos" };
export default function PartidosPage() { return <><PageHero kicker="Temporada 2026" title="Partidos" description="Consulta el rol de juegos, horarios y sede de la próxima jornada de la Liga Yaquis." /><div className="container-shell page-content grid gap-5 lg:grid-cols-[1.05fr_.95fr]"><UpcomingMatches full /><MatchCalendar /></div></>; }
