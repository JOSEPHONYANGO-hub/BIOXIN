export const dynamic = 'force-dynamic'

/** Health check for Coolify and uptime monitors. Returns no data beyond the status. */
export function GET() {
  return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
}
