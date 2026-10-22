import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { getLeague } from "@/lib/league";
import { currentUser } from "@/lib/auth";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "Liga de Fútbol 7 Yaquis",
    template: "%s | Liga Yaquis",
  },
  description:
    "Partidos, posiciones, goleadores, equipos e inscripciones de la Liga de Fútbol 7 Yaquis.",
  icons: { icon: "/favicon.svg" },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, user] = await Promise.all([getLeague(), currentUser()]);
  return (
    <html lang="es">
      <body>
        <Header seasons={data.seasons} seasonId={data.seasonId} user={user} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
