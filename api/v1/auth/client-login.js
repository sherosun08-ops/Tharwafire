import { queryOne } from '../../../_lib/db.js'
import { signToken } from '../../../_lib/auth.js'
import { handleCors } from '../../../_lib/cors.js'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' })
  }

  try {
    const client = await queryOne(
      `SELECT id, name, email, password_hash, status, phone, avatar_url,
              account_number, join_date, risk_profile
       FROM clients WHERE email = $1`,
      [email.toLowerCase().trim()]
    )

    if (!client) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' })
    if (client.status !== 'active') return res.status(403).json({ error: 'الحساب موقوف. تواصل مع المدير.' })

    const valid = await bcrypt.compare(password, client.password_hash)
    if (!valid) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' })

    const token = signToken({ id: client.id, email: client.email, name: client.name, role: 'client' })
    const { password_hash, ...safeClient } = client
    return res.json({ token, client: safeClient })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
