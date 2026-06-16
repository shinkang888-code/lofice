/**
 * msoffice-removal-tool 단계(Stage) 패턴 — lofice localStorage 이식
 * @see https://github.com/shinkang888-code/msoffice-removal-tool
 */

export type MigrationStage = 1 | 2 | 3 | 4;

export type RemovalMethod = "sara" | "setup";

export type MigrationOptions = {
  method: RemovalMethod;
  installLofice: boolean;
  force: boolean;
  runAgain: boolean;
};

export type MigrationState = {
  stage: MigrationStage;
  method: RemovalMethod;
  installLofice: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "lofice-migration-stage";

export const MIGRATION_STAGE_LABELS: Record<MigrationStage, string> = {
  1: "Office 제거 · lofice 정리",
  2: "lofice 설치 · 기본 앱 설정",
  3: "잔여 캐시 정리",
  4: "마이그레이션 완료",
};

export const DEFAULT_MIGRATION_OPTIONS: MigrationOptions = {
  method: "sara",
  installLofice: true,
  force: false,
  runAgain: false,
};

export function loadMigrationState(): MigrationState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MigrationState;
  } catch {
    return null;
  }
}

export function saveMigrationStage(
  stage: MigrationStage,
  partial?: Partial<Pick<MigrationState, "method" | "installLofice">>,
): MigrationState {
  const prev = loadMigrationState();
  const next: MigrationState = {
    stage,
    method: partial?.method ?? prev?.method ?? "sara",
    installLofice: partial?.installLofice ?? prev?.installLofice ?? true,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function resetMigrationStage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function resolveStartStage(options: MigrationOptions): MigrationStage {
  if (options.runAgain) return 1;
  const saved = loadMigrationState();
  if (!saved) return 1;
  if (saved.stage >= 4) return 4;
  return saved.stage;
}

export function buildOfficeRemovalPs1Command(opts: {
  installOffice365?: boolean;
  useSetupRemoval?: boolean;
  force?: boolean;
  suppressReboot?: boolean;
}): string {
  const flags: string[] = [];
  if (opts.installOffice365) flags.push("-InstallOffice365");
  if (opts.useSetupRemoval) flags.push("-UseSetupRemoval");
  if (opts.force) flags.push("-Force");
  if (opts.suppressReboot) flags.push("-SuppressReboot");
  const param = flags.length ? ` ${flags.join(" ")}` : "";
  return `iwr https://raw.githubusercontent.com/shinkang888-code/msoffice-removal-tool/main/msoffice-removal-tool.ps1 -OutFile msoffice-removal-tool.ps1; powershell -ExecutionPolicy Bypass .\\msoffice-removal-tool.ps1${param}`;
}

export const LOFICE_INSTALL_LINKS = [
  { id: "pwa", label: "웹/PWA", href: "https://lofice-one.vercel.app/", desc: "브라우저에서 설치" },
  { id: "web", label: "lawbox", href: "https://lawbox-one.vercel.app/", desc: "대체 배포 URL" },
  { id: "android", label: "Android APK", href: "/files/", desc: "문서 목록에서 APK 확인" },
] as const;
