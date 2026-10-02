export type Team = { name: string; short: string; colors: [string, string] };
export type Match = { home: string; away: string; time: string; date: string; venue: string; round: number };
export type Standing = { pos: number; team: string; pj: number; g: number; e: number; p: number; dg: number; pts: number };
export type Scorer = { rank: number; name: string; team: string; goals: number; initials: string };

export const teams: Team[] = [
  { name: "Dentistas FC", short: "DFC", colors: ["#ecf4f9", "#2468a2"] },
  { name: "Cantos FC", short: "CFC", colors: ["#ef3838", "#f6dc39"] },
  { name: "Vecibanda FC", short: "VFC", colors: ["#71e82d", "#0b1724"] },
  { name: "La Ganga FC", short: "LG", colors: ["#f3a22f", "#1d2732"] },
  { name: "CFE ISC FC", short: "CFE", colors: ["#38b6ff", "#f8f8f8"] },
  { name: "Real Suciedad", short: "RS", colors: ["#8d67db", "#f1f4fa"] },
  { name: "Mariscos Vamos con Martin", short: "MVM", colors: ["#ff657a", "#102b49"] },
  { name: "Gineclub", short: "GNC", colors: ["#f4f4f4", "#7cbad9"] },
  { name: "Tequila FC", short: "TFC", colors: ["#e7d84a", "#166a44"] },
  { name: "Drinkers FC", short: "DRK", colors: ["#d33d3d", "#111827"] },
];

export const matches: Match[] = [
  { home: "Dentistas FC", away: "Cantos FC", time: "8:00 PM", date: "Mié. 30 Sep 2026", venue: "Cancha Yaquis", round: 8 },
  { home: "Vecibanda FC", away: "La Ganga FC", time: "9:00 PM", date: "Mié. 30 Sep 2026", venue: "Cancha Yaquis", round: 8 },
  { home: "CFE ISC FC", away: "Real Suciedad", time: "10:00 PM", date: "Mié. 30 Sep 2026", venue: "Cancha Yaquis", round: 8 },
  { home: "Mariscos Vamos con Martin", away: "Gineclub", time: "11:00 PM", date: "Mié. 30 Sep 2026", venue: "Cancha Yaquis", round: 8 },
];

export const standings: Standing[] = [
  { pos: 1, team: "Dentistas FC", pj: 7, g: 6, e: 1, p: 0, dg: 18, pts: 19 },
  { pos: 2, team: "Cantos FC", pj: 7, g: 5, e: 1, p: 1, dg: 12, pts: 16 },
  { pos: 3, team: "Vecibanda FC", pj: 7, g: 4, e: 2, p: 1, dg: 8, pts: 14 },
  { pos: 4, team: "La Ganga FC", pj: 7, g: 4, e: 1, p: 2, dg: 6, pts: 13 },
  { pos: 5, team: "CFE ISC FC", pj: 7, g: 3, e: 2, p: 2, dg: 4, pts: 11 },
  { pos: 6, team: "Real Suciedad", pj: 7, g: 3, e: 1, p: 3, dg: 1, pts: 10 },
  { pos: 7, team: "Mariscos Vamos con Martin", pj: 7, g: 2, e: 2, p: 3, dg: -3, pts: 8 },
  { pos: 8, team: "Gineclub", pj: 7, g: 2, e: 1, p: 4, dg: -5, pts: 7 },
  { pos: 9, team: "Tequila FC", pj: 7, g: 1, e: 2, p: 4, dg: -8, pts: 5 },
  { pos: 10, team: "Drinkers FC", pj: 7, g: 0, e: 0, p: 7, dg: -18, pts: 0 },
];

export const scorers: Scorer[] = [
  { rank: 1, name: "Carlos Martínez", team: "Dentistas FC", goals: 14, initials: "CM" },
  { rank: 2, name: "Luis Ramírez", team: "Cantos FC", goals: 12, initials: "LR" },
  { rank: 3, name: "Diego López", team: "Vecibanda FC", goals: 10, initials: "DL" },
  { rank: 4, name: "José Torres", team: "La Ganga FC", goals: 9, initials: "JT" },
  { rank: 5, name: "Alan Sánchez", team: "CFE ISC FC", goals: 8, initials: "AS" },
];

export const news = [
  { tag: "Jornada 7", title: "Jornada 7 finalizada", copy: "Ya están los resultados, posiciones y estadísticas actualizadas.", date: "28 Sep 2026" },
  { tag: "Inscripciones abiertas", title: "¡Ya están abiertas las inscripciones!", copy: "Registra a tu equipo para el próximo torneo.", date: "15 Sep 2026" },
  { tag: "Torneo relámpago", title: "Se viene el torneo relámpago", copy: "No te quedes fuera, pregunta por los detalles.", date: "10 Sep 2026" },
];

export const calendarDays = [
  ...Array.from({ length: 2 }, () => null),
  ...Array.from({ length: 30 }, (_, index) => index + 1),
];

export function getTeam(name: string) {
  return teams.find((team) => team.name === name) ?? teams[0];
}
