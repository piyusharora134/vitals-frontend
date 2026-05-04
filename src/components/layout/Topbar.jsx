import { Bell, Search } from 'lucide-react'

const pageTitles = {
  dashboard: 'Health Dashboard',
  predict:   'Risk Assessment',
  trends:    'Trends',
  model:     'Model Metrics',
  history:   'History',
  reports:   'Reports',
  settings:  'Settings',
  api:       'API Docs',
}

export default function Topbar({ page }) {
  return (
    <div style={{
      background: '#ffffff', borderBottom: '1px solid rgba(15,23,42,0.08)',
      padding: '0 24px', height: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
        {pageTitles[page] || 'Dashboard'}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Live status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#e6f7f4', color: '#0fa88a',
          fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 20,
        }}>
          <span style={{
            width: 6, height: 6, background: '#0fa88a', borderRadius: '50%',
            animation: 'pulse-dot 2s infinite',
          }} />
          Backend live
        </div>

        {/* Bell */}
        <div style={iconBtn}>
          <Bell size={15} strokeWidth={1.8} color="rgba(15,23,42,0.6)" />
        </div>

        {/* Search */}
        <div style={iconBtn}>
          <Search size={15} strokeWidth={1.8} color="rgba(15,23,42,0.6)" />
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

const iconBtn = {
  width: 32, height: 32,
  background: '#f8fafc', border: '1px solid rgba(15,23,42,0.08)',
  borderRadius: 8, display: 'flex', alignItems: 'center',
  justifyContent: 'center', cursor: 'pointer',
}
