import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  const decoded = requireAdmin(req, res)
  if (!decoded) return
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const [
      { data: clients },
      { data: txs },
      { data: msgs },
      { data: recentClients },
      { data: recentTx },
    ] = await Promise.all([
      supabase.from('clients').select('status'),
      supabase.from('transactions').select('type, amount, status'),
      supabase.from('contact_messages').select('status'),
      supabase.from('clients').select('id,name,email,status,join_date').order('created_at', { ascending: false }).limit(5),
      supabase.from('transactions').select('*, clients(name)').order('created_at', { ascending: false }).limit(5),
    ])

    const totalDeposits = (txs || []).filter(t => t.type === 'deposit' && t.status === 'completed').reduce((s, t) => s + Number(t.amount), 0)
    const totalWithdrawals = (txs || []).filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((s, t) => s + Number(t.amount), 0)

    return res.json({
      kpis: {
        activeClients:       (clients || []).filter(c => c.status === 'active').length,
        inactiveClients:     (clients || []).filter(c => c.status === 'inactive').length,
        totalClients:        (clients || []).length,
        totalDeposits,
        totalWithdrawals,
        netAssets:           totalDeposits - totalWithdrawals,
        pendingTransactions: (txs || []).filter(t => t.status === 'pending').length,
        totalTransactions:   (txs || []).length,
        newMessages:         (msgs || []).filter(m => m.status === 'new').length,
        totalMessages:       (msgs || []).length,
      },
      recentClients: recentClients || [],
      recentTransactions: recentTx || [],
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
