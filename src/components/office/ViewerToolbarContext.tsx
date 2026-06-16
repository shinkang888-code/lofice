"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

export interface ViewerToolbarActions {
  zoomIn?: () => void;
  zoomOut?: () => void;
  zoomFit?: () => void;
  zoomReset?: () => void;
  prevPage?: () => void;
  nextPage?: () => void;
  goToPage?: (page: number) => void;
  download?: () => void;
  print?: () => void;
  toggleThumbnails?: () => void;
}

export interface ViewerToolbarState {
  docType: string;
  page: number;
  pageCount: number;
  zoom: number;
  showThumbnails: boolean;
  canPageNav: boolean;
  actions: ViewerToolbarActions;
}

interface ViewerToolbarContextValue {
  state: ViewerToolbarState;
  register: (partial: Partial<ViewerToolbarState> & { actions?: ViewerToolbarActions }) => void;
  reset: () => void;
}

const defaultState: ViewerToolbarState = {
  docType: "document",
  page: 1,
  pageCount: 1,
  zoom: 1,
  showThumbnails: false,
  canPageNav: false,
  actions: {},
};

const ViewerToolbarContext = createContext<ViewerToolbarContextValue | null>(null);

export function ViewerToolbarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ViewerToolbarState>(defaultState);

  const register = useCallback((partial: Partial<ViewerToolbarState> & { actions?: ViewerToolbarActions }) => {
    setState((prev) => ({
      ...prev,
      ...partial,
      actions: partial.actions ? { ...prev.actions, ...partial.actions } : prev.actions,
    }));
  }, []);

  const reset = useCallback(() => setState(defaultState), []);

  const value = useMemo(() => ({ state, register, reset }), [state, register, reset]);

  return (
    <ViewerToolbarContext.Provider value={value}>{children}</ViewerToolbarContext.Provider>
  );
}

export function useViewerToolbar() {
  const ctx = useContext(ViewerToolbarContext);
  if (!ctx) throw new Error("useViewerToolbar must be used within ViewerToolbarProvider");
  return ctx;
}

export function useViewerToolbarOptional() {
  return useContext(ViewerToolbarContext);
}
