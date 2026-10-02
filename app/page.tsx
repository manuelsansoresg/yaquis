import { Hero, MatchCalendar, NewsHighlights, RegistrationCard, StandingsTable, TopScorers, UpcomingMatches } from "@/components/home-sections";

export default function Home() {
  return <><Hero /><div className="container-shell grid gap-5 py-6 lg:grid-cols-[1.04fr_.96fr]"><div className="grid content-start gap-5"><UpcomingMatches /><MatchCalendar /></div><div className="grid content-start gap-5"><StandingsTable /><TopScorers /><NewsHighlights /><RegistrationCard /></div></div></>;
}
