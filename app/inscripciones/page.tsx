import type { Metadata } from "next";
import { RegistrationCard } from "@/components/home-sections";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Inscripciones" };
export default function InscripcionesPage() { return <><PageHero kicker="Tu equipo, tu historia" title="Inscripciones" description="Reúne a tu plantel y da el primer paso para competir en la próxima temporada." /><div className="container-shell page-content"><RegistrationCard full /></div></>; }
