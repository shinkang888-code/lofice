/**
 * 7-Zip WASM 엔진 — 7z-wasm (7-Zip 24.09 CLI 포트)
 * @see https://github.com/shinkang888-code/7zip (소스)
 * @see https://github.com/use-strict/7z-wasm (WASM 빌드)
 */
import type { SevenZipModule } from "7z-wasm";
import type { ArchiveEntry, ArchiveExtractResult, ArchiveFormat, ArchiveListResult } from "./archive-types";
import { detectArchiveFormat } from "./archive-types";

let modulePromise: Promise<SevenZipModule> | null = null;
let workSeq = 0;
let logBuffer: string[] = [];

function nextWorkDir(): string {
  workSeq += 1;
  return `/w${workSeq}`;
}

async function getSevenZip(): Promise<SevenZipModule> {
  if (!modulePromise) {
    modulePromise = (async () => {
      const SevenZip = (await import("7z-wasm")).default;
      return SevenZip({
        locateFile: (file) => `/7z-wasm/${file}`,
        print: (s: string) => logBuffer.push(s),
        printErr: (s: string) => logBuffer.push(s),
      });
    })();
  }
  return modulePromise;
}

function mkdirp(fs: SevenZipModule["FS"], dir: string): void {
  const parts = dir.split("/").filter(Boolean);
  let cur = "";
  for (const p of parts) {
    cur += `/${p}`;
    try {
      fs.mkdir(cur);
    } catch {
      /* exists */
    }
  }
}

function rmTree(fs: SevenZipModule["FS"], path: string): void {
  try {
    const stat = fs.stat(path);
    if (fs.isDir(stat.mode)) {
      for (const name of fs.readdir(path)) {
        if (name === "." || name === "..") continue;
        rmTree(fs, `${path}/${name}`.replace(/\/+/g, "/"));
      }
      fs.rmdir(path);
    } else {
      fs.unlink(path);
    }
  } catch {
    /* ignore */
  }
}

function runMain(sz: SevenZipModule, args: string[]): void {
  try {
    sz.callMain(args);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("ExitStatus") || msg.includes("Program terminated")) {
      throw new Error(`7-Zip 오류: ${args.join(" ")}`);
    }
    throw e;
  }
}

function captureMain(sz: SevenZipModule, args: string[]): string {
  logBuffer = [];
  runMain(sz, args);
  return logBuffer.join("\n");
}

function parseListOutput(output: string): ArchiveEntry[] {
  const entries: ArchiveEntry[] = [];
  let current: Partial<ArchiveEntry> = {};

  const flush = () => {
    if (current.path) {
      entries.push({
        path: current.path,
        size: current.size ?? 0,
        packedSize: current.packedSize,
        isDir: current.isDir ?? false,
        modified: current.modified,
      });
    }
    current = {};
  };

  for (const line of output.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("Path = ")) {
      flush();
      current.path = trimmed.slice(7);
    } else if (trimmed.startsWith("Size = ")) {
      current.size = parseInt(trimmed.slice(7), 10) || 0;
    } else if (trimmed.startsWith("Packed Size = ")) {
      current.packedSize = parseInt(trimmed.slice(14), 10) || 0;
    } else if (trimmed.startsWith("Modified = ")) {
      current.modified = trimmed.slice(11);
    } else if (trimmed === "Attributes = D") {
      current.isDir = true;
    }
  }
  flush();

  if (entries.length > 0) return entries;

  for (const line of output.split(/\r?\n/)) {
    const m = line.match(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+(\S+)\s+(\d+)\s+(\d+)\s+(.+)$/);
    if (m) {
      entries.push({
        path: m[4]!,
        size: parseInt(m[3]!, 10) || 0,
        packedSize: parseInt(m[2]!, 10) || 0,
        isDir: m[1]!.includes("D"),
      });
    }
  }

  return entries;
}

