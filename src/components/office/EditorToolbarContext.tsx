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

interface EditorToolbarContextValue {
  actions: EditorToolbarActions;
  register: (actions: EditorToolbarActions) => void;
  reset: () => void;
}

const EditorToolbarContext = createContext<EditorToolbarContextValue | null>(null);

export function EditorToolbarProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<EditorToolbarActions>({});

  const register = useCallback((next: EditorToolbarActions) => {
    setActions((prev) => ({ ...prev, ...next }));
  }, []);

  const reset = useCallback(() => setActions({}), []);

  const value = useMemo(() => ({ actions, register, reset }), [actions, register, reset]);

  return <EditorToolbarContext.Provider value={value}>{children}</EditorToolbarContext.Provider>;
}

export function useEditorToolbarOptional() {
  return useContext(EditorToolbarContext);
}
