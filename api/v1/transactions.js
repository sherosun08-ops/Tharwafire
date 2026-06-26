import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  const decoded = requireAdmin(req, res)
  if (!decoded) return

  try {
    if (req.method === 'GET') {
      const { id, client_id, type, status, limit = 50, offset = 0 } = req.query
      if (id) {
        const { data, error } = await supabase.from('transactions').select('*').eq('id', id).single()
        if (error || !data) return res.status(404).json({ error: 'المعاملة غير موجودة' })
        return res.json({ transaction: data })
      }
      let q = supabase.from('transactions').select('*, clients(name)', { count: 'exact' })
      if (client_id) q = q.eq('client_id', client_id)
      if (type) q = q.eq('type', type)
      if (status) q = q.eq('status', status)
      q = q.order('created_at', { ascending: false }).range(Number(offset), Number(offset) + Number(limit) - 1)
      const { data, error } = await q
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ transactions: data })
    }

    if (req.method === 'POST') {
      const { client_id, type, amount, currency = 'SAR', notes, status = 'pending' } = req.body || {}
      if (!client_id || !type || !amount) return res.status(400).json({ error: 'client_id و type و amount مطلوبة' })
      const { data, error } = await supabase.from('transactions').insert({ client_id, type, amount, currency, reference: 'TXN-' + Date.now(), notes, status }).select('*').single()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json({ transaction: data })
    }

    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      const { data, error } = await supabase.from('transactions').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('*').single()
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ transaction: data })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
