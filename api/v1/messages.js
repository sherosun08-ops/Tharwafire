import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  // Public POST — submit contact form (no auth)
  if (req.method === 'POST' && !req.headers.authorization) {
    const { name, email, phone, service, message, source = 'contact' } = req.body || {}
    if (!name || !email || !message) return res.status(400).json({ error: 'الاسم والبريد والرسالة مطلوبة' })
    const { data, error } = await supabase.from('contact_messages').insert({ name, email, phone, service, message, source }).select('id, created_at').single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ success: true, id: data.id })
  }

  const decoded = requireAdmin(req, res)
  if (!decoded) return

  try {
    if (req.method === 'GET') {
      const { status, limit = 50, offset = 0 } = req.query
      let q = supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      if (status) q = q.eq('status', status)
      q = q.range(Number(offset), Number(offset) + Number(limit) - 1)
      const { data, error } = await q
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ messages: data })
    }

    if (req.method === 'PATCH') {
      const { id, status } = req.body || {}
      if (!id || !status) return res.status(400).json({ error: 'id و status مطلوبان' })
      const { data, error } = await supabase.from('contact_messages').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select('*').single()
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ message: data })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      const { error } = await supabase.from('contact_messages').delete().eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
