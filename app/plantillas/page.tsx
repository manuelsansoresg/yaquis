import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Rosters } from "@/components/rosters";

export const metadata: Metadata = { title: "Plantillas" };

import { getLeague } from "@/lib/league";

export default async function PlantillasPage({
  searchParams,
}: {
  searchParams: Promise<{ equipo?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      <PageHero
        kicker="Los protagonistas de la liga"
        title="Plantillas"
        description="Conoce a los jugadores de cada equipo de la liga."
      />
      <div className="container-shell page-content">
        <Rosters data={await getLeague()} initialTeam={Number(params.equipo)} />
      </div>
    </>
  );
}
