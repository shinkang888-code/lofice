"use client";

import LofficeToolSection from "@/components/home/LofficeToolSection";
import { useI18n } from "@/i18n/I18nProvider";
import {
  LOFFICE_DOC_TOOLS,
  LOFFICE_AI_TOOLS,
  LOFFICE_CONVERT_TOOLS,
  LOFFICE_ANALYZE_TOOLS,
} from "@/lib/lofficeUi/tools";

export default function LofficeDocEditDashboard() {
  const { t } = useI18n();

  return (
    <div className="pb-16">
      <div id="tools" className="scroll-mt-20" />
      <LofficeToolSection
        id="doc-edit"
        category="doc"
        title={t("sections.docTitle")}
        description={t("sections.docDesc")}
        tools={LOFFICE_DOC_TOOLS}
      />
      <LofficeToolSection
        id="ai"
        category="ai"
        title={t("sections.aiTitle")}
        description={t("sections.aiDesc")}
        tools={LOFFICE_AI_TOOLS}
        delay={40}
      />
      <LofficeToolSection
        id="convert"
        category="convert"
        title={t("sections.convertTitle")}
        description={t("sections.convertDesc")}
        tools={LOFFICE_CONVERT_TOOLS}
        delay={80}
      />
      <LofficeToolSection
        id="analyze"
        category="analyze"
        title={t("sections.analyzeTitle")}
        description={t("sections.analyzeDesc")}
        tools={LOFFICE_ANALYZE_TOOLS}
        delay={120}
      />
    </div>
  );
}
