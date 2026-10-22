import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  Check,
  Goal,
  Newspaper,
  Trophy,
  UserPlus,
} from "lucide-react";
import { SectionCard } from "./section-card";
import { getLeague } from "@/lib/league";
import { LeagueSection } from "./league-sections";
import { RegistrationForm } from "./registration-form";

export function Hero() {
  return (
    <section className="relative min-h-[280px] overflow-hidden border-b border-[#2b4254] sm:min-h-[310px]">
      <Image
        src="/assets/hero-football-night.png"
        alt="Cancha de fútbol iluminada durante la noche"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,13,23,.97)_0%,rgba(5,16,29,.76)_52%,rgba(5,16,29,.28)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,17,31,.76),transparent_52%)]" />
      <div className="container-shell relative z-10 grid min-h-[280px] items-center gap-8 py-8 sm:min-h-[310px] md:grid-cols-[1.2fr_.8fr]">
        <div>
          <p className="mb-1 text-[clamp(1rem,2.3vw,1.75rem)] font-black italic tracking-[.04em] text-white">
            LIGA DE FÚTBOL 7
          </p>
          <h1 className="display-font m-0 text-[clamp(4.5rem,10vw,8rem)] font-black italic leading-[.73] tracking-[-.04em] text-white [text-shadow:0_4px_14px_rgba(0,0,0,.5)]">
            YAQUIS
          </h1>
          <div className="mt-5 flex items-center gap-3">
            <span className="h-[3px] w-11 bg-[#73e82d]" />
            <p className="display-font text-base font-bold italic tracking-[.12em] text-white sm:text-lg">
              MÁS QUE UN TORNEO, UNA FAMILIA
            </p>
          </div>
        </div>
        <div className="hidden -rotate-3 justify-self-end border-r-4 border-[#73e82d] pr-6 text-right md:block">
          {["FÚTBOL", "AMIGOS", "RESPETO"].map((word) => (
            <div
              key={word}
              className="display-font text-2xl font-bold italic leading-[1.05] tracking-[.08em] text-white"
            >
              {word}
            </div>
          ))}
          <div className="display-font text-4xl font-black italic leading-none tracking-[.04em] text-white">
            YAQUIS
          </div>
        </div>
      </div>
    </section>
  );
}

export async function UpcomingMatches({ full = false }: { full?: boolean }) {
  return (
    <SectionCard
      title={full ? "PARTIDOS Y RESULTADOS" : "PRÓXIMOS PARTIDOS"}
      icon={CalendarDays}
    >
      <LeagueSection data={await getLeague()} kind="matches" full={full} />
    </SectionCard>
  );
}
export async function StandingsTable({ full = false }: { full?: boolean }) {
  return (
    <SectionCard title="TABLA DE POSICIONES" icon={Trophy}>
      <LeagueSection data={await getLeague()} kind="standings" full={full} />
    </SectionCard>
  );
}
export async function TopScorers({ full = false }: { full?: boolean }) {
  return (
    <SectionCard title="TABLA DE GOLEO" icon={Goal}>
      <LeagueSection data={await getLeague()} kind="scorers" full={full} />
    </SectionCard>
  );
}
export async function MatchCalendar() {
  return (
    <SectionCard title="CALENDARIO DE JUEGOS" icon={CalendarDays}>
      <LeagueSection data={await getLeague()} kind="calendar" />
    </SectionCard>
  );
}
export async function NewsHighlights() {
  const { news } = await getLeague();
  return (
    <SectionCard title="NOTICIAS DE LA LIGA" icon={Newspaper}>
      <div className="divide-y divide-[#294052]">
        {news.length ? (
          news.slice(0, 3).map((item) => (
            <article key={item.id} className="p-4">
              <span className="green text-xs">
                {item.tag} · {item.published_on}
              </span>
              <h3 className="font-bold my-2">{item.title}</h3>
              <p className="muted text-sm whitespace-pre-line">{item.copy}</p>
            </article>
          ))
        ) : (
          <p className="muted text-sm p-5">
            Próximamente publicaremos noticias de la liga.
          </p>
        )}
      </div>
    </SectionCard>
  );
}
export async function RegistrationCard({ full = false }: { full?: boolean }) {
  const data = full ? await getLeague() : null;
  const items = [
    "Nombre del equipo",
    "Nombre del responsable",
    "Teléfono",
    "Categoría",
    "Número de jugadores",
    "Logo del equipo",
  ];
  return (
    <SectionCard title="INSCRIPCIONES" icon={UserPlus}>
      <div className={full ? "grid gap-8 p-6 md:grid-cols-2" : "p-3"}>
        <div>
          <h3
            className={`display-font m-0 font-black leading-tight ${full ? "text-2xl" : "text-lg"}`}
          >
            ¿QUIERES PARTICIPAR EN LA LIGA DE FÚTBOL 7 YAQUIS?
          </h3>
          <p
            className={`${full ? "mb-5 mt-3 text-sm leading-6" : "mb-3 mt-2 text-[.68rem] leading-4"} text-[#9bafbd]`}
          >
            Forma parte de la competencia y demuestra el talento de tu equipo.
          </p>
          <ul
            className={`grid list-none p-0 text-[#c7d2d9] ${full ? "gap-2 text-sm" : "gap-1 text-[.68rem]"}`}
          >
            {items.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-[#73e82d]/12">
                  <Check className="h-3 w-3 text-[#73e82d]" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          {!full && (
            <Link href="/inscripciones" className="button-primary mt-3 w-full">
              Inscribir mi equipo
            </Link>
          )}
        </div>
        {full && (
          <RegistrationForm
            catalogs={data!.catalogs}
            seasonId={data!.seasonId}
          />
        )}
      </div>
    </SectionCard>
  );
}
