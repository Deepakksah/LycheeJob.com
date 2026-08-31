/**
 * High-Performance Web & LocalStorage Caching Engine — LycheeJob.com
 * 
 * Provides:
 * • Instant Zero-Latency In-Memory Caching (L1 Cache)
 * • Persistent Browser LocalStorage Caching (L2 Cache)
 * • Automatic TTL Expiry & Safe Quota Management
 * • Instant Offline & Reload Resilience
 */

interface CacheEnvelope<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// In-Memory L1 Cache Map
const memoryCache = new Map<string, CacheEnvelope<any>>();

const CACHE_PREFIX = 'lycheejobs_cache_v2_';

export const webCache = {
  /**
   * Store data in both In-Memory (L1) and LocalStorage (L2)
   */
  set: <T>(key: string, data: T, ttlMinutes = 60): void => {
    const fullKey = `${CACHE_PREFIX}${key}`;
    const now = Date.now();
    const expiresAt = now + ttlMinutes * 60 * 1000;
    const envelope: CacheEnvelope<T> = { data, timestamp: now, expiresAt };

    // 1. Save to L1 In-Memory Cache
    memoryCache.set(fullKey, envelope);

    // 2. Save to L2 LocalStorage if in browser
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(fullKey, JSON.stringify(envelope));
      } catch (err) {
        // Handle quota exceeded gracefully by clearing older items
        try {
          webCache.pruneExpired();
        } catch (_) {}
      }
    }
  },

  /**
   * Retrieve data from L1 (Memory) or L2 (LocalStorage)
   */
  get: <T>(key: string): T | null => {
    const fullKey = `${CACHE_PREFIX}${key}`;
    const now = Date.now();

    // 1. Check L1 Memory Cache first (instant)
    if (memoryCache.has(fullKey)) {
      const envelope = memoryCache.get(fullKey) as CacheEnvelope<T>;
      if (envelope.expiresAt > now) {
        return envelope.data;
      }
      memoryCache.delete(fullKey);
    }

    // 2. Check L2 LocalStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const itemStr = window.localStorage.getItem(fullKey);
        if (itemStr) {
          const envelope: CacheEnvelope<T> = JSON.parse(itemStr);
          if (envelope.expiresAt > now) {
            // Restore to L1 for next read
            memoryCache.set(fullKey, envelope);
            return envelope.data;
          } else {
            window.localStorage.removeItem(fullKey);
          }
        }
      } catch (_) {}
    }

    return null;
  },

  /**
   * Remove specific item or clear all cached job items
   */
  remove: (key: string): void => {
    const fullKey = `${CACHE_PREFIX}${key}`;
    memoryCache.delete(fullKey);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(fullKey);
      } catch (_) {}
    }
  },

  /**
   * Prune expired entries from localStorage to maintain healthy storage
   */
  pruneExpired: (): void => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const now = Date.now();
    try {
      const keys = Object.keys(window.localStorage);
      for (const k of keys) {
        if (k.startsWith(CACHE_PREFIX)) {
          const item = window.localStorage.getItem(k);
          if (item) {
            const env: CacheEnvelope<any> = JSON.parse(item);
            if (env.expiresAt <= now) {
              window.localStorage.removeItem(k);
            }
          }
        }
      }
    } catch (_) {}
  }
};
