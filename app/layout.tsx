import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
