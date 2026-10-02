import { CircleDot } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#3d5869] bg-[#0f2435] shadow-[inset_0_0_18px_rgba(115,232,45,.12)]">
        <span className="display-font -translate-y-0.5 text-[2rem] font-black italic leading-none text-[#73e82d]">Y</span>
        <CircleDot className="absolute bottom-1 right-1 h-3.5 w-3.5 text-white" />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="display-font text-[.88rem] font-semibold tracking-[.12em] text-[#b9c8d2]">LIGA DE FÚTBOL 7</div>
          <div className="display-font text-[1.65rem] font-black tracking-[.08em] text-white">YAQUIS</div>
          <div className="mt-1 text-[.54rem] font-bold tracking-[.14em] text-[#73e82d]">DISCIPLINA • RESPETO • PASIÓN</div>
        </div>
      )}
    </div>
  );
}
