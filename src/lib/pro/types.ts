/** lofice Pro — contracts 타입 (lofice-contracts/openapi.yaml) */

export type ProTargetFormat = "docx" | "xlsx" | "pptx" | "pdf" | "odt" | "html";

export type ProHealthResponse = {
  status: string;
  libreoffice: boolean;
  soffice: string;
  features: string[];
};

export type ProConvertResponse = {
  file_name: string;
  data_base64: string;
  format: string;
};

export type ProEngineState = "ready" | "degraded" | "offline";

export type ProJobStatus = "pending" | "running" | "done" | "error";

export type ProConvertJob = {
  id: string;
  fileName: string;
  target: ProTargetFormat;
  status: ProJobStatus;
  resultName?: string;
  error?: string;
  savedId?: string;
};
