import { useEffect, useRef, useState } from 'react'
import { Chart, registerables } from 'chart.js'
import { TrendingUp, ArrowUp, ArrowDown, BarChart3 } from 'lucide-react'
Chart.register(...registerables)

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('vitals_history') || '[]')
  } catch { return [] }
}

// ── Full Trend Chart ─────────────────────────────────────────────────────────
function FullTrendChart({ history }) {
  const ref = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy()

    const labels = history.map(h => {
      const d = new Date(h.timestamp)
      return d.toLocaleDateString('en', { month: 'short', day: 'numeric' }) + ' ' +
             d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
    })
    const data = history.map(h => h.result?.probability ?? 0)

    chartRef.current = new Chart(ref.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Risk Probability',
          data,
          borderColor: '#0fa88a',
          backgroundColor: 'rgba(15,168,138,0.08)',
          borderWidth: 2.5,
          pointRadius: 5,
          pointBackgroundColor: data.map(d =>
            d < 0.15 ? '#0fa88a' : d < 0.35 ? '#d97706' : '#e11d48'
          ),
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.35,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            titleFont: { size: 11 },
            bodyFont: { size: 12, family: 'DM Mono, monospace' },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: ctx => {
                const pct = (ctx.raw * 100).toFixed(1)
                const level = ctx.raw < 0.15 ? 'Low' : ctx.raw < 0.35 ? 'Moderate' : 'High'
                return ` ${pct}% — ${level} Risk`
              }
            },
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
            ticks: {
              font: { size: 10 }, color: 'rgba(15,23,42,0.4)',
              callback: v => (v * 100).toFixed(0) + '%',
            },
            min: 0, max: 1,
          },
        },
      },
    })
    return () => chartRef.current?.destroy()
  }, [history])

  return <canvas ref={ref} />
}

// ── Stat Chip ─────────────────────────────────────────────────────────────────
function StatChip({ icon: Icon, label, value, color, bg }) {
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 12,
      background: bg, border: `1px solid rgba(15,23,42,0.06)`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9, background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} color="white" strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.5px' }}>
          {value}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(15,23,42,0.45)' }}>{label}</div>
      </div>
    </div>
  )
}

