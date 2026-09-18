/**
 * Tiny localStorage-backed stores for `useSyncExternalStore`, so the best
 * score and the sound preference hydrate without a setState-in-effect and
 * survive a reload. Storage may be missing or full; both stores degrade to
 * in-memory values for the visit.
 */

type Listener = () => void;

export type StoredValue<T> = {
  get: () => T;
  set: (value: T) => void;
  subscribe: (listener: Listener) => () => void;
};

function createStoredValue<T>(key: string, fallback: T, parse: (raw: string) => T, serialize: (value: T) => string): StoredValue<T> {
  const listeners = new Set<Listener>();
  let cached: T | undefined;

  const read = (): T => {
    if (cached !== undefined) return cached;
    try {
      const raw = window.localStorage.getItem(key);
      cached = raw === null ? fallback : parse(raw);
    } catch {
      cached = fallback;
    }
    return cached;
  };

  const notify = () => listeners.forEach((l) => l());

  return {
    get: () => (typeof window === "undefined" ? fallback : read()),
    set: (value) => {
      cached = value;
      try {
        window.localStorage.setItem(key, serialize(value));
      } catch {
        // Private mode or a full quota: keep the in-memory value.
      }
      notify();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          cached = undefined;
          listener();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
  };
}

export const HI_STORAGE_KEY = "rakb-run-hi";
export const SOUND_STORAGE_KEY = "rakb-run-sound";

export const hiScore = createStoredValue<number>(
  HI_STORAGE_KEY,
  0,
  (raw) => Math.max(0, Math.floor(Number(raw)) || 0),
  String,
);

export const soundOn = createStoredValue<boolean>(
  SOUND_STORAGE_KEY,
  false,
  (raw) => raw === "on",
  (on) => (on ? "on" : "off"),
);
