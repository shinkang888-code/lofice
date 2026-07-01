const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const http = require("http");
const url = require("url");

const SUPPORTED_EXTENSIONS = new Set([
  ".hwpx", ".hwp", ".docx", ".doc", ".xlsx", ".xls", ".csv", ".pdf", ".txt",
]);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
};

let mainWindow = null;
let pendingFile = null;
let staticServer = null;
let appUrl = "http://localhost:3000";

function isSupportedFile(filePath) {
  if (!filePath || filePath.startsWith("-")) return false;
  const ext = path.extname(filePath).toLowerCase();
  return SUPPORTED_EXTENSIONS.has(ext) && fs.existsSync(filePath);
}

function findFileInArgs(argv) {
  return argv.find((arg) => isSupportedFile(arg));
}

function sendFileToRenderer(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const payload = {
      name: path.basename(filePath),
      data: buffer.toString("base64"),
    };

    if (mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents) {
      mainWindow.webContents.send("open-file", payload);
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    } else {
      pendingFile = payload;
    }
  } catch (err) {
    console.error("Failed to read file:", filePath, err);
  }
}

function resolveStaticPath(root, requestPath) {
  let pathname = decodeURIComponent(requestPath.split("?")[0]);
  if (pathname.endsWith("/")) pathname += "index.html";

  const direct = path.join(root, pathname);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;

  const withIndex = path.join(root, pathname, "index.html");
  if (fs.existsSync(withIndex)) return withIndex;

  return path.join(root, "index.html");
}

function startStaticServer(root) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const parsed = url.parse(req.url);
        const filePath = resolveStaticPath(root, parsed.pathname || "/");
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";
        const data = fs.readFileSync(filePath);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end("Not Found");
      }
    });

    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
    server.on("error", reject);
  });
}

async function createWindow() {
  if (!app.isPackaged) {
    appUrl = "http://localhost:3000";
  } else {
    const outDir = path.join(__dirname, "../out");
    const { server, port } = await startStaticServer(outDir);
    staticServer = server;
    appUrl = `http://127.0.0.1:${port}`;
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "Loffice",
    icon: path.join(__dirname, "../public/lofice-icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    show: false,
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (pendingFile) {
      mainWindow.webContents.send("open-file", pendingFile);
      pendingFile = null;
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url: targetUrl }) => {
    shell.openExternal(targetUrl);
    return { action: "deny" };
  });

  await mainWindow.loadURL(appUrl);

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.handle("get-pending-file", () => {
  const file = pendingFile;
  pendingFile = null;
  return file;
});

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, argv) => {
    const filePath = findFileInArgs(argv);
    if (filePath) sendFileToRenderer(filePath);
    else if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    await createWindow();

    const filePath = findFileInArgs(process.argv);
    if (filePath) sendFileToRenderer(filePath);

    app.on("activate", async () => {
      if (BrowserWindow.getAllWindows().length === 0) await createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (staticServer) staticServer.close();
    if (process.platform !== "darwin") app.quit();
  });

  app.on("open-file", (event, filePath) => {
    event.preventDefault();
    if (isSupportedFile(filePath)) sendFileToRenderer(filePath);
  });
}
