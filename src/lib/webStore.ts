/**
 * A tiny IndexedDB key-value store for the web. Whole books are too big for localStorage (about 5 MB per site),
 * but IndexedDB can hold hundreds of megabytes. Every call fails soft: if storage is blocked (private mode, a
 * preview), books still work for the current session from memory.
 */
const DB = 'deepstash-clone';
const STORE = 'books';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB unavailable'));
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const webStore = {
  get: <T = string>(key: string) => run<T | undefined>('readonly', (s) => s.get(key) as IDBRequest<T | undefined>).catch(() => undefined),
  /** Values can be strings or binary (ArrayBuffer), e.g. a whole PDF. */
  set: (key: string, value: string | ArrayBuffer) => run('readwrite', (s) => s.put(value, key)).then(() => true, () => false),
  remove: (key: string) => run('readwrite', (s) => s.delete(key)).then(() => true, () => false),
};