// ── History Table ─────────────────────────────────────────────────────────────
function HistoryTable({ history }) {
  const riskBadge = (level) => {
    const map = {
      'Low Risk': { bg: '#f0fdf4', color: '#059669', border: '#bbf7d0' },
      'Moderate Risk': { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
      'High Risk': { bg: '#fff1f2', color: '#9f1239', border: '#fecdd3' },
    }
    const s = map[level] || map['Low Risk']
    return (
      <span style={{
        fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
        background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      }}>
        {level}
      </span>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
            {['#', 'Date & Time', 'Age', 'BMI', 'BP', 'Chol', 'Glucose', 'Probability', 'Risk Level'].map(h => (
              <th key={h} style={{
                padding: '10px 8px', textAlign: 'left', fontSize: 10,
                fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                color: 'rgba(15,23,42,0.35)',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...history].reverse().map((h, i) => {
            const d = new Date(h.timestamp)
            const dateStr = d.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
            const timeStr = d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
            return (
              <tr key={h.id} style={{
                borderBottom: '1px solid rgba(15,23,42,0.04)',
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(15,23,42,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={cellStyle}>{i + 1}</td>
                <td style={cellStyle}>
                  <div>{dateStr}</div>
                  <div style={{ fontSize: 10, color: 'rgba(15,23,42,0.35)' }}>{timeStr}</div>
                </td>
                <td style={cellStyle}>{h.input.age}</td>
                <td style={cellStyle}>{h.input.bmi}</td>
                <td style={cellStyle}>{h.input.blood_pressure}</td>
                <td style={cellStyle}>{h.input.cholesterol || '—'}</td>
                <td style={cellStyle}>{h.input.glucose || '—'}</td>
                <td style={{ ...cellStyle, fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>
                  {(h.result.probability * 100).toFixed(1)}%
                </td>
                <td style={cellStyle}>{riskBadge(h.result.risk_level)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const cellStyle = { padding: '10px 8px', color: '#0f172a' }

// ── Main Trends Page ──────────────────────────────────────────────────────────
export default function Trends() {
  const [history] = useState(() => getHistory())

  // Summary stats
  const totalPredictions = history.length
  const avgRisk = totalPredictions > 0
    ? (history.reduce((acc, h) => acc + (h.result?.probability ?? 0), 0) / totalPredictions * 100).toFixed(1) + '%'
    : '—'
  const highestRisk = totalPredictions > 0
    ? (Math.max(...history.map(h => h.result?.probability ?? 0)) * 100).toFixed(1) + '%'
    : '—'
  const lowestRisk = totalPredictions > 0
    ? (Math.min(...history.map(h => h.result?.probability ?? 0)) * 100).toFixed(1) + '%'
    : '—'

  return (
    <div style={{ padding: '22px 24px 40px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>Prediction Trends</div>
        <div style={{ fontSize: 13, color: 'rgba(15,23,42,0.4)' }}>
          Track your risk assessments over time — every prediction is recorded
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        <StatChip icon={BarChart3} label="Total Predictions" value={totalPredictions} color="linear-gradient(135deg,#0fa88a,#14b8a6)" bg="#f0fdf9" />
        <StatChip icon={TrendingUp} label="Average Risk" value={avgRisk} color="linear-gradient(135deg,#2563eb,#3b82f6)" bg="#eff6ff" />
        <StatChip icon={ArrowUp} label="Highest Risk" value={highestRisk} color="linear-gradient(135deg,#e11d48,#f43f5e)" bg="#fff1f2" />
        <StatChip icon={ArrowDown} label="Lowest Risk" value={lowestRisk} color="linear-gradient(135deg,#059669,#10b981)" bg="#f0fdf4" />
      </div>

      {/* Trend Chart */}
      <div style={card}>
        <div style={cardHeader}>
          <div>
            <div style={cardTitle}>Risk Probability Over Time</div>
            <div style={cardSub}>
              {totalPredictions > 0
                ? `${totalPredictions} prediction${totalPredictions !== 1 ? 's' : ''} tracked · Color-coded by risk tier`
                : 'Run predictions to see your trend line'
              }
            </div>
          </div>
          {totalPredictions > 0 && (
            <div style={{
              fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
              background: '#e6f7f4', color: '#0fa88a',
            }}>
              Live Data
            </div>
          )}
        </div>
        <div style={{ padding: '16px 18px' }}>
          {totalPredictions > 0 ? (
            <div style={{ position: 'relative', height: 320 }}>
              <FullTrendChart history={history} />
            </div>
          ) : (
            <div style={{
              padding: '60px 20px', textAlign: 'center',
              background: '#f8fafc', borderRadius: 10,
              border: '1px dashed rgba(15,23,42,0.12)',
            }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📈</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'rgba(15,23,42,0.4)', marginBottom: 6 }}>
                No trend data yet
              </div>
              <div style={{ fontSize: 12, color: 'rgba(15,23,42,0.3)', lineHeight: 1.6, maxWidth: 360, margin: '0 auto' }}>
                Each health risk prediction you run will appear here as a data point.
                Go to <strong>Risk Predict</strong> to generate your first assessment.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Risk threshold legend */}
      {totalPredictions > 0 && (
        <div style={{
          display: 'flex', gap: 16, padding: '12px 18px', marginTop: 14,
          background: '#ffffff', borderRadius: 10, border: '1px solid rgba(15,23,42,0.08)',
        }}>
          <div style={{ fontSize: 11, color: 'rgba(15,23,42,0.4)', fontWeight: 600, marginRight: 8 }}>
            RISK TIERS:
          </div>
          {[
            { label: 'Low (<15%)', color: '#0fa88a' },
            { label: 'Moderate (15-35%)', color: '#d97706' },
            { label: 'High (>35%)', color: '#e11d48' },
          ].map(t => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color }} />
              <span style={{ fontSize: 11, color: 'rgba(15,23,42,0.5)' }}>{t.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* History Table */}
      {totalPredictions > 0 && (
        <div style={{ ...card, marginTop: 14 }}>
          <div style={cardHeader}>
            <div>
              <div style={cardTitle}>Prediction Log</div>
              <div style={cardSub}>Complete history of all assessments</div>
            </div>
          </div>
          <div style={{ padding: '8px 18px 16px' }}>
            <HistoryTable history={history} />
          </div>
        </div>
      )}
    </div>
  )
}

const card = {
  background: '#ffffff', borderRadius: 14, border: '1px solid rgba(15,23,42,0.08)',
}
const cardHeader = {
  padding: '16px 18px 12px', borderBottom: '1px solid rgba(15,23,42,0.04)',
  display: 'flex', justifyContent: 'space-between',
}
const cardTitle = { fontSize: 14, fontWeight: 600, color: '#0f172a' }
const cardSub   = { fontSize: 12, color: 'rgba(15,23,42,0.4)', marginTop: 1 }
