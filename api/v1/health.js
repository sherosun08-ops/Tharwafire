import { createClient } from '@supabase/supabase-js'
import { handleCors } from '../_lib/cors.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const url = process.env.SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || ''
  const jwtOk = !!(process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET)

  let tables = {}
  try {
    const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

    const [admins, clients, settings] = await Promise.all([
      sb.from('admins').select('*', { count: 'exact', head: true }),
      sb.from('clients').select('*', { count: 'exact', head: true }),
      sb.from('site_settings').select('*', { count: 'exact', head: true }),
    ])

    tables = {
      admins:        { count: admins.count,   error: admins.error?.message   || null },
      clients:       { count: clients.count,  error: clients.error?.message  || null },
      site_settings: { count: settings.count, error: settings.error?.message || null },
    }
  } catch (e) {
    tables = { error: e.message }
  }

  res.json({
    ok: true,
    supabaseProject: url ? url.replace('https://', '').split('.')[0] : 'missing',
    hasServiceKey:   !!key,
    hasJwtSecret:    jwtOk,
    tables,
    nodeVersion:     process.version,
  })
}
