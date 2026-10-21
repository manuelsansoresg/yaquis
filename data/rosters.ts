import { teams, type Team } from "./league";

export type Player = { number: number; name: string; position: "Portero" | "Defensa" | "Medio" | "Delantero" };

// Transcribed from the supplied Plantillas reference. Other rosters await publication.
export const dentistasPlayers: Player[] = [
  { number: 1, name: "Luis Hernández", position: "Portero" },
  { number: 2, name: "Daniel Torres", position: "Portero" },
  { number: 3, name: "Raúl García", position: "Defensa" },
  { number: 4, name: "Jorge Valenzuela", position: "Defensa" },
  { number: 5, name: "Carlos López", position: "Defensa" },
  { number: 6, name: "Miguel Ríos", position: "Defensa" },
  { number: 7, name: "Eduardo Ramírez", position: "Medio" },
  { number: 8, name: "Fernando Soto", position: "Medio" },
  { number: 9, name: "Diego Martínez", position: "Medio" },
  { number: 10, name: "Luis Aguilar", position: "Medio" },
  { number: 11, name: "Andrés Flores", position: "Delantero" },
  { number: 12, name: "Brayan Sánchez", position: "Delantero" },
  { number: 13, name: "Sebastián Vega", position: "Delantero" },
  { number: 14, name: "Roberto Castro", position: "Delantero" },
  { number: 15, name: "Alan Pérez", position: "Delantero" },
  { number: 16, name: "Héctor Morales", position: "Delantero" },
  { number: 18, name: "Iván Díaz", position: "Portero" },
];

const referenceTeams: Team[] = [
  { name: "Epstein FC", short: "EFC", colors: ["#e65468", "#451b30"] },
  { name: "Manolos Bar FC", short: "MB", colors: ["#d6b665", "#3f331d"] },
  { name: "Guasave FC", short: "GFC", colors: ["#73e82d", "#123c27"] },
  { name: "Cefort", short: "CEF", colors: ["#5e9ce2", "#203353"] },
  { name: "DJ Haro", short: "DJH", colors: ["#dce5eb", "#34465f"] },
];
const teamNames = ["Dentistas FC", "Cantos FC", "Epstein FC", "Manolos Bar FC", "Vecibanda FC", "La Ganga FC", "CFE ISC FC", "Guasave FC", "Cefort", "DJ Haro", "Real Suciedad"];
export const rosterTeams = teamNames.map((name) => [...teams, ...referenceTeams].find((team) => team.name === name)!);
