import Link from "next/link";
import { MapPin } from "lucide-react";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-[#294052] bg-[#040d16] py-9">
      <div className="container-shell flex flex-col items-center justify-between gap-7 md:flex-row">
        <Logo />
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-[#8fa4b4]">
          <Link href="/partidos">Partidos</Link><Link href="/posiciones">Posiciones</Link><Link href="/equipos">Equipos</Link><Link href="/inscripciones">Inscripciones</Link>
        </div>
        <div className="flex items-center gap-3 text-[#8fa4b4]"><MapPin className="h-4 w-4 text-[#73e82d]" /><span className="text-xs">Cancha Yaquis</span><span className="text-xs font-black">f</span><span className="text-[.62rem] font-black">IG</span></div>
      </div>
      <p className="container-shell mt-7 border-t border-[#1d3040] pt-5 text-center text-[.7rem] tracking-[.08em] text-[#647a8a]">© 2026 LIGA DE FÚTBOL 7 YAQUIS · DISCIPLINA, RESPETO Y PASIÓN</p>
    </footer>
  );
}
