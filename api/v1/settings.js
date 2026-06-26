import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'
import { verifyToken } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value, type, label')
      .order('key')
    if (error) return res.status(500).json({ error: error.message })
    const settings = {}
    for (const row of data || []) settings[row.key] = row.value
    return res.json({ settings, rows: data })
  }

  if (req.method === 'POST') {
    const decoded = verifyToken(req)
    if (!decoded) return res.status(401).json({ error: 'غير مصرح' })
    const { settings } = req.body || {}
    if (!settings || typeof settings !== 'object') return res.status(400).json({ error: 'settings object required' })
    const upserts = Object.entries(settings).map(([key, value]) => ({ key, value: String(value), updated_at: new Date().toISOString() }))
    const { error } = await supabase.from('site_settings').upsert(upserts, { onConflict: 'key' })
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ success: true, updated: upserts.length })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
