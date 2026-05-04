import { Heart, Droplets, Wind, Scale } from 'lucide-react'

// ── Health Metric Card ───────────────────────────────────────────────────────────
function HealthMetric({ label, value, unit, normalRange, status, icon: Icon }) {
  const statusConfig = {
    normal: { color: '#059669', bg: '#f0fdf4', border: '#bbf7d0', text: 'Normal' },
    warning: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', text: 'Elevated' },
    danger: { color: '#e11d48', bg: '#fff1f2', border: '#fecdd3', text: 'High' },
  }
  const config = statusConfig[status] || statusConfig.normal

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', borderRadius: 10,
      background: config.bg, border: `1px solid ${config.border}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, background: config.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} color="white" strokeWidth={2} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: 'rgba(15,23,42,0.5)' }}>Normal: {normalRange}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'DM Mono, monospace', color: '#0f172a' }}>
          {value}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(15,23,42,0.4)' }}>{unit}</div>
      </div>
      <div style={{
        fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
        background: config.color, color: 'white',
      }}>
        {config.text}
      </div>
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

export default function Reports({ predictionData }) {
  // Determine health metrics status based on prediction data
  const healthMetrics = predictionData ? [
    {
      label: 'BMI',
      value: predictionData.bmi?.toFixed(1) || '--',
      unit: 'kg/m²',
      normalRange: '18.5-24.9',
      status: predictionData.bmi ? (
        predictionData.bmi < 18.5 ? 'warning' :
        predictionData.bmi > 25 ? 'warning' :
        predictionData.bmi > 30 ? 'danger' : 'normal'
      ) : 'normal',
      icon: Scale
    },
    {
      label: 'Blood Pressure',
      value: predictionData.blood_pressure || '--',
      unit: 'mmHg',
      normalRange: '<120/80',
      status: predictionData.blood_pressure ? (
        predictionData.blood_pressure > 140 ? 'danger' :
        predictionData.blood_pressure > 120 ? 'warning' : 'normal'
      ) : 'normal',
      icon: Heart
    },
    {
      label: 'Cholesterol',
      value: predictionData.cholesterol || '--',
      unit: 'mg/dL',
      normalRange: '<200',
      status: predictionData.cholesterol ? (
        predictionData.cholesterol > 240 ? 'danger' :
        predictionData.cholesterol > 200 ? 'warning' : 'normal'
      ) : 'normal',
      icon: Droplets
    },
    {
      label: 'Glucose',
      value: predictionData.glucose || '--',
      unit: 'mg/dL',
      normalRange: '70-99',
      status: predictionData.glucose ? (
        predictionData.glucose > 126 ? 'danger' :
        predictionData.glucose > 100 ? 'warning' :
        predictionData.glucose < 70 ? 'warning' : 'normal'
      ) : 'normal',
      icon: Wind
    },
  ] : [
    { label: 'BMI', value: '--', unit: 'kg/m²', normalRange: '18.5-24.9', status: 'normal', icon: Scale },
    { label: 'Blood Pressure', value: '--', unit: 'mmHg', normalRange: '<120/80', status: 'normal', icon: Heart },
    { label: 'Cholesterol', value: '--', unit: 'mg/dL', normalRange: '<200', status: 'normal', icon: Droplets },
    { label: 'Glucose', value: '--', unit: 'mg/dL', normalRange: '70-99', status: 'normal', icon: Wind },
  ]

  return (
    <div style={{ padding: '22px 24px 40px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>Health Reports</div>
        <div style={{ fontSize: 13, color: 'rgba(15,23,42,0.4)' }}>
          Physiological indicators vs normal ranges
        </div>
      </div>

      {/* Health Metrics Report */}
      <div style={card}>
        <div style={cardHeader}>
          <div>
            <div style={cardTitle}>Health Metrics Report</div>
            <div style={cardSub}>Physiological indicators vs normal ranges</div>
          </div>
        </div>
        <div style={{ padding: '16px 18px' }}>
          {predictionData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {healthMetrics.map((m, i) => <HealthMetric key={i} {...m} />)}
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(15,23,42,0.4)', fontSize: 14 }}>
              No prediction data available. Go to the Predict page to generate a health assessment.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
