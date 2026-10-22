"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  Goal,
  Home,
  LayoutDashboard,
  Menu,
  Shield,
  Table2,
  UserPlus,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import type { Catalog } from "@/lib/league";
import type { User } from "@/lib/auth";
import { Logo } from "./logo";

const navItems = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Partidos", href: "/partidos", icon: CalendarDays },
  { label: "Posiciones", href: "/posiciones", icon: Table2 },
  { label: "Goleadores", href: "/goleadores", icon: Goal },
  { label: "Equipos", href: "/equipos", icon: Users },
  { label: "Plantillas", href: "/plantillas", icon: UsersRound },
  { label: "Inscripciones", href: "/inscripciones", icon: UserPlus },
];

export function Header({
  seasons,
  seasonId,
  user,
}: {
  seasons: Catalog[];
  seasonId?: number;
  user: User | null;
}) {
  const router = useRouter();
  const [seasonError, setSeasonError] = useState("");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  async function changeSeason(id: string) {
    setSeasonError("");
    try {
      const response = await fetch("/api/season", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("No se pudo cambiar la temporada.");
      router.refresh();
    } catch {
      setSeasonError("No se pudo cambiar la temporada. Intenta de nuevo.");
    }
  }
  async function endSession() {
    try {
      const response = await fetch("/api/auth", { method: "DELETE" });
      if (!response.ok) throw new Error();
      router.push("/");
      router.refresh();
      setOpen(false);
    } catch {
      setSeasonError("No se pudo cerrar sesión. Intenta de nuevo.");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#294052] bg-[#06111f]/96 backdrop-blur-xl">
      <div className="container-shell grid min-h-[88px] grid-cols-[1fr_auto] items-center gap-x-5 min-[900px]:min-h-[126px] min-[900px]:grid-cols-[320px_1fr] min-[900px]:grid-rows-[48px_78px] xl:grid-cols-[355px_1fr]">
        <Link
          href="/"
          aria-label="Liga Yaquis, inicio"
          onClick={() => setOpen(false)}
          className="min-[900px]:row-span-2"
        >
          <Logo />
        </Link>
        <div className="hidden items-center justify-end gap-3 min-[900px]:flex">
          <label className="sr-only" htmlFor="season">
            Temporada
          </label>
          <select
            value={seasonId ?? ""}
            onChange={(e) => changeSeason(e.target.value)}
            id="season"
            className="rounded-md border border-[#2e485b] bg-[#0c2030] px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#73e82d]"
          >
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                Temporada {s.name}
              </option>
            ))}
          </select>
          <Link
            href={user?.role === "admin" ? "/admin" : "/login"}
            aria-label={user?.role === "admin" ? "Abrir panel administrativo" : undefined}
            className={user?.role === "admin" ? "inline-flex items-center gap-2 rounded-md border border-[#73e82d]/40 bg-[#73e82d]/10 px-3 py-2 text-xs font-bold green transition hover:bg-[#73e82d]/20" : "text-xs font-bold green"}
          >
            {user?.role === "admin" && <LayoutDashboard className="h-4 w-4" aria-hidden="true" />}
            {user?.role === "admin"
              ? "Administración"
              : user
                ? user.name
                : "Ingresar"}
          </Link>
          {user?.role === "user" && (
            <button onClick={endSession} className="text-xs green">
              Cerrar sesión
            </button>
          )}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="grid h-7 w-7 place-items-center rounded-full bg-[#dce5eb] text-xs font-black text-[#081522] transition hover:bg-[#73e82d]"
          >
            f
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#dce5eb] text-[.55rem] font-black text-[#dce5eb] transition hover:border-[#73e82d] hover:text-[#73e82d]"
          >
            IG
          </a>
        </div>
        <nav
          className="hidden h-full items-stretch justify-end border-t border-[#102537] min-[900px]:flex"
          aria-label="Navegación principal"
        >
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`group relative flex min-w-[72px] flex-col items-center justify-center gap-1 px-2 text-[.73rem] font-medium transition xl:min-w-[88px] ${active ? "text-[#73e82d]" : "text-white hover:text-[#73e82d]"}`}
              >
                <Icon className="h-[22px] w-[22px]" strokeWidth={2.4} />
                {label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-[4px] bg-[#73e82d] transition ${active ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`}
                />
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 min-[900px]:hidden">
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              aria-label="Abrir panel administrativo"
              aria-current={pathname.startsWith("/admin") ? "page" : undefined}
              title="Panel administrativo"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-[#73e82d]/40 bg-[#73e82d]/10 text-[#73e82d] transition hover:bg-[#73e82d]/20"
            >
              <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-[#2e485b] text-white"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {seasonError && (
        <p role="alert" className="container-shell text-sm text-red-300">
          {seasonError}
        </p>
      )}
      {open && (
        <div className="border-t border-[#294052] bg-[#071522] min-[900px]:hidden">
          <nav
            className="container-shell grid gap-1 py-3"
            aria-label="Navegación móvil"
          >
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold uppercase tracking-[.06em] ${pathname === href ? "bg-[#122b3e] text-[#73e82d]" : "text-[#c6d1d9]"}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <Link
              href={user?.role === "admin" ? "/admin" : "/login"}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 green font-bold"
            >
              {user?.role === "admin" && <LayoutDashboard className="h-4 w-4" aria-hidden="true" />}
              {user?.role === "admin"
                ? "Administración"
                : user
                  ? user.name
                  : "Ingresar"}
            </Link>
            {user?.role === "user" && (
              <button
                onClick={endSession}
                className="text-left px-3 py-3 green"
              >
                Cerrar sesión
              </button>
            )}
            <label className="px-3 text-xs muted">
              Temporada
              <select
                value={seasonId ?? ""}
                className="ml-3 bg-[#0c2030] p-2 border border-[#294052]"
                onChange={(e) => changeSeason(e.target.value)}
              >
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-2 flex items-center justify-between border-t border-[#294052] px-3 pt-3 text-sm text-[#a9bac6]">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#73e82d]" />
                Temporada {seasons.find((s) => s.id === seasonId)?.name}
              </span>
              <span className="flex gap-4 text-xs font-black">
                <span>f</span>
                <span>IG</span>
              </span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
