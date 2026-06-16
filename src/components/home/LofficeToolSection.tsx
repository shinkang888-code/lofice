import Link from "next/link";
import type { LofficeTool } from "@/lib/lofficeUi/tools";

type Props = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  tools: LofficeTool[];
};

export default function LofficeToolSection({ id, emoji, title, description, tools }: Props) {
  if (tools.length === 0) return null;

  return (
    <section id={id} className="mx-auto max-w-7xl px-6 pt-16">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          <span className="mr-2">{emoji}</span>
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((t) => (
          <Link
            key={t.name}
            href={t.href}
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lo-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-xl text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <span>{t.icon}</span>
            </div>
            <h3 className="mt-4 text-base font-semibold text-card-foreground">{t.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
            <p className="mt-3 text-xs text-muted-foreground/80">{t.tags}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
