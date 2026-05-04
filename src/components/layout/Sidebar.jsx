import {
  Activity, LayoutDashboard, Brain, TrendingUp,
  Database, Clock, FileText, Settings, Coffee, BookOpen
} from 'lucide-react'

const navSections = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'predict',   icon: Brain,           label: 'Risk Predict' },
      { id: 'trends',    icon: TrendingUp,      label: 'Trends' },
    ],
  },
  {
    label: 'Analysis',
    items: [
      { id: 'model',   icon: Database, label: 'Model Metrics' },
      { id: 'history', icon: Clock,    label: 'History',  badge: '12' },
      { id: 'reports', icon: FileText, label: 'Reports' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'settings', icon: Settings, label: 'Settings' },
      { id: 'api',      icon: BookOpen, label: 'API Docs' },
    ],
  },
]

export default function Sidebar({ page, setPage }) {
  return (
    <aside style={{
      width: 220, background: '#ffffff', borderRight: '1px solid rgba(15,23,42,0.08)',
      display: 'flex', flexDirection: 'column', padding: '0 0 16px',
      position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100, overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '18px 18px 16px', borderBottom: '1px solid rgba(15,23,42,0.06)',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'linear-gradient(135deg, #0fa88a, #2563eb)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Activity size={15} color="white" strokeWidth={2.2} />
        </div>
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.3px', color: '#0f172a' }}>
          VITALS<span style={{ color: '#0fa88a' }}>.</span>
        </span>
      </div>

      {/* Nav sections */}
      <div style={{ flex: 1, padding: '8px 10px 0' }}>
        {navSections.map(section => (
          <div key={section.label} style={{ marginBottom: 4 }}>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'rgba(15,23,42,0.35)',
              padding: '10px 8px 4px',
            }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const Icon = item.icon
              const active = page === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                    fontSize: 13, fontWeight: 500, marginBottom: 1,
                    color: active ? '#0fa88a' : 'rgba(15,23,42,0.6)',
                    background: active ? '#e6f7f4' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(15,23,42,0.04)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      background: '#e11d48', color: 'white',
                      fontSize: 10, fontWeight: 600,
                      padding: '1px 6px', borderRadius: 10,
                    }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* User footer */}
      <div style={{ padding: '12px 10px 0', borderTop: '1px solid rgba(15,23,42,0.06)', margin: '0 0 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(15,23,42,0.04)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0fa88a, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 12, fontWeight: 600, flexShrink: 0,
          }}>
            H
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>Health Analyst</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
