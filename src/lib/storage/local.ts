const DB_NAME = "lofice";
const DB_VERSION = 1;
const STORE = "files";

interface StoredFile {
  id: string;
  name: string;
  type: string;
  data: ArrayBuffer;
  updatedAt: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
  });
}

export async function saveFileLocal(file: File, id?: string): Promise<string> {
  const db = await openDB();
  const fileId = id ?? `${Date.now()}`;
  const record: StoredFile = {
    id: fileId,
    name: file.name,
    type: file.type,
    data: await file.arrayBuffer(),
    updatedAt: new Date().toISOString(),
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(record);
    tx.oncomplete = () => resolve(fileId);
    tx.onerror = () => reject(tx.error);
  });
}

function normalizeBuffer(data: unknown): ArrayBuffer {
  if (data instanceof ArrayBuffer) return data;
  if (ArrayBuffer.isView(data)) {
    const view = data as ArrayBufferView;
    return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength) as ArrayBuffer;
  }
  throw new Error("Invalid file data in storage");
}

export async function getFileLocal(id: string): Promise<StoredFile | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => {
      const result = req.result as StoredFile | undefined;
      if (!result) {
        resolve(null);
        return;
      }
      resolve({ ...result, data: normalizeBuffer(result.data) });
    };
    req.onerror = () => reject(req.error);
  });
}

export async function listFilesLocal(): Promise<Omit<StoredFile, "data">[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => {
      const items = (req.result as StoredFile[]).map(({ id, name, type, updatedAt, data }) => ({
        id, name, type, updatedAt, size: data.byteLength,
      }));
      resolve(items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteFileLocal(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function updateFileLocal(id: string, data: ArrayBuffer, name?: string): Promise<void> {
  const existing = await getFileLocal(id);
  if (!existing) throw new Error("File not found");
  const db = await openDB();
  const record: StoredFile = {
    ...existing,
    data,
    name: name ?? existing.name,
    updatedAt: new Date().toISOString(),
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
