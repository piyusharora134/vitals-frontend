import { useEffect, useRef, useState } from 'react'
import { Chart, registerables } from 'chart.js'
import { Activity, CheckCircle2, Users, Zap, Clock } from 'lucide-react'
Chart.register(...registerables)

// ── Helper: read prediction history from localStorage ─────────────────────────
function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('vitals_history') || '[]')
  } catch { return [] }
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconBg, label, value, delta, deltaUp }) {
  return (
    <div style={{
      background: '#ffffff', borderRadius: 14, border: '1px solid rgba(15,23,42,0.08)',
      padding: '16px 18px', cursor: 'default', transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={15} color="white" strokeWidth={2} />
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '3px 7px', borderRadius: 6,
          color: deltaUp ? '#059669' : '#e11d48',
          background: deltaUp ? '#d1fae5' : '#fff1f2',
        }}>
          {delta}
        </span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px', color: '#0f172a', lineHeight: 1, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(15,23,42,0.4)' }}>{label}</div>
    </div>
  )
}

// ── Trend Chart (reads real data from localStorage) ──────────────────────────
function TrendChart() {
  const ref = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy()

    const history = getHistory()

    // If we have real predictions, use them. Otherwise show empty.
    let labels = []
    let data = []

    if (history.length > 0) {
      // Take last 20 entries max for the dashboard view
      const recent = history.slice(-20)
      labels = recent.map(h => {
        const d = new Date(h.timestamp)
        return d.toLocaleDateString('en', { month: 'short', day: 'numeric' }) + ' ' +
               d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
      })
      data = recent.map(h => h.result?.probability ?? 0)
    }

    chartRef.current = new Chart(ref.current, {
      type: 'line',
      data: {
        labels: labels.length ? labels : ['No data yet'],
        datasets: [{
          data: data.length ? data : [0],
          borderColor: '#0fa88a',
          backgroundColor: 'rgba(15,168,138,0.08)',
          borderWidth: 2,
          pointRadius: data.length ? 4 : 0,
          pointBackgroundColor: '#0fa88a',
          pointBorderColor: 'white',
          pointBorderWidth: 1.5,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: data.length > 0,
            callbacks: { label: ctx => ` ${(ctx.raw * 100).toFixed(1)}% risk` },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 10 }, color: 'rgba(15,23,42,0.4)', maxRotation: 45 },
            border: { display: false },
          },
          y: {
            grid: { color: 'rgba(15,23,42,0.04)' },
            border: { display: false },
            ticks: { font: { size: 10 }, color: 'rgba(15,23,42,0.4)', callback: v => (v * 100).toFixed(0) + '%' },
            min: 0, max: 1,
          },
        },
      },
    })
    return () => chartRef.current?.destroy()
  }, [])

  const history = getHistory()

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={ref} />
      {history.length === 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(248,250,252,0.8)', borderRadius: 8,
        }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>📊</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(15,23,42,0.4)' }}>
            No predictions yet
          </div>
          <div style={{ fontSize: 11, color: 'rgba(15,23,42,0.3)', marginTop: 2 }}>
            Go to Risk Predict to generate your first assessment
          </div>
        </div>
      )}
    </div>
  )
}

