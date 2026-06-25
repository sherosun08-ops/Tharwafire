import { query, queryOne } from '../_lib/db.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  const decoded = requireAdmin(req, res)
  if (!decoded) return

  try {
    // GET — list or single client
    if (req.method === 'GET') {
      const { id, search, status, limit = 50, offset = 0 } = req.query
      if (id) {
        const client = await queryOne(
          `SELECT id, name, email, phone, status, account_number, join_date,
                  risk_profile, avatar_url, notes, created_at
           FROM clients WHERE id = $1`, [id]
        )
        if (!client) return res.status(404).json({ error: 'العميل غير موجود' })
        return res.json({ client })
      }

      let sql = `SELECT id, name, email, phone, status, account_number, join_date,
                        risk_profile, avatar_url, notes, created_at
                 FROM clients WHERE 1=1`
      const params = []
      if (status) { params.push(status); sql += ` AND status = $${params.length}` }
      if (search) { params.push(`%${search}%`); sql += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length} OR phone ILIKE $${params.length})` }
      sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(Number(limit), Number(offset))
      const clients = await query(sql, params)
      const [{ count }] = await query('SELECT COUNT(*) FROM clients', [])
      return res.json({ clients, total: Number(count) })
    }

    // POST — create client
    if (req.method === 'POST') {
      const { name, email, phone, password, risk_profile, notes } = req.body || {}
      if (!name || !email || !password) return res.status(400).json({ error: 'الاسم والبريد والكلمة مطلوبة' })
      const existing = await queryOne('SELECT id FROM clients WHERE email = $1', [email.toLowerCase()])
      if (existing) return res.status(409).json({ error: 'البريد الإلكتروني مستخدم' })
      const hash = await bcrypt.hash(password, 10)
      const acc = 'TH' + Date.now().toString().slice(-8)
      const client = await queryOne(
        `INSERT INTO clients (name, email, phone, password_hash, account_number, risk_profile, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, name, email, phone, status, account_number, join_date, risk_profile, notes`,
        [name, email.toLowerCase(), phone || null, hash, acc, risk_profile || 'moderate', notes || null]
      )
      return res.status(201).json({ client })
    }

    // PATCH — update client
    if (req.method === 'PATCH') {
      const { id, name, email, phone, status, risk_profile, notes, password } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      const sets = []; const params = []
      if (name)        { params.push(name);                   sets.push(`name = $${params.length}`) }
      if (email)       { params.push(email.toLowerCase());    sets.push(`email = $${params.length}`) }
      if (phone)       { params.push(phone);                  sets.push(`phone = $${params.length}`) }
      if (status)      { params.push(status);                 sets.push(`status = $${params.length}`) }
      if (risk_profile){ params.push(risk_profile);           sets.push(`risk_profile = $${params.length}`) }
      if (notes !== undefined){ params.push(notes);           sets.push(`notes = $${params.length}`) }
      if (password)    { params.push(await bcrypt.hash(password, 10)); sets.push(`password_hash = $${params.length}`) }
      if (!sets.length) return res.status(400).json({ error: 'لا توجد حقول للتحديث' })
      params.push(id)
      const client = await queryOne(
        `UPDATE clients SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${params.length}
         RETURNING id, name, email, phone, status, account_number, risk_profile, notes`,
        params
      )
      if (!client) return res.status(404).json({ error: 'العميل غير موجود' })
      return res.json({ client })
    }

    // DELETE
    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      await query('DELETE FROM clients WHERE id = $1', [id])
      return res.json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
