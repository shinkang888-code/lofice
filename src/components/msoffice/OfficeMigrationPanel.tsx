"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  Monitor,
  RefreshCw,
  Smartphone,
  Trash2,
} from "lucide-react";
import {
  buildOfficeRemovalPs1Command,
  DEFAULT_MIGRATION_OPTIONS,
  loadMigrationState,
  LOFICE_INSTALL_LINKS,
  MIGRATION_STAGE_LABELS,
  resetMigrationStage,
  resolveStartStage,
  saveMigrationStage,
  type MigrationOptions,
  type MigrationStage,
  type RemovalMethod,
} from "@/lib/msoffice/migration-stages";
import { runFreshSetup } from "@/lib/msoffice/fresh-setup";
import DefaultAppGuide from "@/components/settings/DefaultAppGuide";

export default function OfficeMigrationPanel() {
  const [options, setOptions] = useState<MigrationOptions>(DEFAULT_MIGRATION_OPTIONS);
  const [stage, setStage] = useState<MigrationStage>(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = loadMigrationState();
    if (saved && saved.stage < 4) {
      setStage(saved.stage);
      setOptions((o) => ({ ...o, method: saved.method, installLofice: saved.installLofice }));
    }
  }, []);

  const psCommand = buildOfficeRemovalPs1Command({
    installOffice365: false,
    useSetupRemoval: options.method === "setup",
    force: options.force,
    suppressReboot: true,
  });

  const copyPs = async () => {
    await navigator.clipboard.writeText(psCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startWizard = () => {
    if (!options.force && !confirm("Office → lofice 마이그레이션을 시작할까요?")) return;
    const start = resolveStartStage(options);
    if (options.runAgain) resetMigrationStage();
    setStage(options.runAgain ? 1 : start);
    saveMigrationStage(options.runAgain ? 1 : start, {
      method: options.method,
      installLofice: options.installLofice,
    });
    setMessage(null);
  };

  const runLoficeCleanup = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await runFreshSetup(options.method);
      saveMigrationStage(3, { method: options.method, installLofice: options.installLofice });
      setStage(3);
      setMessage(
        `lofice 정리 완료 · 문서 ${result.clearedFiles}개 삭제` +
          (result.clearedCaches.length ? ` · 캐시 ${result.clearedCaches.length}개` : ""),
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "정리 실패");
    } finally {
      setLoading(false);
    }
  }, [options.method, options.installLofice]);

  const completeMigration = () => {
    saveMigrationStage(4);
    setStage(4);
    setMessage("마이그레이션이 완료되었습니다.");
  };

  const runAgain = () => {
    resetMigrationStage();
    setStage(1);
    setOptions((o) => ({ ...o, runAgain: true }));
    setMessage(null);
  };

  return (
    <div className="space-y-6">
      <p className="text-[10px] text-gray-500 leading-relaxed">
        msoffice-removal-tool 패턴: Office 제거 → lofice 설치. Windows Office 제거는 PowerShell(관리자),
        lofice 정리는 브라우저에서 실행됩니다.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {([1, 2, 3, 4] as MigrationStage[]).map((s) => (
          <div
            key={s}
            className={`shrink-0 px-2 py-1 text-[10px] rounded-full border ${
              stage === s ? "bg-[#2b579a] text-white border-[#2b579a]" : stage > s ? "border-green-300 text-green-700" : "border-gray-200 text-gray-500"
            }`}
          >
            {s}. {MIGRATION_STAGE_LABELS[s]}
          </div>
        ))}
      </div>

      <section className="space-y-2 p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <div className="flex gap-2 text-amber-800">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="text-[10px] leading-relaxed">
            Office 제거 스크립트는 Microsoft Office를 삭제합니다. 시스템 복원 지점 생성 후 관리자 PowerShell에서 실행하세요.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-700">옵션</h3>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <label className="flex items-center gap-2 p-2 bg-white border rounded-lg">
            <input
              type="radio"
              name="method"
              checked={options.method === "sara"}
              onChange={() => setOptions((o) => ({ ...o, method: "sara" as RemovalMethod }))}
            />
            SaRA (가벼운 lofice 정리)
          </label>
          <label className="flex items-center gap-2 p-2 bg-white border rounded-lg">
            <input
              type="radio"
              name="method"
              checked={options.method === "setup"}
              onChange={() => setOptions((o) => ({ ...o, method: "setup" as RemovalMethod }))}
            />
            Setup (깊은 lofice 초기화)
          </label>
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={options.installLofice}
            onChange={(e) => setOptions((o) => ({ ...o, installLofice: e.target.checked }))}
          />
          Office365 대신 lofice 설치 안내
        </label>
        <label className="flex items-center gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={options.force}
            onChange={(e) => setOptions((o) => ({ ...o, force: e.target.checked }))}
          />
          확인 없이 진행 (-Force)
        </label>
      </section>

      {stage === 1 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-800">1단계 · Office 제거 (Windows)</h3>
          <p className="text-[10px] text-gray-500">
            아래 명령을 관리자 PowerShell에 붙여넣으세요. Office365 재설치 없이 제거만 수행합니다.
          </p>
          <pre className="text-[9px] bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap break-all">
            {psCommand}
          </pre>
          <button
            type="button"
            onClick={() => void copyPs()}
            className="flex items-center gap-2 text-xs px-3 py-2 border rounded-lg"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? "복사됨" : "PowerShell 명령 복사"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void runLoficeCleanup()}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#2b579a] text-white text-sm rounded-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            lofice 로컬 데이터 정리 (브라우저)
          </button>
          <button
            type="button"
            onClick={() => { saveMigrationStage(2); setStage(2); }}
            className="w-full py-2 text-xs border rounded-lg"
          >
            Office 제거 완료 → 다음
          </button>
        </section>
      )}

      {stage === 2 && options.installLofice && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-800">2단계 · lofice 설치</h3>
          <p className="text-[10px] text-gray-500">Office365 재설치 대신 lofice를 기본 문서 앱으로 설정하세요.</p>
          <div className="grid gap-2">
            {LOFICE_INSTALL_LINKS.map(({ id, label, href, desc }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white border rounded-xl text-sm"
              >
                {id === "android" ? <Smartphone className="w-4 h-4 text-[#2b579a]" /> : <Monitor className="w-4 h-4 text-[#2b579a]" />}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{label}</p>
                  <p className="text-[10px] text-gray-500">{desc}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>
            ))}
          </div>
          <DefaultAppGuide />
          <button
            type="button"
            onClick={() => { saveMigrationStage(3); setStage(3); }}
            className="w-full py-2 text-xs border rounded-lg"
          >
            설치 완료 → 다음
          </button>
        </section>
      )}

      {stage === 2 && !options.installLofice && (
        <button
          type="button"
          onClick={() => { saveMigrationStage(3); setStage(3); }}
          className="w-full py-2 text-xs border rounded-lg"
        >
          다음 단계
        </button>
      )}

      {stage === 3 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-800">3단계 · 잔여 정리</h3>
          <button
            type="button"
            disabled={loading}
            onClick={() => void runLoficeCleanup()}
            className="w-full flex items-center justify-center gap-2 py-2.5 border text-sm rounded-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {options.method === "setup" ? "깊은 초기화 다시 실행" : "가벼운 정리 다시 실행"}
          </button>
          <button
            type="button"
            onClick={completeMigration}
            className="w-full py-2.5 bg-green-600 text-white text-sm rounded-lg flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            마이그레이션 완료
          </button>
        </section>
      )}

      {stage === 4 && (
        <section className="text-center space-y-3 py-6">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
          <p className="text-sm font-medium text-gray-800">Office → lofice 마이그레이션 완료</p>
          <Link href="/" className="inline-block text-xs text-[#2b579a] underline">
            홈으로 이동
          </Link>
          <button type="button" onClick={runAgain} className="block w-full py-2 text-xs border rounded-lg mt-4">
            처음부터 다시 (-RunAgain)
          </button>
        </section>
      )}

      {stage === 1 && (
        <button type="button" onClick={startWizard} className="w-full py-2 text-xs text-gray-500 underline">
          저장된 단계에서 재개
        </button>
      )}

      {message && (
        <p className="text-xs p-2 rounded-lg text-gray-700 bg-gray-50">{message}</p>
      )}
    </div>
  );
}
