import { supabase } from '../_lib/supabase.js'
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
        const { data, error } = await supabase.from('portfolios').select('*').eq('id', id).single()
        if (error || !data) return res.status(404).json({ error: 'المحفظة غير موجودة' })
        return res.json({ portfolio: data })
      }
      let q = supabase.from('portfolios').select('*, clients(name)')
      if (client_id) q = q.eq('client_id', client_id)
      const { data, error } = await q.order('created_at', { ascending: false })
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ portfolios: data })
    }

    if (req.method === 'POST') {
      const { client_id, name, type, initial_value, currency = 'SAR', notes } = req.body || {}
      if (!client_id || !name || !initial_value) return res.status(400).json({ error: 'الحقول الأساسية مطلوبة' })
      const { data, error } = await supabase.from('portfolios').insert({ client_id, name, type: type || 'mixed', initial_value, current_value: initial_value, currency, notes }).select('*').single()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json({ portfolio: data })
    }

    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      const { data, error } = await supabase.from('portfolios').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('*').single()
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ portfolio: data })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      const { error } = await supabase.from('portfolios').delete().eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
