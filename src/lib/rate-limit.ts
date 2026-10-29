/**
 * Simple in-memory sliding-window rate limiter, keyed by e.g. "enquiry:<ip>".
 * Fine for one server process (the Coolify deployment); a shared store (Redis) would be
 * needed if the site is ever scaled to several instances.
 */
const hits = new Map<string, number[]>()

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return { ok: false as const, retryAfterMs: windowMs - (now - recent[0]) }
  }
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k)
  }
  return { ok: true as const }
}
