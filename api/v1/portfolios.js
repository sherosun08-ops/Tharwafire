import { query, queryOne } from '../_lib/db.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  const decoded = requireAdmin(req, res)
  if (!decoded) return

  try {
    if (req.method === 'GET') {
      const { client_id, id } = req.query
      if (id) {
        const p = await queryOne('SELECT * FROM portfolios WHERE id = $1', [id])
        if (!p) return res.status(404).json({ error: 'المحفظة غير موجودة' })
        return res.json({ portfolio: p })
      }
      const params = client_id ? [client_id] : []
      const portfolios = await query(
        `SELECT p.*, c.name AS client_name FROM portfolios p
         LEFT JOIN clients c ON c.id = p.client_id
         ${client_id ? 'WHERE p.client_id = $1' : ''}
         ORDER BY p.created_at DESC`,
        params
      )
      return res.json({ portfolios })
    }

    if (req.method === 'POST') {
      const { client_id, name, type, initial_value, currency = 'SAR', notes } = req.body || {}
      if (!client_id || !name || !initial_value) return res.status(400).json({ error: 'الحقول الأساسية مطلوبة' })
      const p = await queryOne(
        `INSERT INTO portfolios (client_id, name, type, initial_value, current_value, currency, notes)
         VALUES ($1, $2, $3, $4, $4, $5, $6) RETURNING *`,
        [client_id, name, type || 'mixed', initial_value, currency, notes || null]
      )
      return res.status(201).json({ portfolio: p })
    }

    if (req.method === 'PATCH') {
      const { id, name, type, current_value, status, notes } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      const sets = []; const params = []
      if (name)    { params.push(name);          sets.push(`name = $${params.length}`) }
      if (type)    { params.push(type);          sets.push(`type = $${params.length}`) }
      if (current_value !== undefined){ params.push(current_value); sets.push(`current_value = $${params.length}`) }
      if (status)  { params.push(status);        sets.push(`status = $${params.length}`) }
      if (notes !== undefined){ params.push(notes); sets.push(`notes = $${params.length}`) }
      if (!sets.length) return res.status(400).json({ error: 'لا توجد حقول' })
      params.push(id)
      const p = await queryOne(
        `UPDATE portfolios SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${params.length} RETURNING *`,
        params
      )
      if (!p) return res.status(404).json({ error: 'المحفظة غير موجودة' })
      return res.json({ portfolio: p })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      await query('DELETE FROM portfolios WHERE id = $1', [id])
      return res.json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
