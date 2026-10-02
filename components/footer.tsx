import Link from "next/link";
import { MapPin } from "lucide-react";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-[#294052] bg-[#040d16] py-5">
      <div className="container-shell grid items-center gap-5 text-center md:grid-cols-[1fr_1fr_1fr]">
        <div className="justify-self-center md:justify-self-start"><Logo compact /></div>
        <div><p className="display-font m-0 -rotate-2 text-2xl font-bold italic text-white">EL FÚTBOL NOS UNE</p><span className="mx-auto mt-1 block h-[3px] w-32 -rotate-3 bg-[#73e82d]" /></div>
        <div className="flex items-center justify-center gap-3 text-[#8fa4b4] md:justify-self-end"><span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-black text-[#071522]">f</span><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-white text-[.55rem] font-black text-white">IG</span><MapPin className="ml-2 h-5 w-5 text-[#a9bac6]" /><span className="text-left text-xs">Cancha Yaquis<br /><small>Cd. Obregón, Son.</small></span></div>
      </div>
      <nav className="container-shell mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-[#162939] pt-3 text-[.65rem] text-[#647a8a]" aria-label="Navegación del pie"><Link href="/partidos">Partidos</Link><Link href="/posiciones">Posiciones</Link><Link href="/equipos">Equipos</Link><Link href="/inscripciones">Inscripciones</Link></nav>
    </footer>
  );
}
