import { cache } from "react";
import { rows } from "./db";
import { cookies } from "next/headers";
export type Catalog = {
  id: number;
  kind: string;
  name: string;
  active: number;
};
export type LeagueTeam = {
  id: number;
  name: string;
  short: string;
  division_id: number;
  category_id: number;
  season_id: number;
  division: string;
  category: string;
  season: string;
  coach: string;
  manager: string;
  logo_id: string | null;
  color1: string;
  color2: string;
  active: number;
};
export type LeaguePlayer = {
  id: number;
  team_id: number;
  name: string;
  number: number;
  position_id: number;
  position: string;
  active: number;
};
export type LeagueMatch = {
  id: number;
  home_id: number;
  away_id: number;
  venue_id: number;
  kickoff: string;
  round: number;
  status: string;
  home_score: number | null;
  away_score: number | null;
  home: string;
  away: string;
  venue: string;
};
export type LeagueStanding = {
  pos: number;
  team: string;
  team_id: number;
  division_id: number;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
};
export const getLeague = cache(async () => {
  const [catalogs, allTeams, allPlayers, allMatches, goals, news] =
    await Promise.all([
      rows<Catalog>("SELECT * FROM catalogs ORDER BY id"),
      rows<LeagueTeam>(
        "SELECT t.*,d.name division,c.name category,s.name season FROM teams t JOIN catalogs d ON d.id=t.division_id JOIN catalogs c ON c.id=t.category_id JOIN catalogs s ON s.id=t.season_id ORDER BY t.name",
      ),
      rows<LeaguePlayer>(
        "SELECT p.*,c.name position FROM players p JOIN catalogs c ON c.id=p.position_id ORDER BY p.number",
      ),
      rows<LeagueMatch>(
        "SELECT m.*,h.name home,a.name away,v.name venue FROM matches m JOIN teams h ON h.id=m.home_id JOIN teams a ON a.id=m.away_id JOIN catalogs v ON v.id=m.venue_id ORDER BY m.kickoff",
      ),
      rows<{ player_id: number; match_id: number; goals: number }>(
        "SELECT * FROM match_goals",
      ),
      rows<{
        id: number;
        tag: string;
        title: string;
        copy: string;
        published_on: string;
      }>(
        "SELECT * FROM news WHERE active=1 ORDER BY published_on DESC,id DESC",
      ),
    ]);
  const seasons = catalogs.filter((c) => c.kind === "season" && c.active);
  const selected = Number((await cookies()).get("liga_season")?.value);
  const seasonId =
    seasons.find((c) => c.id === selected)?.id ?? seasons.at(-1)?.id;
  const teams = allTeams.filter((t) => t.active && t.season_id === seasonId);
  const teamIds = new Set(teams.map((t) => t.id));
  const players = allPlayers.filter((p) => teamIds.has(p.team_id));
  const matches = allMatches.filter(
    (m) => teamIds.has(m.home_id) && teamIds.has(m.away_id),
  );
  const table: LeagueStanding[] = teams.map((t) => ({
    pos: 0,
    team: t.name,
    team_id: t.id,
    division_id: t.division_id,
    pj: 0,
    g: 0,
    e: 0,
    p: 0,
    gf: 0,
    gc: 0,
    dg: 0,
    pts: 0,
  }));
  for (const match of matches.filter((m) => m.status === "played")) {
    for (const [id, gf, gc] of [
      [match.home_id, match.home_score!, match.away_score!],
      [match.away_id, match.away_score!, match.home_score!],
    ]) {
      const row = table.find((r) => r.team_id === id);
      if (!row) continue;
      row.pj++;
      row.gf += gf;
      row.gc += gc;
      row.dg = row.gf - row.gc;
      if (gf > gc) {
        row.g++;
        row.pts += 3;
      } else if (gf === gc) {
        row.e++;
        row.pts++;
      } else row.p++;
    }
  }
  table.sort(
    (a, b) =>
      b.pts - a.pts ||
      b.dg - a.dg ||
      b.gf - a.gf ||
      a.team.localeCompare(b.team),
  );
  const scorers = players
    .map((p) => ({
      ...p,
      team: teams.find((t) => t.id === p.team_id)!.name,
      division_id: teams.find((t) => t.id === p.team_id)!.division_id,
      goals: goals
        .filter(
          (g) =>
            g.player_id === p.id &&
            matches.some((m) => m.id === g.match_id && m.status === "played"),
        )
        .reduce((sum, g) => sum + g.goals, 0),
    }))
    .filter((p) => p.goals > 0)
    .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name));
  return {
    catalogs,
    teams,
    players,
    matches,
    standings: table,
    scorers,
    news,
    seasonId,
    seasons,
  };
});
export type LeagueData = Awaited<ReturnType<typeof getLeague>>;
