import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { TeamsGrid } from "@/components/teams-grid";

export const metadata: Metadata = { title: "Equipos" };
export default function EquiposPage() { return <><PageHero kicker="Los protagonistas" title="Equipos" description="Conoce a los diez equipos que compiten por levantar el trofeo de la Liga Yaquis." /><div className="container-shell page-content"><TeamsGrid /></div></>; }
