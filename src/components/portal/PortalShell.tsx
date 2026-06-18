import type { ReactNode } from "react";
import { LofficePortalNav } from "./LofficePortalNav";
import type { PortalNavId } from "@/lib/lofficeUi/portal";
import "./portal-nav.css";

type PortalShellProps = {
  active: PortalNavId | "home";
  children: ReactNode;
};

export function PortalShell({ active, children }: PortalShellProps) {
  return (
    <div className="portal-page">
      <LofficePortalNav active={active} />
      {children}
    </div>
  );
}
