"use client";

import { useEffect, useRef } from "react";
import type { LoficeEventMap, LoficeEventName } from "@/lib/reactTypes/events";
import { subscribeLoficeEvent } from "@/lib/reactTypes/events";

/** Conversion Guide componentDidMount 패턴 → React hooks */
export function useLoficeEvent<K extends LoficeEventName>(
  type: K,
  handler: (detail: LoficeEventMap[K]) => void,
  enabled = true,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;
    return subscribeLoficeEvent(type, (detail) => handlerRef.current(detail));
  }, [type, enabled]);
}

export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (e: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void {
  useEffect(() => {
    const listener = handler as EventListener;
    window.addEventListener(type, listener, options);
    return () => window.removeEventListener(type, listener, options);
  }, [type, handler, options]);
}
