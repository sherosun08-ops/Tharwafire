import { useState } from 'react'
import { Bell, LogOut, Settings, ChevronLeft, Menu, X } from 'lucide-react'
import Overview from './pages/Overview'
import Clients from './pages/Clients'
import Portfolios from './pages/Portfolios'
import Transactions from './pages/Transactions'
import Messages from './pages/Messages'
import Content from './pages/Content'
import Reports from './pages/Reports'
import Team from './pages/Team'
import Notifications from './pages/Notifications'
import SettingsPage from './pages/Settings'
import Security from './pages/Security'
import { mockNotifications } from './adminData'

type Page = 'overview' | 'clients' | 'portfolios' | 'transactions' | 'messages' | 'content' | 'reports' | 'team' | 'notifications' | 'settings' | 'security'

interface Props {
  onLogout: () => void
}

const navGroups = [
  {
    title: 'الرئيسية',
    items: [
      { key: 'overview', icon: '⚡', label: 'لوحة التحكم' },
    ],
  },
  {
    title: 'إدارة العملاء',
    items: [
      { key: 'clients', icon: '👥', label: 'العملاء' },
      { key: 'portfolios', icon: '📁', label: 'المحافظ' },
      { key: 'transactions', icon: '💸', label: 'العمليات' },
      { key: 'messages', icon: '💬', label: 'الرسائل', badge: 3 },
    ],
  },
  {
    title: 'المنصة',
    items: [
      { key: 'content', icon: '📰', label: 'إدارة المحتوى' },
      { key: 'reports', icon: '📊', label: 'التقارير' },
      { key: 'team', icon: '👤', label: 'الفريق' },
    ],
  },
  {
    title: 'النظام',
    items: [
      { key: 'notifications', icon: '🔔', label: 'الإشعارات', badge: mockNotifications.filter(n => !n.read).length },
      { key: 'settings', icon: '⚙️', label: 'الإعدادات' },
      { key: 'security', icon: '🔒', label: 'السجلات والأمان' },
    ],
  },
]

const pageTitles: Record<Page, string> = {
  overview: 'لوحة التحكم',
  clients: 'إدارة العملاء',
  portfolios: 'المحافظ الاستثمارية',
  transactions: 'العمليات والصفقات',
  messages: 'نظام المراسلات',
  content: 'إدارة المحتوى',
  reports: 'التقارير والإحصائيات',
  team: 'إدارة الفريق',
  notifications: 'مركز الإشعارات',
  settings: 'الإعدادات',
  security: 'السجلات والأمان',
}

