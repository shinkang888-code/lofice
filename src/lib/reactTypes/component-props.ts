/**
 * 공통 React 컴포넌트 Props — Conversion Guide Props/State 패턴
 */
import type { ReactNode } from "react";

export type WithClassName = {
  className?: string;
};

export type WithChildren = {
  children?: ReactNode;
};

export type DocumentBufferProps = {
  buffer?: ArrayBuffer | null;
  fileName?: string;
  onDocumentCreated?: (buffer: ArrayBuffer, fileName: string) => void;
};

export type PptAiAssistantProps = WithClassName &
  DocumentBufferProps & {
    /** 초기 슬라이드 수 */
    defaultSlideCount?: number;
  };
