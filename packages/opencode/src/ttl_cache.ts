export class TTLCache<K, V> {
  private cache: Map<K, { value: V; expires: number }>
  private defaultTtlMs: number

  constructor(defaultTtlMs: number) {
    this.cache = new Map()
    this.defaultTtlMs = defaultTtlMs
  }

  set(key: K, value: V, ttlMs?: number): void {
    const expires = ttlMs ?? this.defaultTtlMs
    this.cache.set(key, { value, expires: Date.now() + expires })
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key)
    if (!entry) return undefined
    if (Date.now() >= entry.expires) {
      this.cache.delete(key)
      return undefined
    }
    return entry.value
  }

  delete(key: K): void {
    this.cache.delete(key)
  }

  size(): number {
    let count = 0
    for (const [key, entry] of this.cache.entries()) {
      if (Date.now() < entry.expires) {
        count++
      }
    }
    return count
  }

  clear(): void {
    this.cache.clear()
  }
}
