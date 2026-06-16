"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFileLocal, updateFileLocal } from "@/lib/storage/local";
import { getDocumentType } from "@/lib/utils";
import { isHancomType } from "@/lib/parsers/hancom";
import { parseHancomDocument, saveHancomAsHwpx } from "@/lib/parsers/hancom";
import { parseDocxToHtml } from "@/lib/parsers/docx";
import { parseXlsx } from "@/lib/parsers/xlsx";
import DocxEditor from "@/components/editor/DocxEditor";
import SpreadsheetEditor from "@/components/editor/SpreadsheetEditor";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
import HtmlEditor from "@/components/editor/HtmlEditor";
import CodeEditor from "@/components/editor/CodeEditor";
import LoficeLayout from "@/components/office/LoficeLayout";
import type { DocumentType, XlsxContent } from "@/types/document";

function EditorContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<DocumentType>("unknown");
  const [docxHtml, setDocxHtml] = useState("");
  const [editedHtml, setEditedHtml] = useState("");
  const [plainText, setPlainText] = useState("");
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

      if (isHancomType(type)) {
        const result = await parseHancomDocument(file.data);
        setDocxHtml(result.html);
        setEditedHtml(result.html);
      } else if (type === "docx" || type === "doc") {
        const html = await parseDocxToHtml(file.data);
        setDocxHtml(html);
        setEditedHtml(html);
      } else if (type === "xlsx" || type === "xls" || type === "csv") {
        setEditedXlsx(parseXlsx(file.data));
      } else if (type === "txt" || type === "rtf") {
        const text = new TextDecoder().decode(file.data);
        setPlainText(text);
      } else if (type === "markdown") {
        setPlainText(new TextDecoder().decode(file.data));
      } else if (type === "html") {
        setPlainText(new TextDecoder().decode(file.data));
      } else if (type === "json" || type === "xml") {
        setPlainText(new TextDecoder().decode(file.data));
      }
      setLoading(false);
    });
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      if (isHancomType(fileType) && editedHtml) {
        const buf = await saveHancomAsHwpx(editedHtml, fileName.replace(/\.[^.]+$/, ""));
        const newName = fileName.endsWith(".hwpx") ? fileName : fileName.replace(/\.hwp$/i, ".hwpx");
        await updateFileLocal(id, buf, newName);
      } else if ((fileType === "docx" || fileType === "doc") && editedHtml) {
        const blob = new Blob([editedHtml], { type: "text/html" });
        await updateFileLocal(id, await blob.arrayBuffer());
      } else if ((fileType === "xlsx" || fileType === "xls" || fileType === "csv") && editedXlsx) {
        const XLSX = await import("xlsx");
        const wb = XLSX.utils.book_new();
        for (const sheet of editedXlsx.sheets) {
          const ws = XLSX.utils.aoa_to_sheet(sheet.rows);
          XLSX.utils.book_append_sheet(wb, ws, sheet.name);
        }
        const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
        await updateFileLocal(id, buf);
      } else if ((fileType === "txt" || fileType === "rtf") && plainText) {
        await updateFileLocal(id, new TextEncoder().encode(plainText).buffer);
      } else if (fileType === "markdown" && plainText) {
        await updateFileLocal(id, new TextEncoder().encode(plainText).buffer);
      } else if (fileType === "html" && plainText) {
        await updateFileLocal(id, new TextEncoder().encode(plainText).buffer);
      } else if ((fileType === "json" || fileType === "xml") && plainText) {
        await updateFileLocal(id, new TextEncoder().encode(plainText).buffer);
      }
      router.push(`/viewer/?id=${id}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-400 bg-[#f3f3f3]">불러오는 중...</div>;
  }

  const isSpreadsheet = fileType === "xlsx" || fileType === "xls" || fileType === "csv";
  const isRichText = isHancomType(fileType) || fileType === "docx" || fileType === "doc";

  return (
    <LoficeLayout fileName={`편집: ${fileName}`} onSave={handleSave} saving={saving}>
      <div className="h-full overflow-hidden bg-white">
        {isRichText && <DocxEditor initialHtml={docxHtml} onChange={setEditedHtml} />}
        {isSpreadsheet && editedXlsx && (
          <SpreadsheetEditor content={editedXlsx} onChange={setEditedXlsx} />
        )}
        {(fileType === "txt" || fileType === "rtf") && (
          <textarea
            value={plainText}
            onChange={(e) => setPlainText(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm resize-none outline-none"
          />
        )}
        {fileType === "markdown" && (
          <MarkdownEditor initial={plainText} onChange={setPlainText} />
        )}
        {fileType === "html" && (
          <HtmlEditor initial={plainText} onChange={setPlainText} />
        )}
        {(fileType === "json" || fileType === "xml") && (
          <CodeEditor
            initial={plainText}
            onChange={setPlainText}
            language={fileType === "json" ? "json" : "xml"}
          />
        )}
      </div>
    </LoficeLayout>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">로딩...</div>}>
      <EditorContent />
    </Suspense>
  );
}
