import Link from "next/link";
import { Calendar } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { LOFFICE_RELEASE_NOTES } from "@/lib/lofficeUi/portal";
import "./updates-page.css";

export const metadata = {
  title: "업데이트 — Loffice",
  description: "Loffice 제품 업데이트 및 릴리스 노트",
};

export default function UpdatesPage() {
  return (
    <PortalShell active="updates">
      <main className="portal-page-main updates-page">
        <div className="updates-timeline">
          {LOFFICE_RELEASE_NOTES.map((note, i) => (
            <article key={note.version} className="updates-card portal-card">
              <div className="updates-card-meta">
                <span className="updates-version">{note.version}</span>
                <span className="updates-date">
                  <Calendar className="size-3.5" />
                  {note.date}
                </span>
                {i === 0 && <span className="updates-latest">최신</span>}
              </div>
              <h2 className="updates-title">{note.title}</h2>
              <ul className="updates-list">
                {note.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="updates-footer">
          더 많은 도구는{" "}
          <Link href="/office-tools/" className="updates-footer-link">
            오피스 툴즈
          </Link>
          에서 바로 사용할 수 있습니다.
        </p>
      </main>
    </PortalShell>
  );
}
