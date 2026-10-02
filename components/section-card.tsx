import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function SectionCard({ title, icon: Icon, action, children, className = "" }: { title: string; icon: LucideIcon; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`surface ${className}`}>
      <header className="surface-head">
        <h2 className="surface-title"><Icon className="h-5 w-5 text-[#73e82d]" />{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}
