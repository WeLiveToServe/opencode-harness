import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { TTLCache } from "./ttl_cache"

describe("TTLCache", () => {
  let cache: TTLCache<string, string>

  beforeEach(() => {
    cache = new TTLCache<string, string>(1000) // 1 second TTL
  })

  afterEach(() => {
    cache.clear()
  })

  it("should set and get a value", () => {
    cache.set("key1", "value1")
    expect(cache.get("key1")).toBe("value1")
  })

  it("should expire a value after TTL", () => {
    cache.set("key2", "value2")
    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + 1000 + 1) // 1 second plus 1 ms
    expect(cache.get("key2")).toBeUndefined()
    vi.useRealTimers()
  })

  it("should handle multiple entries", () => {
    cache.set("key3", "value3")
    cache.set("key4", "value4")
    expect(cache.size()).toBe(2)
    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + 1000 + 1)
    expect(cache.size()).toBe(0)
    vi.useRealTimers()
  })

  it("should delete a specific entry", () => {
    cache.set("key5", "value5")
    cache.delete("key5")
    expect(cache.get("key5")).toBeUndefined()
  })

  it("should clear all entries", () => {
    cache.set("key6", "value6")
    cache.clear()
    expect(cache.get("key6")).toBeUndefined()
    expect(cache.size()).toBe(0)
  })
})
