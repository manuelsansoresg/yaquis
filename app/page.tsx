import { Hero, MatchCalendar, NewsHighlights, RegistrationCard, StandingsTable, TopScorers, UpcomingMatches } from "@/components/home-sections";

export default function Home() {
  return <><Hero /><div className="container-shell grid gap-4 py-4 min-[900px]:grid-cols-[40fr_60fr]"><div className="grid content-start gap-4"><UpcomingMatches /><MatchCalendar /></div><div className="grid content-start gap-4"><StandingsTable /><TopScorers /><div className="grid items-stretch gap-4 min-[900px]:grid-cols-[1.35fr_.85fr]"><NewsHighlights /><RegistrationCard /></div></div></div></>;
}
