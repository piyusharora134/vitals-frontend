import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Dashboard from './pages/Dashboard'
import Predict from './pages/Predict'
import Reports from './pages/Reports'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [predictionData, setPredictionData] = useState(null)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'DM Sans, sans-serif' }}>
      <Sidebar page={page} setPage={setPage} />
      <div style={{ marginLeft: 220, flex: 1, minHeight: '100vh' }}>
        <Topbar page={page} />
        {page === 'dashboard' && <Dashboard predictionData={predictionData} />}
        {page === 'predict'   && <Predict setPredictionData={setPredictionData} />}
        {page === 'reports'   && <Reports predictionData={predictionData} />}
        {!['dashboard','predict','reports'].includes(page) && (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: 'rgba(15,23,42,0.3)', fontSize: 14 }}>
            This section is coming soon.
          </div>
        )}
      </div>
    </div>
  )
}