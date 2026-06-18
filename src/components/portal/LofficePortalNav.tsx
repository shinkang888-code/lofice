import Link from "next/link";
import Image from "next/image";
import { PORTAL_NAV, type PortalNavId } from "@/lib/lofficeUi/portal";
import "./portal-nav.css";

type LofficePortalNavProps = {
  active: PortalNavId | "home";
};

export function LofficePortalNav({ active }: LofficePortalNavProps) {
  return (
    <header className="portal-nav">
      <div className="portal-nav-inner">
        <Link href="/" className="portal-nav-logo">
          <Image src="/lofice-icon.png" alt="LOFFICE" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-[#003377]">LOFFICE</span>
        </Link>
        <nav className="portal-nav-menu" aria-label="포털 메뉴">
          {PORTAL_NAV.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`portal-nav-link ${active === item.id ? "portal-nav-link--active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
