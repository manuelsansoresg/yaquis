import type { Metadata } from "next";
import { StandingsTable } from "@/components/home-sections";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Posiciones" };
export default function PosicionesPage() { return <><PageHero kicker="División A" title="Posiciones" description="Clasificación general actualizada después de siete jornadas de competencia." /><div className="container-shell page-content"><StandingsTable full /></div></>; }
