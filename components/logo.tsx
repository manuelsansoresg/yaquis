import Image from "next/image";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3.5">
      <Image src="/assets/yaquis-crest-v2.png" alt="Escudo de Liga Yaquis" width={92} height={92} className="h-[68px] w-[68px] shrink-0 object-contain sm:h-[86px] sm:w-[86px]" priority />
      {!compact && (
        <div className="leading-none">
          <div className="display-font text-[.82rem] font-semibold tracking-[.1em] text-white sm:text-[1.05rem]">LIGA DE FÚTBOL 7</div>
          <div className="display-font text-[2rem] font-black tracking-[.04em] text-white sm:text-[2.7rem]">YAQUIS</div>
          <div className="mt-1 text-[.5rem] font-bold tracking-[.13em] text-white sm:text-[.58rem]">DISCIPLINA <span className="px-1 text-[#73e82d]">•</span> RESPETO <span className="px-1 text-[#73e82d]">•</span> PASIÓN</div>
        </div>
      )}
    </div>
  );
}