export default function AdminLayout({ onLogout }: Props) {
  const [page, setPage] = useState<Page>('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showNotifPanel, setShowNotifPanel] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const unreadNotifs = mockNotifications.filter(n => !n.read).length

  const renderPage = () => {
    switch (page) {
      case 'overview': return <Overview />
      case 'clients': return <Clients />
      case 'portfolios': return <Portfolios />
      case 'transactions': return <Transactions />
      case 'messages': return <Messages />
      case 'content': return <Content />
      case 'reports': return <Reports />
      case 'team': return <Team />
      case 'notifications': return <Notifications />
      case 'settings': return <SettingsPage />
      case 'security': return <Security />
      default: return <Overview />
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060E1A',
      display: 'flex',
      fontFamily: "'Cairo', sans-serif",
      direction: 'rtl',
      color: '#E2E8F4',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarCollapsed ? 68 : 240,
        background: '#0A1628',
        borderLeft: '1px solid #1A2E4A',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
        zIndex: 100,
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowX: 'hidden',
      }}>
        {/* Logo Area */}
        <div style={{ padding: '18px 14px', borderBottom: '1px solid #1A2E4A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 64, overflow: 'hidden' }}>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(201,168,76,0.3), rgba(201,168,76,0.05))', border: '2px solid rgba(201,168,76,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>🔰</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E2E8F4', whiteSpace: 'nowrap' }}>الثروة كابيتال</div>
                <div style={{ fontSize: '0.62rem', color: '#6B84A8', whiteSpace: 'nowrap' }}>Admin Panel</div>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(201,168,76,0.3), rgba(201,168,76,0.05))', border: '2px solid rgba(201,168,76,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', margin: '0 auto' }}>🔰</div>
          )}
          {!sidebarCollapsed && (
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B84A8', display: 'flex', padding: 4, flexShrink: 0, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.color = '#6B84A8'}>
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Toggle when collapsed */}
        {sidebarCollapsed && (
          <button onClick={() => setSidebarCollapsed(false)} style={{ margin: '10px 8px', background: 'none', border: '1px solid #1A2E4A', borderRadius: 8, cursor: 'pointer', color: '#6B84A8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.color = '#C9A84C' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1A2E4A'; e.currentTarget.style.color = '#6B84A8' }}>
            <Menu size={16} />
          </button>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0', scrollbarWidth: 'thin', scrollbarColor: '#1A2E4A transparent' }}>
          {navGroups.map(group => (
            <div key={group.title} style={{ marginBottom: 4 }}>
              {!sidebarCollapsed && (
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#4A6080', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '10px 16px 5px' }}>
                  {group.title}
                </div>
              )}
              {group.items.map(item => {
                const isActive = page === item.key
                return (
                  <button key={item.key}
                    onClick={() => setPage(item.key as Page)}
                    title={sidebarCollapsed ? item.label : undefined}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: sidebarCollapsed ? '10px' : '10px 14px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: isActive ? '#C9A84C' : '#7A9AB8',
                      fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
                      fontFamily: "'Cairo', sans-serif", transition: 'all 0.2s',
                      textAlign: 'right', position: 'relative', justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                      background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
                      borderRight: isActive ? '2px solid #C9A84C' : '2px solid transparent',
                      borderLeft: 'none',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#C9A84C'; if (!isActive) e.currentTarget.style.background = 'rgba(201,168,76,0.04)' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#7A9AB8'; if (!isActive) e.currentTarget.style.background = 'transparent' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0, width: sidebarCollapsed ? 24 : 'auto', textAlign: 'center' }}>{item.icon}</span>
                    {!sidebarCollapsed && (
                      <>
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                        {(item as any).badge > 0 && (
                          <span style={{ background: '#FF4560', color: 'white', borderRadius: 10, padding: '1px 7px', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>
                            {(item as any).badge}
                          </span>
                        )}
                      </>
                    )}
                    {sidebarCollapsed && (item as any).badge > 0 && (
                      <span style={{ position: 'absolute', top: 4, left: 4, width: 8, height: 8, background: '#FF4560', borderRadius: '50%', border: '2px solid #0A1628' }} />
                    )}
                  </button>
                )
              })}
              {!sidebarCollapsed && <div style={{ height: 1, background: 'rgba(26,46,74,0.4)', margin: '6px 14px' }} />}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid #1A2E4A' }}>
          <button onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,0.05)'}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#060E1A', flexShrink: 0 }}>أ</div>
            {!sidebarCollapsed && (
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E2E8F4', whiteSpace: 'nowrap' }}>أحمد المشرف</div>
                <div style={{ fontSize: '0.65rem', color: '#C9A84C' }}>👑 Super Admin</div>
              </div>
            )}
          </button>

          {/* User Menu */}
          {showUserMenu && !sidebarCollapsed && (
            <div style={{ marginTop: 8, background: '#111E33', border: '1px solid #1A2E4A', borderRadius: 10, overflow: 'hidden' }}>
              <button onClick={() => { setPage('settings'); setShowUserMenu(false) }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'none', border: 'none', color: '#E2E8F4', fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif', textAlign: 'right" }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                <Settings size={14} color="#6B84A8" /> الإعدادات
              </button>
              <div style={{ height: 1, background: '#1A2E4A' }} />
              <button onClick={onLogout}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'none', border: 'none', color: '#FF4560', fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif', textAlign: 'right" }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,69,96,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                <LogOut size={14} /> تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          height: 64, background: '#0A1628', borderBottom: '1px solid #1A2E4A',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 90, gap: 16,
        }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
            <span style={{ color: '#6B84A8' }}>الثروة كابيتال</span>
            <span style={{ color: '#6B84A8' }}>›</span>
            <span style={{ color: '#E2E8F4', fontWeight: 600 }}>{pageTitles[page]}</span>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Quick search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, padding: '7px 14px', fontSize: '0.82rem', color: '#6B84A8', cursor: 'pointer' }}>
              <span>🔍</span>
              <span>بحث سريع</span>
              <kbd style={{ background: '#1A2E4A', borderRadius: 4, padding: '1px 6px', fontSize: '0.7rem', color: '#6B84A8', marginRight: 8 }}>Ctrl K</kbd>
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifPanel(!showNotifPanel)}
                style={{ width: 38, height: 38, background: showNotifPanel ? 'rgba(201,168,76,0.1)' : '#060E1A', border: `1px solid ${showNotifPanel ? 'rgba(201,168,76,0.3)' : '#1A2E4A'}`, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B84A8', position: 'relative', transition: 'all 0.2s' }}>
                <Bell size={17} />
                {unreadNotifs > 0 && (
                  <span style={{ position: 'absolute', top: 6, left: 6, width: 8, height: 8, background: '#FF4560', border: '2px solid #0A1628', borderRadius: '50%' }} />
                )}
              </button>

              {/* Notif Dropdown */}
              {showNotifPanel && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, width: 340, background: '#111E33', border: '1px solid #1A2E4A', borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 200, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #1A2E4A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#E2E8F4' }}>الإشعارات</span>
                    <span style={{ fontSize: '0.72rem', color: '#C9A84C', cursor: 'pointer' }}>تعليم الكل مقروء</span>
                  </div>
                  {mockNotifications.slice(0, 5).map(n => (
                    <div key={n.id} style={{ display: 'flex', gap: 10, padding: '12px 16px', borderBottom: '1px solid rgba(26,46,74,0.4)', cursor: 'pointer', background: !n.read ? 'rgba(201,168,76,0.03)' : 'transparent', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = !n.read ? 'rgba(201,168,76,0.03)' : 'transparent'}>
                      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{n.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: !n.read ? 700 : 500, color: '#E2E8F4' }}>{n.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#6B84A8', marginTop: 2 }}>{n.desc}</div>
                      </div>
                      {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#C9A84C', flexShrink: 0, marginTop: 6 }} />}
                    </div>
                  ))}
                  <div onClick={() => { setPage('notifications'); setShowNotifPanel(false) }}
                    style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.82rem', color: '#C9A84C', cursor: 'pointer', fontWeight: 600, borderTop: '1px solid #1A2E4A' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    عرض كل الإشعارات
                  </div>
                </div>
              )}
            </div>

            {/* Status Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(0,217,126,0.08)', border: '1px solid rgba(0,217,126,0.2)', borderRadius: 8, fontSize: '0.72rem', color: '#00D97E', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D97E', animation: 'pulse 2s ease infinite' }} />
              النظام يعمل
            </div>

            {/* Logout */}
            <button onClick={onLogout}
              style={{ width: 38, height: 38, background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B84A8', transition: 'all 0.2s' }}
              title="تسجيل الخروج"
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,69,96,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,69,96,0.3)'; e.currentTarget.style.color = '#FF4560' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#060E1A'; e.currentTarget.style.borderColor = '#1A2E4A'; e.currentTarget.style.color = '#6B84A8' }}>
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: 28, overflowY: 'auto', maxWidth: '100%' }}>
          {renderPage()}
        </main>
      </div>

      {/* Close menus on outside click */}
      {(showNotifPanel || showUserMenu) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 80 }} onClick={() => { setShowNotifPanel(false); setShowUserMenu(false) }} />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1A2E4A; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #2A3E5A; }
      `}</style>
    </div>
  )
}
