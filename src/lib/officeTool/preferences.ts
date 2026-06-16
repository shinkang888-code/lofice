/** lofice 사용자 환경설정 — Office Tool Plus 설정 패턴 */

export type LoficeTheme = "polaris" | "light" | "dark";

export type LoficePreferences = {
  theme: LoficeTheme;
  defaultZoom: number;
  showRecentOnHome: boolean;
  rowsPerPage: number;
  autoSaveToLocal: boolean;
  version: string;
};

const STORAGE_KEY = "lofice-preferences";

export const DEFAULT_PREFERENCES: LoficePreferences = {
  theme: "polaris",
  defaultZoom: 1,
  showRecentOnHome: true,
  rowsPerPage: 20,
  autoSaveToLocal: true,
  version: "2.7.0",
};

export function loadPreferences(): LoficePreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: Partial<LoficePreferences>): LoficePreferences {
  const merged = { ...loadPreferences(), ...prefs };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  applyTheme(merged.theme);
  return merged;
}

export function resetPreferences(): LoficePreferences {
  localStorage.removeItem(STORAGE_KEY);
  applyTheme(DEFAULT_PREFERENCES.theme);
  return DEFAULT_PREFERENCES;
}

export function applyTheme(theme: LoficeTheme): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

export function exportPreferencesJson(): string {
  return JSON.stringify(loadPreferences(), null, 2);
}

export function importPreferencesJson(json: string): LoficePreferences {
  const parsed = JSON.parse(json) as Partial<LoficePreferences>;
  return savePreferences(parsed);
}
