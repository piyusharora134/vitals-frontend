import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

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

// ── Trend Chart ───────────────────────────────────────────────────────────────
function TrendChart() {
  const ref = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy()
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - 13 + i)
      return d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
    })
    const data = [0.18, 0.22, 0.19, 0.28, 0.25, 0.31, 0.27, 0.24, 0.33, 0.29, 0.21, 0.26, 0.19, 0.23]
    chartRef.current = new Chart(ref.current, {
      type: 'line',
      data: {
        labels: days,
        datasets: [{
          data,
          borderColor: '#0fa88a',
          backgroundColor: 'rgba(15,168,138,0.08)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#0fa88a',
          pointBorderColor: 'white',
          pointBorderWidth: 1.5,
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${(ctx.raw * 100).toFixed(1)}% risk` } },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 10 }, color: 'rgba(15,23,42,0.4)' },
            border: { display: false },
          },
          y: {
            grid: { color: 'rgba(15,23,42,0.04)' },
            border: { display: false },
            ticks: { font: { size: 10 }, color: 'rgba(15,23,42,0.4)', callback: v => (v * 100).toFixed(0) + '%' },
            min: 0, max: 0.6,
          },
        },
      },
    })
    return () => chartRef.current?.destroy()
  }, [])

  return <canvas ref={ref} />
}

// ── Donut Chart ───────────────────────────────────────────────────────────────
function DonutChart() {
  const ref = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new Chart(ref.current, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [68, 21, 11],
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
  }, [])

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

// ── Alert Item ────────────────────────────────────────────────────────────────
function AlertItem({ color, bg, border, text, time, textColor }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 12px', borderRadius: 9,
      background: bg, border: `1px solid ${border}`,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 3 }} />
      <div>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: textColor }}>{text}</div>
        <div style={{ fontSize: 10, marginTop: 2, opacity: 0.6, color: textColor }}>{time}</div>
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
import { Activity, CheckCircle2, Users, Zap } from 'lucide-react'

export default function Dashboard({ predictionData }) {
  const statCards = [
    { icon: Activity, iconBg: 'linear-gradient(135deg,#0fa88a,#14b8a6)', label: 'Model Accuracy',    value: '83.4%',  delta: '↑ 2.1%', deltaUp: true  },
    { icon: CheckCircle2, iconBg: 'linear-gradient(135deg,#2563eb,#3b82f6)', label: 'ROC-AUC Score', value: '0.924',  delta: '↑ 0.03', deltaUp: true  },
    { icon: Users,    iconBg: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', label: 'Dataset Records',   value: '20,482', delta: '+248',    deltaUp: true  },
    { icon: Zap,      iconBg: 'linear-gradient(135deg,#d97706,#f59e0b)', label: 'Inference Latency', value: '<92ms',  delta: '↓ 3ms',  deltaUp: false },
  ]

  const metrics = [
    { label: 'Accuracy',    value: 83, color: 'linear-gradient(90deg,#0fa88a,#14b8a6)' },
    { label: 'ROC-AUC',     value: 92, color: 'linear-gradient(90deg,#2563eb,#3b82f6)' },
    { label: 'Sensitivity', value: 87, color: 'linear-gradient(90deg,#7c3aed,#8b5cf6)' },
    { label: 'Specificity', value: 80, color: 'linear-gradient(90deg,#d97706,#f59e0b)' },
    { label: 'F1-Score',    value: 85, color: 'linear-gradient(90deg,#e11d48,#f43f5e)' },
  ]

  const alerts = [
    { color: '#e11d48', bg: '#fff1f2', border: '#fecdd3', textColor: '#9f1239', text: 'High Risk patient flag — BMI 34.2, BP 158mmHg detected', time: '2 min ago' },
    { color: '#d97706', bg: '#fffbeb', border: '#fde68a', textColor: '#92400e', text: 'Model retrain suggested — 248 new records available',          time: '1 hour ago' },
    { color: '#059669', bg: '#f0fdf4', border: '#bbf7d0', textColor: '#065f46', text: 'Flask API healthy — uptime 99.7% (last 24h)',                   time: 'Online' },
  ]

  const ensemble = [
    { pct: '38%', label: 'XGBoost',          color: '#0fa88a' },
    { pct: '25%', label: 'Random Forest',     color: '#2563eb' },
    { pct: '22%', label: 'Grad. Boost',       color: '#7c3aed' },
    { pct: '15%', label: 'Log. Regression',   color: '#d97706' },
  ]

  const cloudTags = [
    { text: 'Firebase Auth', bg: '#e6f7f4', color: '#0fa88a' },
    { text: 'Firestore DB',  bg: '#eff6ff', color: '#2563eb' },
    { text: 'Render.com',    bg: '#f5f3ff', color: '#7c3aed' },
    { text: 'Supabase',      bg: '#fffbeb', color: '#d97706' },
  ]

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
              <div style={cardSub}>Daily ensemble predictions (last 14 days)</div>
            </div>
            <select style={{ fontSize: 12, border: '1px solid rgba(15,23,42,0.1)', borderRadius: 6, padding: '4px 8px', background: '#f8fafc', color: 'rgba(15,23,42,0.6)', outline: 'none' }}>
              <option>14 Days</option><option>30 Days</option>
            </select>
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
              <div style={cardSub}>Current session breakdown</div>
            </div>
          </div>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, position: 'relative' }}>
              <DonutChart />
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -1, fontFamily: 'DM Mono, monospace', color: '#0f172a' }}>68%</div>
                <div style={{ fontSize: 11, color: 'rgba(15,23,42,0.4)', marginTop: 2 }}>Low Risk</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 12 }}>
              {[['68%','Low','#059669'],['21%','Moderate','#d97706'],['11%','High','#e11d48']].map(([v,l,c]) => (
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

        {/* Alerts + Cloud */}
        <div style={card}>
          <div style={{ ...cardHeader, alignItems: 'center' }}>
            <div>
              <div style={cardTitle}>System Alerts</div>
              <div style={cardSub}>Recent activity & recommendations</div>
            </div>
            <span style={{ background: '#e11d48', color: 'white', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10 }}>3</span>
          </div>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {alerts.map((a, i) => <AlertItem key={i} {...a} />)}
            </div>

            <div style={{ marginTop: 16, padding: '12px 14px', background: 'linear-gradient(135deg,#f0fdf4,#eff6ff)', borderRadius: 10, border: '1px solid rgba(15,23,42,0.06)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>☁ Cloud Integration (Free Tier)</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {cloudTags.map(t => (
                  <span key={t.text} style={{ background: t.bg, color: t.color, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 5 }}>
                    {t.text}
                  </span>
                ))}
              </div>
            </div>
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
