import { useCallback } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import type { LofficeTool } from "@/lib/lofficeUi/tools";

export function useLocalizedTool(tool: LofficeTool) {
  const { t } = useI18n();
  return {
    name: t(`tools.${tool.id}.name`, tool.name),
    desc: t(`tools.${tool.id}.desc`, tool.desc),
    tags: t(`tools.${tool.id}.tags`, tool.tags),
  };
}

export function useToolLabeler() {
  const { t } = useI18n();
  return useCallback(
    (tool: LofficeTool) => ({
      name: t(`tools.${tool.id}.name`, tool.name),
      desc: t(`tools.${tool.id}.desc`, tool.desc),
      tags: t(`tools.${tool.id}.tags`, tool.tags),
    }),
    [t],
  );
}
