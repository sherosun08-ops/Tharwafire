const BASE = '/api/v1'

function getAdminToken(): string | null {
  return localStorage.getItem('admin_token')
}

function getClientToken(): string | null {
  return localStorage.getItem('client_token')
}

function authHeaders(useClientToken = false): Record<string, string> {
  const token = useClientToken ? getClientToken() : (getAdminToken() || getClientToken())
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Exported helper used by components that build their own fetch calls
export function getAuthHeader(): string | null {
  const token = getAdminToken() || getClientToken()
  return token ? `Bearer ${token}` : null
}

async function request<T>(path: string, options: RequestInit = {}, useClientToken = false): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(useClientToken),
      ...(options.headers || {}),
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data as T
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const adminLogin = (email: string, password: string) =>
  request<{ token: string; user: AdminUser }>('/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const clientLogin = (email: string, password: string) =>
  request<{ token: string; client: ClientUser }>('/auth/client-login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

// ─── Site Settings ────────────────────────────────────────────────────────────
export const getSettings = () =>
  request<{ settings: Record<string, string>; rows: SettingRow[] }>('/settings')

export const saveSettings = (settings: Record<string, string>) =>
  request<{ success: boolean }>('/settings', {
    method: 'POST',
    body: JSON.stringify({ settings }),
  })

// ─── Clients ──────────────────────────────────────────────────────────────────
export const getClients = (params?: { search?: string; status?: string; limit?: number }) => {
  const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
  return request<{ clients: Client[]; total: number }>(`/clients${q}`)
}

export const getClient = (id: string) =>
  request<{ client: Client }>(`/clients?id=${id}`)

export const createClient = (data: Partial<Client> & { password?: string }) =>
  request<{ client: Client }>('/clients', { method: 'POST', body: JSON.stringify(data) })

export const updateClient = (id: string, data: Partial<Client> & { password?: string }) =>
  request<{ client: Client }>('/clients', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

export const deleteClient = (id: string) =>
  request<{ success: boolean }>(`/clients?id=${id}`, { method: 'DELETE' })

// ─── Transactions ─────────────────────────────────────────────────────────────
export const getTransactions = (params?: { status?: string; type?: string; client_id?: string }) => {
  const q = params ? new URLSearchParams(params as Record<string, string>).toString() : ''
  return request<{ transactions: Transaction[] }>(`/transactions${q ? '?' + q : ''}`)
}

export const createTransaction = (data: Partial<Transaction>) =>
  request<{ transaction: Transaction }>('/transactions', { method: 'POST', body: JSON.stringify(data) })

export const updateTransaction = (id: string, data: Partial<Transaction>) =>
  request<{ transaction: Transaction }>('/transactions', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

export const deleteTransaction = (id: string) =>
  request<{ success: boolean }>(`/transactions?id=${id}`, { method: 'DELETE' })

// ─── Portfolios ───────────────────────────────────────────────────────────────
export const getPortfolios = (client_id?: string) => {
  const q = client_id ? `?client_id=${client_id}` : ''
  return request<{ portfolios: Portfolio[] }>(`/portfolios${q}`)
}

export const getPortfolio = (id: string) =>
  request<{ portfolio: Portfolio }>(`/portfolios?id=${id}`)

export const createPortfolio = (data: Partial<Portfolio>) =>
  request<{ portfolio: Portfolio }>('/portfolios', { method: 'POST', body: JSON.stringify(data) })

export const updatePortfolio = (id: string, data: Partial<Portfolio>) =>
  request<{ portfolio: Portfolio }>('/portfolios', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

export const deletePortfolio = (id: string) =>
  request<{ success: boolean }>(`/portfolios?id=${id}`, { method: 'DELETE' })

// ─── Messages ─────────────────────────────────────────────────────────────────
export const getMessages = (params?: { status?: string; search?: string }) => {
  const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
  return request<{ messages: Message[] }>(`/messages${q}`)
}

export const getMessage = (id: string) =>
  request<{ message: Message }>(`/messages?id=${id}`)

export const updateMessage = (id: string, data: Partial<Message>) =>
  request<{ message: Message }>('/messages', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

export const deleteMessage = (id: string) =>
  request<{ success: boolean }>(`/messages?id=${id}`, { method: 'DELETE' })

export const replyToMessage = (id: string, reply: string) =>
  request<{ success: boolean }>(`/messages/${id}/reply`, { method: 'POST', body: JSON.stringify({ reply }) })

// ─── Contact / Public ─────────────────────────────────────────────────────────
export const sendContactMessage = (data: { name: string; email: string; phone?: string; message: string }) =>
  request<{ success: boolean; message?: string }>('/contact', { method: 'POST', body: JSON.stringify(data) }, true)

// ─── Overview / Dashboard ─────────────────────────────────────────────────────
export const getOverview = () =>
  request<{ kpis: OverviewKPIs; recentActivity: RecentActivity[] }>('/overview')

// ─── News / Articles ──────────────────────────────────────────────────────────
export const getNews = (params?: { limit?: number; category?: string }) => {
  const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
  return request<{ articles: Article[] }>(`/news${q}`)
}

export const getArticle = (slug: string) =>
  request<{ article: Article }>(`/news?slug=${slug}`)

export const createArticle = (data: Partial<Article>) =>
  request<{ article: Article }>('/news', { method: 'POST', body: JSON.stringify(data) })

export const updateArticle = (id: string, data: Partial<Article>) =>
  request<{ article: Article }>('/news', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

export const deleteArticle = (id: string) =>
  request<{ success: boolean }>(`/news?id=${id}`, { method: 'DELETE' })

// ─── Markets ──────────────────────────────────────────────────────────────────
export const getMarkets = () =>
  request<{ markets: Market[] }>('/markets')

export const updateMarket = (id: string, data: Partial<Market>) =>
  request<{ market: Market }>('/markets', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

// ─── Services ─────────────────────────────────────────────────────────────────
export const getServices = () =>
  request<{ services: Service[] }>('/services')

export const createService = (data: Partial<Service>) =>
  request<{ service: Service }>('/services', { method: 'POST', body: JSON.stringify(data) })

export const updateService = (id: string, data: Partial<Service>) =>
  request<{ service: Service }>('/services', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

export const deleteService = (id: string) =>
  request<{ success: boolean }>(`/services?id=${id}`, { method: 'DELETE' })

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const getTestimonials = () =>
  request<{ testimonials: Testimonial[] }>('/testimonials')

export const createTestimonial = (data: Partial<Testimonial>) =>
  request<{ testimonial: Testimonial }>('/testimonials', { method: 'POST', body: JSON.stringify(data) })

export const updateTestimonial = (id: string, data: Partial<Testimonial>) =>
  request<{ testimonial: Testimonial }>('/testimonials', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

export const deleteTestimonial = (id: string) =>
  request<{ success: boolean }>(`/testimonials?id=${id}`, { method: 'DELETE' })

// ─── FAQs ─────────────────────────────────────────────────────────────────────
export const getFAQs = () =>
  request<{ faqs: FAQ[] }>('/faqs')

export const createFAQ = (data: Partial<FAQ>) =>
  request<{ faq: FAQ }>('/faqs', { method: 'POST', body: JSON.stringify(data) })

export const updateFAQ = (id: string, data: Partial<FAQ>) =>
  request<{ faq: FAQ }>('/faqs', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

export const deleteFAQ = (id: string) =>
  request<{ success: boolean }>(`/faqs?id=${id}`, { method: 'DELETE' })

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const getAuditLogs = () =>
  request<{ logs: AuditLog[] }>('/audit-logs')

// ─── Notifications ────────────────────────────────────────────────────────────
export const getNotifications = () =>
  request<{ notifications: Notification[] }>('/notifications')

export const markNotificationRead = (id: string) =>
  request<{ success: boolean }>(`/notifications?id=${id}`, { method: 'PATCH' })

// ─── Team ─────────────────────────────────────────────────────────────────────
export const getTeam = () =>
  request<{ team: TeamMember[] }>('/team')

export const createTeamMember = (data: Partial<TeamMember>) =>
  request<{ member: TeamMember }>('/team', { method: 'POST', body: JSON.stringify(data) })

export const updateTeamMember = (id: string, data: Partial<TeamMember>) =>
  request<{ member: TeamMember }>('/team', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

export const deleteTeamMember = (id: string) =>
  request<{ success: boolean }>(`/team?id=${id}`, { method: 'DELETE' })

// ─── Sub Admins ───────────────────────────────────────────────────────────────
export const getSubAdmins = () =>
  request<{ admins: SubAdmin[] }>('/sub-admins')

export const createSubAdmin = (data: Partial<SubAdmin> & { password: string }) =>
  request<{ admin: SubAdmin }>('/sub-admins', { method: 'POST', body: JSON.stringify(data) })

export const updateSubAdmin = (id: string, data: Partial<SubAdmin>) =>
  request<{ admin: SubAdmin }>('/sub-admins', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

export const deleteSubAdmin = (id: string) =>
  request<{ success: boolean }>(`/sub-admins?id=${id}`, { method: 'DELETE' })

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AdminUser {
  id: string; email: string; name?: string; role?: string
}

export interface ClientUser {
  id: string; email: string; name?: string; token?: string
}

export interface SettingRow {
  key: string; value: string
}

export interface Client {
  id: string; name: string; email?: string; phone?: string
  status?: string; portfolio_code?: string
  initial_investment?: string; created_at?: string
}

export interface Transaction {
  id: string; type: string; amount: number
  status?: string; description?: string
  created_at?: string; client_id?: string
  clients?: { name: string }
}

export interface Portfolio {
  id: string; client_id?: string; code?: string
  value?: number; currency?: string; created_at?: string
  clients?: { name: string }
}

export interface Message {
  id: string; name: string; email?: string; phone?: string
  message?: string; status?: string; reply?: string
  created_at?: string
}

export interface OverviewKPIs {
  totalClients: number; activeClients: number
  netAssets: number; totalDeposits: number
  totalWithdrawals: number; totalTransactions: number
  pendingTransactions: number
}

export interface RecentActivity {
  type: string; description: string; created_at: string
}

export interface Article {
  id: string; slug?: string; title: string
  category?: string; summary?: string; content?: string
  image_url?: string; published: boolean
  published_at?: string; created_at?: string
}

export interface Market {
  id: string; symbol: string; name?: string
  price?: number; change?: number; currency?: string; visible: boolean
}

export interface FAQ {
  id: string; question: string; answer: string; order: number; visible: boolean
}

export interface TeamMember {
  id: string; name: string; role?: string; bio?: string
  image_url?: string; order: number; visible: boolean
}

export interface SubAdmin {
  id: string; email: string; name?: string; role?: string
  permissions?: Record<string, boolean>; created_at?: string
}

export interface Service {
  id: number; slug?: string; emoji: string; icon?: string
  title: string; subtitle?: string; description?: string
  features: string[]; returns?: string; risk?: string
  minInvest?: string; visible: boolean; order: number
}

export interface Testimonial {
  id: number; name: string; role?: string; city?: string
  text: string; rating: number; visible: boolean; order: number
}

export interface AuditLog {
  id: string; actor_id?: string; actor_type?: string
  actor_email?: string; action?: string
  details?: Record<string, unknown>; created_at: string
}

export interface Notification {
  id: string; type?: string; title?: string; message?: string
  is_read: boolean; created_at: string
}

// ─── Client Portal ─────────────────────────────────────────────────────────────
export interface ClientProfile {
  id: string; name: string; email?: string; phone?: string
  status?: string; national_id?: string; address?: string
  created_at?: string; [key: string]: unknown
}

export interface ClientTransaction {
  id: string; client_id?: string; type?: string
  amount?: number; currency?: string; status?: string
  description?: string; reference?: string; created_at?: string
  [key: string]: unknown
}

export const getMyProfile = () =>
  request<{ client: ClientProfile }>('/client/profile', {}, true)

export const getMyPortfolio = () =>
  request<{ portfolio: Portfolio }>('/client/portfolio', {}, true)

export const getMyTransactions = (limit?: number) => {
  const q = limit ? `?limit=${limit}` : ''
  return request<{ transactions: ClientTransaction[] }>(`/client/transactions${q}`, {}, true)
}

export const submitContactMessage = (data: {
  name: string; email: string; phone?: string
  service?: string; message: string; source?: string
}) =>
  request<{ success: boolean; message?: string }>('/messages', {
    method: 'POST',
    body: JSON.stringify(data),
  })
