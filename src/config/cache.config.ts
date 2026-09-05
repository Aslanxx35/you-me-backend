export const CACHE_TTL = {
  GEOCODING_MS: 7 * 24 * 60 * 60 * 1000, // 7 gün — koordinatlar değişmez
  TURKIYE_PROVINCES_MS: 24 * 60 * 60 * 1000, // 1 gün
  DAILY_READING_MS: 12 * 60 * 60 * 1000, // 12 saat — aynı gün aynı burç için tekrar AI çağrısı yapılmasın
} as const;

export class TtlCache<T> {
  private store = new Map<string, { value: T; expiresAt: number }>();
  private sweepTimer: NodeJS.Timeout;

  constructor(private ttlMs: number, sweepIntervalMs: number = ttlMs) {
    this.sweepTimer = setInterval(() => this.sweep(), Math.max(sweepIntervalMs, 60_000));
    this.sweepTimer.unref?.();
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() >= entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T): void {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  has(key: string): boolean { return this.get(key) !== undefined; }
  clear(): void { this.store.clear(); }
  size(): number { return this.store.size; }

  private sweep(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now >= entry.expiresAt) this.store.delete(key);
    }
  }

  dispose(): void { clearInterval(this.sweepTimer); }
}
