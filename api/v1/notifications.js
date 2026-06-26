import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  const decoded = requireAdmin(req, res)
  if (!decoded) return

  try {
    if (req.method === 'GET') {
      const { limit = 20 } = req.query
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(Number(limit))
      if (error) return res.status(500).json({ error: error.message })
      const { count } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('is_read', false)
      return res.json({ notifications: data, unreadCount: count || 0 })
    }

    if (req.method === 'PATCH') {
      const { id, all } = req.body || {}
      if (all) {
        await supabase.from('notifications').update({ is_read: true }).eq('is_read', false)
        return res.json({ success: true, marked: 'all' })
      }
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id).select('*').single()
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ notification: data })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
