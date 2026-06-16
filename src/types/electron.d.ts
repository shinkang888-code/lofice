export interface ElectronAPI {
  onOpenFile: (callback: (detail: { name: string; data: string }) => void) => void;
  getPendingFile: () => Promise<{ name: string; data: string } | null>;
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
