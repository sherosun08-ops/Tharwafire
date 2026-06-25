import { query } from '../../_lib/db.js'
import { handleCors } from '../../_lib/cors.js'
import { verifyToken } from '../../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  if (req.method === 'GET') {
    try {
      const rows = await query('SELECT key, value, type, label FROM site_settings ORDER BY key')
      const settings = {}
      for (const row of rows) settings[row.key] = row.value
      return res.json({ settings, rows })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  if (req.method === 'POST') {
    const decoded = verifyToken(req)
    if (!decoded) return res.status(401).json({ error: 'غير مصرح' })

    const { settings } = req.body || {}
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'settings object required' })
    }
    try {
      for (const [key, value] of Object.entries(settings)) {
        await query(
          `INSERT INTO site_settings (key, value, updated_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
          [key, String(value)]
        )
      }
      return res.json({ success: true, updated: Object.keys(settings).length })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
