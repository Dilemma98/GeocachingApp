import { create } from "zustand";
import { GPXCache } from "../models/Cache";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheStore {
  caches: GPXCache[];
  username: string;
  setCaches: (caches: GPXCache[]) => void;
  addCaches: (caches: GPXCache[]) => void;
  clearCaches: () => void;
  setUsername: (username: string) => void;
  isFound: (cache: GPXCache) => boolean;
  logCache: (code: string, text?: string) => void;
}

export const useCacheStore = create<CacheStore>((set, get) => ({
  caches: [],
  username: "",
  setCaches: (caches) => set({ caches }),
  addCaches: (newCaches) =>
    set((state) => ({
      caches: [...state.caches, ...newCaches],
    })),
  clearCaches: () => set({ caches: [] }),
  setUsername: async (username) => {
  set({ username });
  await AsyncStorage.setItem('username', username);
},
  isFound: (cache) => {
    const { username } = get();
    if (!username) return false;
    return (
      cache.logs?.some(
        (log) =>
          log.type === "Found it" &&
          log.finderName?.toLowerCase() === username.toLowerCase(),
      ) ?? false
    );
  },
  logCache: (code: string, text?: string) =>
    set((state) => ({
      caches: state.caches.map((c) =>
        c.code === code
          ? {
              ...c,
              found: true,
              foundAt: new Date().toISOString(),
              userLog: text ?? "",
            }
          : c,
      ),
    })),
}));
