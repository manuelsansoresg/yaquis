import { getTeam } from "@/data/league";

export function TeamCrest({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const team = getTeam(name);
  const dimensions = size === "sm" ? "h-8 w-8 text-[.48rem]" : size === "lg" ? "h-16 w-16 text-[.75rem]" : "h-11 w-11 text-[.58rem]";
  return (
    <span className={`grid shrink-0 place-items-center rounded-[30%_30%_48%_48%] border-2 font-black tracking-tight text-white shadow-md ${dimensions}`} style={{ background: `linear-gradient(145deg, ${team.colors[0]}, ${team.colors[1]})`, borderColor: team.colors[0], textShadow: "0 1px 3px #000" }} aria-hidden="true">
      {team.short}
    </span>
  );
}
