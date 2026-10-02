import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Check, ChevronRight, Clock3, Goal, MapPin, Newspaper, Phone, Trophy, UserPlus } from "lucide-react";
import { calendarDays, matches, news, scorers, standings } from "@/data/league";
import { SectionCard } from "./section-card";
import { TeamCrest } from "./team-crest";

export function Hero() {
  return (
    <section className="relative min-h-[280px] overflow-hidden border-b border-[#2b4254] sm:min-h-[310px]">
      <Image src="/assets/hero-football-night.png" alt="Cancha de fútbol iluminada durante la noche" fill priority className="object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,13,23,.97)_0%,rgba(5,16,29,.76)_52%,rgba(5,16,29,.28)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,17,31,.76),transparent_52%)]" />
      <div className="container-shell relative z-10 grid min-h-[280px] items-center gap-8 py-8 sm:min-h-[310px] md:grid-cols-[1.2fr_.8fr]">
        <div>
          <p className="mb-1 text-[clamp(1rem,2.3vw,1.75rem)] font-black italic tracking-[.04em] text-white">LIGA DE FÚTBOL 7</p>
          <h1 className="display-font m-0 text-[clamp(4.5rem,10vw,8rem)] font-black italic leading-[.73] tracking-[-.04em] text-white [text-shadow:0_4px_14px_rgba(0,0,0,.5)]">YAQUIS</h1>
          <div className="mt-5 flex items-center gap-3"><span className="h-[3px] w-11 bg-[#73e82d]" /><p className="display-font text-base font-bold italic tracking-[.12em] text-white sm:text-lg">MÁS QUE UN TORNEO, UNA FAMILIA</p></div>
        </div>
        <div className="hidden -rotate-3 justify-self-end border-r-4 border-[#73e82d] pr-6 text-right md:block">
          {["FÚTBOL", "AMIGOS", "RESPETO"].map((word) => <div key={word} className="display-font text-2xl font-bold italic leading-[1.05] tracking-[.08em] text-white">{word}</div>)}
          <div className="display-font text-4xl font-black italic leading-none tracking-[.04em] text-white">YAQUIS</div>
        </div>
      </div>
    </section>
  );
}

