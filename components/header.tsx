"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CalendarDays, Goal, Home, Menu, Shield, Table2, UserPlus, Users, X } from "lucide-react";
import { Logo } from "./logo";

const navItems = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Partidos", href: "/partidos", icon: CalendarDays },
  { label: "Posiciones", href: "/posiciones", icon: Table2 },
  { label: "Goleadores", href: "/goleadores", icon: Goal },
  { label: "Equipos", href: "/equipos", icon: Users },
  { label: "Inscripciones", href: "/inscripciones", icon: UserPlus },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#294052] bg-[#06111f]/95 backdrop-blur-xl">
      <div className="container-shell flex min-h-[78px] items-center justify-between gap-5">
        <Link href="/" aria-label="Liga Yaquis, inicio" onClick={() => setOpen(false)}><Logo /></Link>
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Navegación principal">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`group relative flex items-center gap-1.5 px-2.5 py-7 text-[.72rem] font-bold uppercase tracking-[.08em] transition ${active ? "text-[#73e82d]" : "text-[#b6c4ce] hover:text-white"}`}>
                <Icon className="h-4 w-4" />{label}
                <span className={`absolute inset-x-2 bottom-0 h-[3px] rounded-t bg-[#73e82d] transition ${active ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <label className="sr-only" htmlFor="season">Temporada</label>
          <select id="season" className="rounded-md border border-[#2e485b] bg-[#0c2030] px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#73e82d]">
            <option>Temporada 2026</option>
          </select>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-md border border-[#2e485b] text-xs font-black text-[#b6c4ce] hover:border-[#73e82d] hover:text-[#73e82d]">f</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-md border border-[#2e485b] text-[.62rem] font-black text-[#b6c4ce] hover:border-[#73e82d] hover:text-[#73e82d]">IG</a>
        </div>
        <button type="button" onClick={() => setOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-md border border-[#2e485b] text-white xl:hidden" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[#294052] bg-[#071522] xl:hidden">
          <nav className="container-shell grid gap-1 py-3" aria-label="Navegación móvil">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold uppercase tracking-[.06em] ${pathname === href ? "bg-[#122b3e] text-[#73e82d]" : "text-[#c6d1d9]"}`}>
                <Icon className="h-4 w-4" />{label}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-[#294052] px-3 pt-3 text-sm text-[#a9bac6]"><span className="flex items-center gap-2"><Shield className="h-4 w-4 text-[#73e82d]" />Temporada 2026</span><span className="flex gap-4 text-xs font-black"><span>f</span><span>IG</span></span></div>
          </nav>
        </div>
      )}
    </header>
  );
}
