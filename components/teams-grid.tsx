import { getLeague } from "@/lib/league";
import { LeagueSection } from "./league-sections";
export async function TeamsGrid() {
  return <LeagueSection data={await getLeague()} kind="teams" full />;
}
