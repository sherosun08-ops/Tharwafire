import { query, queryOne } from '../_lib/db.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  // Public POST — submit contact form
  if (req.method === 'POST' && !req.headers.authorization) {
    const { name, email, phone, service, message, source = 'contact' } = req.body || {}
    if (!name || !email || !message) return res.status(400).json({ error: 'الاسم والبريد والرسالة مطلوبة' })
    try {
      const msg = await queryOne(
        `INSERT INTO contact_messages (name, email, phone, service, message, source)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
        [name, email, phone || null, service || null, message, source]
      )
      return res.status(201).json({ success: true, id: msg.id })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  const decoded = requireAdmin(req, res)
  if (!decoded) return

  try {
    if (req.method === 'GET') {
      const { status, limit = 50, offset = 0 } = req.query
      let sql = 'SELECT * FROM contact_messages WHERE 1=1'
      const params = []
      if (status){ params.push(status); sql += ` AND status = $${params.length}` }
      sql += ` ORDER BY created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`
      params.push(Number(limit), Number(offset))
      const messages = await query(sql, params)
      return res.json({ messages })
    }

    if (req.method === 'PATCH') {
      const { id, status } = req.body || {}
      if (!id || !status) return res.status(400).json({ error: 'id و status مطلوبان' })
      const msg = await queryOne(
        'UPDATE contact_messages SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [status, id]
      )
      if (!msg) return res.status(404).json({ error: 'الرسالة غير موجودة' })
      return res.json({ message: msg })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      await query('DELETE FROM contact_messages WHERE id = $1', [id])
      return res.json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
