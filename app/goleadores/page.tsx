import { TopScorers } from "@/components/home-sections";
import { PageHero } from "@/components/page-hero";
export const metadata = { title: "Goleadores" };
export default function GoleadoresPage() {
  return (
    <>
      <PageHero
        kicker="Estadísticas individuales"
        title="Goleadores"
        description="Anotaciones registradas en los partidos finalizados de la temporada seleccionada."
      />
      <div className="container-shell page-content">
        <TopScorers full />
      </div>
    </>
  );
}