export function UpcomingMatches({ full = false }: { full?: boolean }) {
  return (
    <SectionCard title={full ? "ROL DE PARTIDOS" : "PRÓXIMOS PARTIDOS"} icon={CalendarDays} action={!full && <Link href="/partidos" className="text-link">Ver todos <ChevronRight className="inline h-3.5 w-3.5" /></Link>}>
      <div className="flex items-center justify-between px-4 py-3"><span className="display-font font-bold tracking-[.08em]">JORNADA 8</span><span className="rounded bg-[#73e82d]/10 px-2 py-1 text-xs font-bold text-[#73e82d]">30 SEP</span></div>
      <div className="grid gap-2 px-3">
        {matches.map((match) => (
          <article key={`${match.home}-${match.away}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-md border border-[#274257] bg-[#091b2a]/60 px-2.5 py-3 transition hover:border-[#41647d] hover:bg-[#12283a]/55 sm:px-3">
            <div className="flex items-center justify-end gap-2 text-right"><TeamCrest name={match.home} /><span className="text-[.72rem] font-bold leading-tight sm:text-sm">{match.home}</span></div>
            <div className="text-center"><span className="display-font text-xl font-black text-[#73e82d]">VS</span><div className="mt-1 flex items-center justify-center gap-1 text-[.67rem] text-[#8fa4b4]"><Clock3 className="h-3 w-3" />{match.time}</div></div>
            <div className="flex flex-row-reverse items-center justify-end gap-2 text-left"><TeamCrest name={match.away} /><span className="text-[.72rem] font-bold leading-tight sm:text-sm">{match.away}</span></div>
            <div className="col-span-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[.62rem] text-[#8196a6] sm:text-[.65rem]"><span>{match.date}</span><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{match.venue}</span></div>
          </article>
        ))}
      </div>
      {!full && <div className="flex justify-center p-3"><Link href="/partidos" className="button-secondary min-w-[220px]">Ver todos los partidos</Link></div>}
    </SectionCard>
  );
}

export function StandingsTable({ full = false }: { full?: boolean }) {
  const rows = standings;
  return (
    <SectionCard title="TABLA DE POSICIONES" icon={Trophy} action={<select aria-label="División" className="rounded border border-[#365164] bg-[#0b1b29] px-2 py-1.5 text-xs text-white"><option>División A</option></select>}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] border-collapse text-[.78rem]">
          <thead className="bg-[#091927] text-[.65rem] uppercase tracking-[.08em] text-[#8298a8]"><tr><th className="px-3 py-3 text-center">#</th><th className="px-2 py-3 text-left">Equipo</th>{["PJ", "G", "E", "P", "DG", "PTS"].map((label) => <th key={label} className="px-2 py-3 text-center">{label}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#203647]">
            {rows.map((row) => <tr key={row.team} className="hover:bg-[#132a3c]/55"><td className={`border-l-2 px-2 py-2 text-center ${row.pos <= 3 ? "border-[#73e82d]" : "border-transparent"}`}><span className="font-black text-[#aab9c4]">{row.pos}</span></td><td className="px-2 py-2"><div className="flex items-center gap-2"><TeamCrest name={row.team} size="sm" /><span className="max-w-[190px] truncate font-semibold">{row.team}</span></div></td><td className="px-2 text-center text-[#b6c6d1]">{row.pj}</td><td className="px-2 text-center text-[#b6c6d1]">{row.g}</td><td className="px-2 text-center text-[#b6c6d1]">{row.e}</td><td className="px-2 text-center text-[#b6c6d1]">{row.p}</td><td className="px-2 text-center text-[#b6c6d1]">{row.dg > 0 ? "+" : ""}{row.dg}</td><td className="px-2 text-center text-base font-black text-white">{row.pts}</td></tr>)}
          </tbody>
        </table>
      </div>
      {!full && <div className="flex justify-end p-3"><Link href="/posiciones" className="button-secondary min-w-[190px]">Ver tabla completa</Link></div>}
    </SectionCard>
  );
}

export function TopScorers({ full = false }: { full?: boolean }) {
  return (
    <SectionCard title="TABLA DE GOLEO" icon={Goal} action={!full && <Link href="/goleadores" className="text-link">Ver todos</Link>}>
      <div className="divide-y divide-[#21384a]">
        {scorers.map((scorer) => <div key={scorer.name} className="grid grid-cols-[1.5rem_2.35rem_1fr_auto] items-center gap-2.5 px-4 py-2.5"><span className={`display-font text-center text-lg font-black ${scorer.rank === 1 ? "text-[#73e82d]" : "text-[#8297a6]"}`}>{scorer.rank}</span><span className="grid h-9 w-9 place-items-center rounded-full border border-[#3d596b] bg-[#173247] text-[.65rem] font-black text-white">{scorer.initials}</span><div><p className="m-0 text-[.78rem] font-bold">{scorer.name}</p><p className="m-0 mt-0.5 text-[.62rem] text-[#8398a7]">{scorer.team}</p></div><div className="text-right"><span className="display-font text-xl font-black text-[#73e82d]">{scorer.goals}</span><span className="ml-1 text-[.6rem] uppercase text-[#8398a7]">goles</span></div></div>)}
      </div>
    </SectionCard>
  );
}

export function MatchCalendar() {
  return (
    <SectionCard title="CALENDARIO DE JUEGOS" icon={CalendarDays}>
      <div className="grid gap-5 p-5 lg:grid-cols-[1.05fr_.95fr]">
        <div><div className="mb-4 flex items-center justify-between"><button aria-label="Mes anterior" className="text-[#8fa4b4]">‹</button><strong className="display-font tracking-[.08em]">SEPTIEMBRE 2026</strong><button aria-label="Mes siguiente" className="text-[#8fa4b4]">›</button></div><div className="grid grid-cols-7 text-center text-[.64rem] font-bold text-[#758a99]">{["L", "M", "M", "J", "V", "S", "D"].map((day, index) => <span key={`${day}-${index}`} className="py-2">{day}</span>)}{calendarDays.map((day, index) => <span key={index} className={`mx-auto grid h-8 w-8 place-items-center rounded-full text-xs ${day === 30 ? "bg-[#73e82d] font-black text-[#06111f] shadow-[0_0_18px_rgba(115,232,45,.35)]" : day ? "text-[#c4d0d8]" : ""}`}>{day}</span>)}</div></div>
        <div className="rounded-lg border border-[#2c4557] bg-[#0a1b2a] p-4"><p className="display-font m-0 mb-1 font-black tracking-[.1em] text-[#73e82d]">JORNADA 8</p><p className="m-0 mb-3 text-xs text-[#8197a6]">Miércoles 30 de septiembre</p><div className="divide-y divide-[#263d4e]">{matches.map((match) => <div key={match.time} className="flex items-center justify-between gap-3 py-3 text-xs"><span>{match.home.replace(" FC", "")} <b className="px-1 text-[#6f8494]">vs</b> {match.away.replace(" FC", "")}</span><strong className="whitespace-nowrap text-[#73e82d]">{match.time}</strong></div>)}</div></div>
      </div>
      <div className="px-5 pb-5"><Link href="/partidos" className="button-secondary w-full">Ver calendario completo</Link></div>
    </SectionCard>
  );
}

export function NewsHighlights() {
  return (
    <SectionCard title="NOTICIAS Y DESTACADOS" icon={Newspaper}>
      <div className="divide-y divide-[#21384a]">{news.map((item, index) => <article key={item.title} className="group grid grid-cols-[4px_1fr] gap-3 px-3 py-3"><span className={index === 0 ? "bg-[#73e82d]" : "bg-[#2d4a5f]"} /><div><span className="text-[.58rem] font-black uppercase tracking-[.1em] text-[#73e82d]">{item.tag}</span><h3 className="display-font mb-0.5 mt-1 text-[.92rem] font-bold group-hover:text-[#73e82d]">{item.title}</h3><p className="m-0 text-[.68rem] leading-4 text-[#8fa4b4]">{item.copy}</p><time className="mt-1 block text-right text-[.6rem] text-[#607788]">{item.date}</time></div></article>)}</div>
    </SectionCard>
  );
}

export function RegistrationCard({ full = false }: { full?: boolean }) {
  const items = ["Nombre del equipo", "Nombre del responsable", "Teléfono", "Categoría", "Número de jugadores", "Logo del equipo"];
  return (
    <SectionCard title="INSCRIPCIONES" icon={UserPlus}>
      <div className={full ? "grid gap-8 p-6 md:grid-cols-2" : "p-3"}>
        <div><h3 className={`display-font m-0 font-black leading-tight ${full ? "text-2xl" : "text-lg"}`}>¿QUIERES PARTICIPAR EN LA LIGA DE FÚTBOL 7 YAQUIS?</h3><p className={`${full ? "mb-5 mt-3 text-sm leading-6" : "mb-3 mt-2 text-[.68rem] leading-4"} text-[#9bafbd]`}>Forma parte de la competencia y demuestra el talento de tu equipo.</p><ul className={`grid list-none p-0 text-[#c7d2d9] ${full ? "gap-2 text-sm" : "gap-1 text-[.68rem]"}`}>{items.map((item) => <li key={item} className="flex items-center gap-2"><span className="grid h-4 w-4 place-items-center rounded-full bg-[#73e82d]/12"><Check className="h-3 w-3 text-[#73e82d]" /></span>{item}</li>)}</ul>{!full && <Link href="/inscripciones" className="button-primary mt-3 w-full">Inscribir mi equipo</Link>}<p className="mb-0 mt-3 flex items-center justify-center gap-2 text-[.62rem] text-[#8196a5]"><Phone className="h-3.5 w-3.5 text-[#73e82d]" />¿Dudas? (644) 000 0000</p></div>
        {full && <RegistrationForm />}
      </div>
    </SectionCard>
  );
}

function RegistrationForm() {
  return <form className="grid gap-4 rounded-lg border border-[#2c4557] bg-[#081927] p-5" action="#"><label className="grid gap-1.5 text-xs font-bold uppercase tracking-[.07em] text-[#9bafbd]">Nombre del equipo<input className="rounded-md border border-[#304b5e] bg-[#0f2637] px-3 py-3 text-sm font-normal normal-case text-white outline-none focus:border-[#73e82d]" placeholder="Ej. Guerreros FC" /></label><label className="grid gap-1.5 text-xs font-bold uppercase tracking-[.07em] text-[#9bafbd]">Nombre del responsable<input className="rounded-md border border-[#304b5e] bg-[#0f2637] px-3 py-3 text-sm font-normal normal-case text-white outline-none focus:border-[#73e82d]" placeholder="Nombre completo" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-xs font-bold uppercase tracking-[.07em] text-[#9bafbd]">Teléfono<input className="rounded-md border border-[#304b5e] bg-[#0f2637] px-3 py-3 text-sm font-normal normal-case text-white outline-none focus:border-[#73e82d]" placeholder="(644) 000 0000" /></label><label className="grid gap-1.5 text-xs font-bold uppercase tracking-[.07em] text-[#9bafbd]">Categoría<select className="rounded-md border border-[#304b5e] bg-[#0f2637] px-3 py-3 text-sm font-normal normal-case text-white outline-none focus:border-[#73e82d]"><option>Libre</option><option>Veteranos</option><option>Juvenil</option></select></label></div><button type="submit" className="button-primary mt-2">Enviar solicitud</button><p className="m-0 text-center text-[.68rem] leading-5 text-[#6f8494]">Formulario demostrativo. La solicitud no se envía todavía.</p></form>;
}
