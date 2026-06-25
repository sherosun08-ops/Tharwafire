import { query, queryOne } from '../_lib/db.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  const decoded = requireAdmin(req, res)
  if (!decoded) return
  if (decoded.role !== 'super') return res.status(403).json({ error: 'صلاحيات المدير الرئيسي مطلوبة' })

  try {
    if (req.method === 'GET') {
      const subs = await query(
        'SELECT id, name, email, status, created_at FROM sub_admins ORDER BY created_at DESC', []
      )
      return res.json({ subAdmins: subs })
    }

    if (req.method === 'POST') {
      const { name, email, password } = req.body || {}
      if (!name || !email || !password) return res.status(400).json({ error: 'جميع الحقول مطلوبة' })
      if (password.length < 6) return res.status(400).json({ error: 'كلمة المرور 6 أحرف على الأقل' })
      const existing = await queryOne('SELECT id FROM sub_admins WHERE email = $1', [email.toLowerCase()])
      if (existing) return res.status(409).json({ error: 'البريد الإلكتروني مستخدم' })
      const hash = await bcrypt.hash(password, 10)
      const sub = await queryOne(
        `INSERT INTO sub_admins (name, email, password_hash)
         VALUES ($1, $2, $3) RETURNING id, name, email, status, created_at`,
        [name.trim(), email.toLowerCase().trim(), hash]
      )
      return res.status(201).json({ subAdmin: sub })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      await query('DELETE FROM sub_admins WHERE id = $1', [id])
      return res.json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
