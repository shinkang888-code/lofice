"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

export interface EditorToolbarActions {
  bold?: () => void;
  italic?: () => void;
  underline?: () => void;
  alignLeft?: () => void;
  alignCenter?: () => void;
  alignRight?: () => void;
  undo?: () => void;
  redo?: () => void;
  copy?: () => void;
  cut?: () => void;
  paste?: () => void;
}

export interface EditorToolbarMeta {
  docType?: "richtext" | "spreadsheet";
  activeCell?: string;
  sheetName?: string;
}

interface EditorToolbarContextValue {
  actions: EditorToolbarActions;
  meta: EditorToolbarMeta;
  register: (payload: EditorToolbarActions & EditorToolbarMeta) => void;
  reset: () => void;
}

const EditorToolbarContext = createContext<EditorToolbarContextValue | null>(null);

export function EditorToolbarProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<EditorToolbarActions>({});
  const [meta, setMeta] = useState<EditorToolbarMeta>({});

  const register = useCallback((payload: EditorToolbarActions & EditorToolbarMeta) => {
    const { docType, activeCell, sheetName, ...nextActions } = payload;
    setActions((prev) => ({ ...prev, ...nextActions }));
    setMeta({ docType, activeCell, sheetName });
  }, []);

  const reset = useCallback(() => {
    setActions({});
    setMeta({});
  }, []);

  const value = useMemo(() => ({ actions, meta, register, reset }), [actions, meta, register, reset]);

  return <EditorToolbarContext.Provider value={value}>{children}</EditorToolbarContext.Provider>;
}

export function useEditorToolbarOptional() {
  return useContext(EditorToolbarContext);
}
