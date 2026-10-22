import type { Metadata } from "next";
import { StandingsTable } from "@/components/home-sections";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Posiciones" };
export default function PosicionesPage() {
  return (
    <>
      <PageHero
        kicker="Clasificación de la liga"
        title="Posiciones"
        description="Clasificación calculada con los resultados registrados de cada división y categoría."
      />
      <div className="container-shell page-content">
        <StandingsTable full />
      </div>
    </>
  );
}
