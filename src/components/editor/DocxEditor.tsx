"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";
import { useEditorToolbarOptional } from "@/components/office/EditorToolbarContext";

interface Props {
  initialHtml: string;
  onChange?: (html: string) => void;
  /** LoficeLayout 리본만 사용 — 내장 툴바 숨김 */
  ribbonMode?: boolean;
  placeholder?: string;
}

export default function DocxEditor({
  initialHtml,
  onChange,
  ribbonMode = false,
  placeholder = "내용을 입력하세요...",
}: Props) {
  const toolbar = useEditorToolbarOptional();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: initialHtml,
    onUpdate: ({ editor: ed }) => onChange?.(ed.getHTML()),
    editorProps: {
      attributes: {
        class: ribbonMode
          ? "polaris-doc-body prose prose-gray max-w-none min-h-[70vh] px-10 py-12 focus:outline-none"
          : "prose prose-gray max-w-none min-h-[60vh] px-4 py-6 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor || !toolbar) return;

    toolbar.register({
      docType: "richtext",
      bold: () => editor.chain().focus().toggleBold().run(),
      italic: () => editor.chain().focus().toggleItalic().run(),
      underline: () => editor.chain().focus().toggleUnderline().run(),
      alignLeft: () => editor.chain().focus().setTextAlign("left").run(),
      alignCenter: () => editor.chain().focus().setTextAlign("center").run(),
      alignRight: () => editor.chain().focus().setTextAlign("right").run(),
      undo: () => editor.chain().focus().undo().run(),
      redo: () => editor.chain().focus().redo().run(),
      copy: () => document.execCommand("copy"),
      cut: () => document.execCommand("cut"),
      paste: async () => {
        try {
          const text = await navigator.clipboard.readText();
          editor.chain().focus().insertContent(text).run();
        } catch {
          document.execCommand("paste");
        }
      },
    });

    return () => toolbar.reset();
  }, [editor, toolbar]);

  if (!editor) return null;

  return (
    <div className={`docx-editor flex flex-col h-full ${ribbonMode ? "polaris-doc-editor" : ""}`}>
      {!ribbonMode && (
        <div className="flex items-center gap-1 px-2 py-2 bg-white border-b overflow-x-auto shrink-0 sticky top-0 z-10">
          <RibbonMiniBtn active={editor.isActive("bold")} label="B" onClick={() => editor.chain().focus().toggleBold().run()} />
          <RibbonMiniBtn active={editor.isActive("italic")} label="I" onClick={() => editor.chain().focus().toggleItalic().run()} />
          <RibbonMiniBtn active={editor.isActive("underline")} label="U" onClick={() => editor.chain().focus().toggleUnderline().run()} />
        </div>
      )}
      <div className={`flex-1 overflow-auto ${ribbonMode ? "bg-[#e8e8e8] py-6" : "bg-white"}`}>
        {ribbonMode ? (
          <div className="mx-auto max-w-[816px] min-h-full bg-white shadow-lg border border-gray-200">
            <EditorContent editor={editor} />
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  );
}

function RibbonMiniBtn({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 rounded text-sm font-semibold ${
        active ? "bg-[#2b579a]/15 text-[#2b579a]" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}
