import 'server-only'

type SupabaseRequestInit = RequestInit & {
  prefer?: string
}

function getConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !secret) return null
  return { url, secret }
}

export function isCommerceDatabaseConfigured() {
  return Boolean(getConfig())
}

export async function supabaseRest<T>(
  path: string,
  init: SupabaseRequestInit = {},
): Promise<T> {
  const config = getConfig()
  if (!config) throw new Error('SUPABASE_NOT_CONFIGURED')

  const headers = new Headers(init.headers)
  headers.set('apikey', config.secret)
  headers.set('Authorization', `Bearer ${config.secret}`)
  headers.set('Content-Type', 'application/json')
  if (init.prefer) headers.set('Prefer', init.prefer)

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    console.error('Supabase REST error', response.status, data)
    throw new Error(`SUPABASE_HTTP_${response.status}`)
  }

  return data as T
}