// ── Donut Chart ───────────────────────────────────────────────────────────────
function DonutChart({ distribution }) {
  const ref = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new Chart(ref.current, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [distribution.low, distribution.moderate, distribution.high],
          backgroundColor: ['#0fa88a', '#d97706', '#e11d48'],
          borderColor: 'white',
          borderWidth: 3,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: false, cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.raw}%` } },
        },
      },
    })
    return () => chartRef.current?.destroy()
  }, [distribution])

  return <canvas ref={ref} width={160} height={160} style={{ maxWidth: 160 }} />
}

// ── Metric Row ────────────────────────────────────────────────────────────────
function MetricRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 12, color: 'rgba(15,23,42,0.6)', width: 130, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: 'rgba(15,23,42,0.05)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, background: color, width: `${value}%`, transition: 'width 1s ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'DM Mono, monospace', color: '#0f172a', width: 38, textAlign: 'right' }}>
        {value}%
      </span>
    </div>
  )
}

// ── Prediction History Item ──────────────────────────────────────────────────
function HistoryItem({ entry }) {
  const prob = (entry.result.probability * 100).toFixed(1)
  const level = entry.result.risk_level
  const colorMap = {
    'Low Risk': { color: '#059669', bg: '#f0fdf4', border: '#bbf7d0', dot: '#0fa88a' },
    'Moderate Risk': { color: '#92400e', bg: '#fffbeb', border: '#fde68a', dot: '#d97706' },
    'High Risk': { color: '#9f1239', bg: '#fff1f2', border: '#fecdd3', dot: '#e11d48' },
  }
  const s = colorMap[level] || colorMap['Low Risk']
  const d = new Date(entry.timestamp)
  const timeStr = d.toLocaleDateString('en', { month: 'short', day: 'numeric' }) + ' · ' +
                  d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', borderRadius: 9,
      background: s.bg, border: `1px solid ${s.border}`,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: s.color, lineHeight: 1.5 }}>
          {level} — <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{prob}%</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(15,23,42,0.45)', marginTop: 1 }}>
          Age {entry.input.age} · BMI {entry.input.bmi} · BP {entry.input.blood_pressure}
        </div>
      </div>
      <div style={{ fontSize: 10, color: 'rgba(15,23,42,0.35)', flexShrink: 0, textAlign: 'right' }}>
        {timeStr}
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard({ predictionData }) {
  const [history] = useState(() => getHistory())

  // Compute distribution from history
  const distribution = (() => {
    if (history.length === 0) return { low: 68, moderate: 21, high: 11 } // defaults
    const counts = { low: 0, moderate: 0, high: 0 }
    history.forEach(h => {
      const level = h.result?.risk_level
      if (level === 'Low Risk') counts.low++
      else if (level === 'Moderate Risk') counts.moderate++
      else if (level === 'High Risk') counts.high++
    })
    const total = counts.low + counts.moderate + counts.high || 1
    return {
      low: Math.round(counts.low / total * 100),
      moderate: Math.round(counts.moderate / total * 100),
      high: Math.round(counts.high / total * 100),
    }
  })()

  const dominantRisk = distribution.low >= distribution.moderate && distribution.low >= distribution.high ? 'Low'
    : distribution.moderate >= distribution.high ? 'Moderate' : 'High'

  const statCards = [
    { icon: Activity, iconBg: 'linear-gradient(135deg,#0fa88a,#14b8a6)', label: 'Model Accuracy',    value: '83.5%',  delta: '↑ 2.1%', deltaUp: true  },
    { icon: CheckCircle2, iconBg: 'linear-gradient(135deg,#2563eb,#3b82f6)', label: 'ROC-AUC Score', value: '0.916',  delta: '↑ 0.03', deltaUp: true  },
    { icon: Users,    iconBg: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', label: 'Predictions Made',  value: String(history.length), delta: history.length > 0 ? `+${Math.min(history.length, 10)}` : '—', deltaUp: history.length > 0  },
    { icon: Zap,      iconBg: 'linear-gradient(135deg,#d97706,#f59e0b)', label: 'Inference Latency', value: '<92ms',  delta: '↓ 3ms',  deltaUp: false },
  ]

  const metrics = [
    { label: 'Accuracy',    value: 83, color: 'linear-gradient(90deg,#0fa88a,#14b8a6)' },
    { label: 'ROC-AUC',     value: 92, color: 'linear-gradient(90deg,#2563eb,#3b82f6)' },
    { label: 'Sensitivity', value: 86, color: 'linear-gradient(90deg,#7c3aed,#8b5cf6)' },
    { label: 'Specificity', value: 83, color: 'linear-gradient(90deg,#d97706,#f59e0b)' },
    { label: 'F1-Score',    value: 84, color: 'linear-gradient(90deg,#e11d48,#f43f5e)' },
  ]

  const ensemble = [
    { pct: '38%', label: 'XGBoost',          color: '#0fa88a' },
    { pct: '25%', label: 'Random Forest',     color: '#2563eb' },
    { pct: '22%', label: 'Grad. Boost',       color: '#7c3aed' },
    { pct: '15%', label: 'Log. Regression',   color: '#d97706' },
  ]

  // Most recent 6 predictions for the history card
  const recentHistory = [...history].reverse().slice(0, 6)

  return (
    <div style={{ padding: '22px 24px 40px' }}>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {statCards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: 14, marginBottom: 20 }}>

        {/* Trend chart */}
        <div style={card}>
          <div style={cardHeader}>
            <div>
              <div style={cardTitle}>Risk Probability Trend</div>
              <div style={cardSub}>
                {history.length > 0
                  ? `Tracking ${history.length} prediction${history.length !== 1 ? 's' : ''}`
                  : 'Real-time tracking of your predictions'
                }
              </div>
            </div>
            {history.length > 0 && (
              <div style={{
                fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                background: '#e6f7f4', color: '#0fa88a',
              }}>
                Live Data
              </div>
            )}
          </div>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ position: 'relative', height: 200 }}>
              <TrendChart />
            </div>
          </div>
        </div>

        {/* Donut chart */}
        <div style={card}>
          <div style={cardHeader}>
            <div>
              <div style={cardTitle}>Risk Distribution</div>
              <div style={cardSub}>
                {history.length > 0 ? 'Based on your predictions' : 'Default distribution'}
              </div>
            </div>
          </div>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, position: 'relative' }}>
              <DonutChart distribution={distribution} />
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -1, fontFamily: 'DM Mono, monospace', color: '#0f172a' }}>
                  {distribution[dominantRisk.toLowerCase()]}%
                </div>
                <div style={{ fontSize: 11, color: 'rgba(15,23,42,0.4)', marginTop: 2 }}>{dominantRisk} Risk</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 12 }}>
              {[[`${distribution.low}%`,'Low','#059669'],[`${distribution.moderate}%`,'Moderate','#d97706'],[`${distribution.high}%`,'High','#e11d48']].map(([v,l,c]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: c }}>{v}</div>
                  <div style={{ fontSize: 11, color: 'rgba(15,23,42,0.4)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Model metrics */}
        <div style={card}>
          <div style={cardHeader}>
            <div>
              <div style={cardTitle}>Model Performance Metrics</div>
              <div style={cardSub}>Ensemble on held-out test set</div>
            </div>
          </div>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {metrics.map(m => <MetricRow key={m.label} {...m} />)}
            </div>

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(15,23,42,0.05)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(15,23,42,0.35)', marginBottom: 10 }}>
                Ensemble Composition
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ensemble.map(e => (
                  <div key={e.label} style={{ flex: 1, minWidth: 90, padding: '8px 10px', background: '#f8fafc', borderRadius: 8, border: '1px solid rgba(15,23,42,0.08)' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: e.color }}>{e.pct}</div>
                    <div style={{ fontSize: 11, color: 'rgba(15,23,42,0.4)' }}>{e.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Prediction History (replaces System Alerts) */}
        <div style={card}>
          <div style={{ ...cardHeader, alignItems: 'center' }}>
            <div>
              <div style={cardTitle}>Recent Predictions</div>
              <div style={cardSub}>Your latest health assessments</div>
            </div>
            {history.length > 0 && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: '#e6f7f4', color: '#0fa88a',
                fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 10,
              }}>
                <Clock size={10} />
                {history.length}
              </span>
            )}
          </div>
          <div style={{ padding: '16px 18px' }}>
            {recentHistory.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentHistory.map(entry => (
                  <HistoryItem key={entry.id} entry={entry} />
                ))}
                {history.length > 6 && (
                  <div style={{
                    fontSize: 11, color: 'rgba(15,23,42,0.35)', textAlign: 'center',
                    padding: '6px', marginTop: 4,
                  }}>
                    + {history.length - 6} more predictions in history
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                padding: '40px 20px', textAlign: 'center',
                background: '#f8fafc', borderRadius: 10,
                border: '1px dashed rgba(15,23,42,0.12)',
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔬</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(15,23,42,0.4)', marginBottom: 4 }}>
                  No predictions yet
                </div>
                <div style={{ fontSize: 11, color: 'rgba(15,23,42,0.3)', lineHeight: 1.5 }}>
                  Run your first health risk assessment from the Predict page
                  to see your history here.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Shared card styles
const card = {
  background: '#ffffff', borderRadius: 14, border: '1px solid rgba(15,23,42,0.08)',
}
const cardHeader = {
  padding: '16px 18px 12px', borderBottom: '1px solid rgba(15,23,42,0.04)',
  display: 'flex', justifyContent: 'space-between',
}
const cardTitle = { fontSize: 14, fontWeight: 600, color: '#0f172a' }
const cardSub   = { fontSize: 12, color: 'rgba(15,23,42,0.4)', marginTop: 1 }