function walkDir(fs: SevenZipModule["FS"], dir: string, base = ""): { path: string; data: Uint8Array }[] {
  const out: { path: string; data: Uint8Array }[] = [];
  let names: string[];
  try {
    names = fs.readdir(dir);
  } catch {
    return out;
  }
  for (const name of names) {
    if (name === "." || name === "..") continue;
    const full = `${dir}/${name}`.replace(/\/+/g, "/");
    const rel = base ? `${base}/${name}` : name;
    try {
      const st = fs.stat(full);
      if (fs.isDir(st.mode)) {
        out.push(...walkDir(fs, full, rel));
      } else {
        out.push({ path: rel.replace(/\\/g, "/"), data: fs.readFile(full) });
      }
    } catch {
      /* skip */
    }
  }
  return out;
}

export async function sevenZipList(
  buffer: ArrayBuffer,
  archiveName: string,
): Promise<ArchiveListResult> {
  const sz = await getSevenZip();
  const work = nextWorkDir();
  const arcPath = `${work}/arc`;
  mkdirp(sz.FS, work);
  sz.FS.writeFile(arcPath, new Uint8Array(buffer));

  const output = captureMain(sz, ["l", "-slt", "-y", arcPath]);
  rmTree(sz.FS, work);

  return {
    entries: parseListOutput(output),
    format: detectArchiveFormat(archiveName),
    method: "7z-wasm",
  };
}

export async function sevenZipTest(buffer: ArrayBuffer, archiveName: string): Promise<void> {
  const sz = await getSevenZip();
  const work = nextWorkDir();
  const arcPath = `${work}/${archiveName.split(/[/\\]/).pop() ?? "archive"}`;
  mkdirp(sz.FS, work);
  sz.FS.writeFile(arcPath, new Uint8Array(buffer));
  captureMain(sz, ["t", "-y", arcPath]);
  rmTree(sz.FS, work);
}

export async function sevenZipExtract(
  buffer: ArrayBuffer,
  archiveName: string,
  paths?: string[],
): Promise<ArchiveExtractResult> {
  const sz = await getSevenZip();
  const work = nextWorkDir();
  const arcPath = `${work}/${archiveName.split(/[/\\]/).pop() ?? "archive"}`;
  const outDir = `${work}/out`;
  mkdirp(sz.FS, work);
  mkdirp(sz.FS, outDir);
  sz.FS.writeFile(arcPath, new Uint8Array(buffer));

  const args = ["x", "-y", `-o${outDir}`, arcPath];
  if (paths?.length) args.push(...paths);
  runMain(sz, args);

  const files = walkDir(sz.FS, outDir);
  rmTree(sz.FS, work);
  return { files, method: "7z-wasm" };
}

export async function sevenZipCreate(
  files: { path: string; data: Uint8Array }[],
  outputName: string,
  format: ArchiveFormat = "7z",
  level = 5,
): Promise<Uint8Array> {
  const sz = await getSevenZip();
  const work = nextWorkDir();
  const inDir = `${work}/in`;
  const outPath = `${work}/${outputName}`;
  mkdirp(sz.FS, work);
  mkdirp(sz.FS, inDir);

  const inputPaths: string[] = [];
  for (const f of files) {
    const safe = f.path.replace(/\\/g, "/").replace(/^\/+/, "");
    const full = `${inDir}/${safe}`;
    const dir = full.substring(0, full.lastIndexOf("/"));
    if (dir) mkdirp(sz.FS, dir);
    sz.FS.writeFile(full, f.data);
    inputPaths.push(full);
  }

  const typeFlag = format === "zip" ? "zip" : format === "tar" ? "tar" : format === "gzip" ? "gzip" : "7z";
  runMain(sz, ["a", "-y", `-t${typeFlag}`, `-mx=${level}`, outPath, ...inputPaths]);

  const result = sz.FS.readFile(outPath);
  rmTree(sz.FS, work);
  return result;
}

export async function preloadSevenZip(): Promise<void> {
  await getSevenZip();
}
