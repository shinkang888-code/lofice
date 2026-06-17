import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LofficeTool } from "@/lib/lofficeUi/tools";
import { CATEGORY_ACCENT, getToolIconStyle } from "@/lib/lofficeUi/tool-icons";

type Props = {
  id: string;
  title: string;
  description: string;
  tools: LofficeTool[];
  category: LofficeTool["category"];
  delay?: number;
};

export default function LofficeToolSection({ id, title, description, tools, category, delay = 0 }: Props) {
  if (tools.length === 0) return null;

  const accent = CATEGORY_ACCENT[category];

  return (
    <section
      id={id}
      className="mx-auto max-w-7xl px-6 pt-12 sm:pt-14"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className={`mb-2 h-1 w-10 rounded-full bg-gradient-to-r ${accent}`} />
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((t, i) => {
          const { Icon, bg, fg } = getToolIconStyle(t);
          return (
            <Link
              key={t.name}
              href={t.href}
              className="lo-card-enter group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-lo-card transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lo-glow sm:p-5"
              style={{ animationDelay: `${delay + i * 40}ms` }}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} transition group-hover:scale-105`}>
                <Icon className={`h-5 w-5 ${fg}`} strokeWidth={2} />
              </div>
              <h3 className="mt-3.5 text-[15px] font-semibold text-card-foreground">{t.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">{t.desc}</p>
              <p className="mt-3 text-[11px] font-medium text-muted-foreground/70">{t.tags}</p>
              <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-muted-foreground/0 transition group-hover:text-primary" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
