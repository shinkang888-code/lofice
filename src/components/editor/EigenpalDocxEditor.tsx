"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { DocxEditorRef } from "@eigenpal/docx-js-editor";

const DocxEditor = dynamic(
  () => import("@eigenpal/docx-js-editor").then((m) => m.DocxEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-lofice-navy" />
        <p className="text-sm text-gray-500">Word 에디터 로딩 (@eigenpal/docx-js-editor)...</p>
      </div>
    ),
  }
);

export interface EigenpalDocxEditorHandle {
  save: () => Promise<ArrayBuffer | null>;
}

interface Props {
  documentBuffer: ArrayBuffer;
  fileName: string;
  readOnly?: boolean;
}

const EigenpalDocxEditor = forwardRef<EigenpalDocxEditorHandle, Props>(
  function EigenpalDocxEditor({ documentBuffer, fileName, readOnly = false }, ref) {
    const editorRef = useRef<DocxEditorRef>(null);

    useImperativeHandle(ref, () => ({
      save: async () => editorRef.current?.save() ?? null,
    }));

    return (
      <div className="h-full eigenpal-editor">
        <DocxEditor
          ref={editorRef}
          documentBuffer={documentBuffer}
          documentName={fileName}
          mode={readOnly ? "viewing" : "editing"}
          showToolbar={!readOnly}
          showRuler
          showZoomControl
          showPrintButton
          initialZoom={1}
          className="h-full"
          style={{ height: "100%" }}
        />
      </div>
    );
  }
);

export default EigenpalDocxEditor;
