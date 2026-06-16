const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  isElectron: true,
  onOpenFile: (callback) => {
    ipcRenderer.on("open-file", (_event, detail) => callback(detail));
  },
  getPendingFile: () => ipcRenderer.invoke("get-pending-file"),
});
