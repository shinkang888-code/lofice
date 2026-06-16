"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFileLocal, updateFileLocal } from "@/lib/storage/local";
import { getDocumentType } from "@/lib/utils";
import { parseDocxToHtml } from "@/lib/parsers/docx";
import { parseXlsx } from "@/lib/parsers/xlsx";
import DocxEditor from "@/components/editor/DocxEditor";
import SpreadsheetEditor from "@/components/editor/SpreadsheetEditor";
import { ArrowLeft, Save } from "lucide-react";
import type { DocumentType, XlsxContent } from "@/types/document";

function EditorContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<DocumentType>("unknown");
  const [docxHtml, setDocxHtml] = useState("");
  const [xlsxContent, setXlsxContent] = useState<XlsxContent | null>(null);
  const [editedHtml, setEditedHtml] = useState("");
  const [editedXlsx, setEditedXlsx] = useState<XlsxContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getFileLocal(id).then(async (file) => {
      if (!file) return;
      setFileName(file.name);
      const type = getDocumentType(file.name);
      setFileType(type);
      if (type === "docx") {
        const html = await parseDocxToHtml(file.data);
        setDocxHtml(html);
        setEditedHtml(html);
      } else if (type === "xlsx") {
        const content = parseXlsx(file.data);
        setXlsxContent(content);
        setEditedXlsx(content);
      }
      setLoading(false);
    });
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      if (fileType === "docx" && editedHtml) {
        const blob = new Blob([editedHtml], { type: "text/html" });
        await updateFileLocal(id, await blob.arrayBuffer());
      } else if (fileType === "xlsx" && editedXlsx) {
        const XLSX = await import("xlsx");
        const wb = XLSX.utils.book_new();
        for (const sheet of editedXlsx.sheets) {
          const ws = XLSX.utils.aoa_to_sheet(sheet.rows);
          XLSX.utils.book_append_sheet(wb, ws, sheet.name);
        }
        const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
        await updateFileLocal(id, buf);
      }
      router.push(`/viewer/?id=${id}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-400">불러오는 중...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center gap-2 px-3 h-12 bg-brand-600 text-white shrink-0 safe-top">
        <button onClick={() => router.back()} className="p-2 -ml-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-sm font-medium truncate">편집: {fileName}</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-lg text-xs font-medium disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" /> {saving ? "저장 중" : "저장"}
        </button>
      </header>
      <main className="flex-1 overflow-hidden">
        {fileType === "docx" && (
          <DocxEditor initialHtml={docxHtml} onChange={setEditedHtml} />
        )}
        {fileType === "xlsx" && editedXlsx && (
          <SpreadsheetEditor content={editedXlsx} onChange={setEditedXlsx} />
        )}
      </main>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">로딩...</div>}>
      <EditorContent />
    </Suspense>
  );
}
