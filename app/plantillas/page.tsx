import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Rosters } from "@/components/rosters";

export const metadata: Metadata = { title: "Plantillas" };

export default function PlantillasPage() {
  return <><PageHero kicker="Los protagonistas de la liga" title="Plantillas" description="Conoce a los jugadores de cada equipo de la liga." /><div className="container-shell page-content"><Rosters /></div></>;
}
