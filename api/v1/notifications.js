import { query, queryOne } from '../_lib/db.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  const decoded = requireAdmin(req, res)
  if (!decoded) return

  try {
    if (req.method === 'GET') {
      const { limit = 20 } = req.query
      const notifications = await query(
        'SELECT * FROM notifications ORDER BY created_at DESC LIMIT $1', [Number(limit)]
      )
      const [{ count }] = await query('SELECT COUNT(*) FROM notifications WHERE is_read = false', [])
      return res.json({ notifications, unreadCount: Number(count) })
    }

    if (req.method === 'PATCH') {
      const { id, all } = req.body || {}
      if (all) {
        await query('UPDATE notifications SET is_read = true', [])
        return res.json({ success: true, marked: 'all' })
      }
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      const n = await queryOne(
        'UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *', [id]
      )
      return res.json({ notification: n })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
