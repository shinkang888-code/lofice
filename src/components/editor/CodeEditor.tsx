"use client";

import { useState } from "react";

interface Props {
  initial: string;
  onChange: (code: string) => void;
  language?: "json" | "xml" | "text";
}

export default function CodeEditor({ initial, onChange, language = "text" }: Props) {
  const [code, setCode] = useState(initial);

  return (
    <textarea
      value={code}
      onChange={(e) => {
        setCode(e.target.value);
        onChange(e.target.value);
      }}
      className="w-full h-full p-4 font-mono text-sm resize-none outline-none bg-[#1e1e1e] text-green-300"
      spellCheck={false}
      placeholder={language === "json" ? "{ ... }" : "<root>...</root>"}
    />
  );
}
