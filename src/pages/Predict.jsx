import { useState } from 'react'
import { usePrediction } from '../hooks/usePrediction'

// ── Form Field ─────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        color: 'rgba(15,23,42,0.4)', marginBottom: 5,
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '9px 12px',
  background: '#f8fafc', border: '1px solid rgba(15,23,42,0.1)',
  borderRadius: 8, fontFamily: 'DM Sans, sans-serif',
  fontSize: 13, color: '#0f172a', outline: 'none', transition: 'border-color 0.15s',
}

function Input({ id, type = 'number', placeholder, ...rest }) {
  return (
    <input
      id={id} type={type} placeholder={placeholder} {...rest}
      style={inputStyle}
      onFocus={e => { e.target.style.borderColor = '#0fa88a'; e.target.style.background = '#e6f7f4' }}
      onBlur={e => { e.target.style.borderColor = 'rgba(15,23,42,0.1)'; e.target.style.background = '#f8fafc' }}
    />
  )
}

function Select({ id, options, defaultValue }) {
  return (
    <select
      id={id} defaultValue={defaultValue}
      style={inputStyle}
      onFocus={e => { e.target.style.borderColor = '#0fa88a'; e.target.style.background = '#e6f7f4' }}
      onBlur={e => { e.target.style.borderColor = 'rgba(15,23,42,0.1)'; e.target.style.background = '#f8fafc' }}
    >
      {options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
    </select>
  )
}

// ── Result Card ────────────────────────────────────────────────────────────────
const riskConfig = {
  'Low Risk':      { bg: '#f0fdf4', border: '#bbf7d0', text: '#065f46', bar: '#0fa88a', icon: '✅' },
  'Moderate Risk': { bg: '#fffbeb', border: '#fde68a', text: '#92400e', bar: '#d97706', icon: '⚠️' },
  'High Risk':     { bg: '#fff1f2', border: '#fecdd3', text: '#9f1239', bar: '#e11d48', icon: '🔴' },
}

function ResultCard({ result, inputData }) {
  const pct = (result.probability * 100).toFixed(1)
  const s = riskConfig[result.risk_level] || riskConfig['Low Risk']

  // Behavioral recommendations
  const recommendations = []

  if (inputData.smoking_status === 2) {
    recommendations.push({
      type: 'smoking',
      color: '#e11d48',
      bg: '#fff1f2',
      border: '#fecdd3',
      text: 'Quitting smoking is one of the most impactful steps you can take for your health. Consider seeking support to reduce or eliminate tobacco use.'
    })
  } else if (inputData.smoking_status === 1) {
    recommendations.push({
      type: 'smoking',
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      text: 'As a former smoker, maintaining your smoke-free lifestyle is crucial. Avoid relapse and continue prioritizing your respiratory health.'
    })
  }

  if (inputData.physical_activity === 0) {
    recommendations.push({
      type: 'activity',
      color: '#e11d48',
      bg: '#fff1f2',
      border: '#fecdd3',
      text: 'A sedentary lifestyle significantly increases health risks. Start with light daily activities like walking or stretching.'
    })
  } else if (inputData.physical_activity === 1) {
    recommendations.push({
      type: 'activity',
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      text: 'Your activity level is below optimal. Aim for at least 150 minutes of moderate exercise per week.'
    })
  } else if (inputData.physical_activity === 3) {
    recommendations.push({
      type: 'activity',
      color: '#059669',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      text: 'Great job staying active! Continue your current exercise routine to maintain cardiovascular health.'
    })
  } else if (inputData.physical_activity === 4) {
    recommendations.push({
      type: 'activity',
      color: '#059669',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      text: 'Excellent activity level! Your very active lifestyle is providing significant health benefits.'
    })
  }

  if (inputData.alcohol_intake === 2) {
    recommendations.push({
      type: 'alcohol',
      color: '#e11d48',
      bg: '#fff1f2',
      border: '#fecdd3',
      text: 'High alcohol consumption poses serious health risks. Consider reducing intake or seeking professional support.'
    })
  } else if (inputData.alcohol_intake === 1) {
    recommendations.push({
      type: 'alcohol',
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      text: 'Moderate alcohol intake may still impact health. Consider reducing consumption or maintaining within recommended limits.'
    })
  }

  // General risk recommendation
  const generalRec = result.risk_level === 'Low Risk'
    ? 'Your overall risk profile is favorable. Continue with regular health checkups and balanced nutrition.'
    : result.risk_level === 'Moderate Risk'
    ? 'Some indicators suggest moderate risk. Consider consulting a healthcare professional for a detailed assessment.'
    : 'Multiple indicators suggest elevated risk. Please consult a healthcare professional promptly for comprehensive evaluation.'

  return (
    <div style={{
      marginTop: 14, padding: '14px 16px', borderRadius: 12,
      background: s.bg, border: `1px solid ${s.border}`,
      animation: 'fadeSlide 0.4s ease',
    }}>
      <style>{`@keyframes fadeSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'DM Mono, monospace', letterSpacing: '-0.5px', color: s.text }}>
            {pct}%
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: s.text, marginTop: 2 }}>{result.risk_level}</div>
        </div>
        <span style={{ fontSize: 28 }}>{s.icon}</span>
      </div>

      {/* Bar */}
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 3, background: s.bar,
          width: pct + '%', transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)',
        }} />
      </div>

      {/* Behavioral recommendations */}
      {recommendations.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recommendations.map((rec, i) => (
            <div key={i} style={{
              padding: '8px 10px', borderRadius: 8,
              background: rec.bg, border: `1px solid ${rec.border}`,
              fontSize: 11, lineHeight: 1.5, color: rec.color,
            }}>
              {rec.text}
            </div>
          ))}
        </div>
      )}

      {/* General recommendation */}
      <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.6, color: s.text, opacity: 0.85 }}>
        {generalRec}
      </div>
    </div>
  )
}

function ErrorCard({ message }) {
  return (
    <div style={{
      marginTop: 14, padding: '14px 16px', borderRadius: 12,
      background: '#f8fafc', border: '1px dashed rgba(15,23,42,0.2)',
    }}>
      <div style={{ fontSize: 13, color: '#94a3b8' }}>🔌 {message}</div>
    </div>
  )
}

// ── How It Works ───────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { emoji: '🧬', title: 'Feature Engineering', color: '#0fa88a', bg: '#e6f7f4', desc: '22 derived features from 9 raw inputs using clinical domain knowledge' },
    { emoji: '⚡', title: 'Ensemble Prediction',  color: '#2563eb', bg: '#eff6ff', desc: 'XGBoost + RF + GBM + LogReg voted with calibrated probabilities' },
    { emoji: '🎯', title: 'Risk Stratification',  color: '#7c3aed', bg: '#f5f3ff', desc: 'Threshold-tuned for clinical sensitivity across 3 risk tiers' },
  ]
  return (
    <div style={card}>
      <div style={cardHeader}>
        <div style={cardTitle}>How It Works</div>
      </div>
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {steps.map(s => (
            <div key={s.title} style={{ padding: '12px', background: s.bg, borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: s.color, marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: 'rgba(15,23,42,0.6)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 12, padding: '10px 12px', background: '#f8fafc',
          borderRadius: 8, border: '1px solid rgba(15,23,42,0.08)',
          fontSize: 11, color: 'rgba(15,23,42,0.4)', lineHeight: 1.5,
        }}>
          ⚠ This AI assessment is for educational/research purposes only and does not constitute medical advice.
          Always consult a qualified healthcare professional for diagnosis and treatment.
        </div>
      </div>
    </div>
  )
}

// ── Main Predict Page ──────────────────────────────────────────────────────────
export default function Predict({ setPredictionData }) {
  const { result, loading, error, predict } = usePrediction()
  const [inputData, setInputData] = useState(null)

  function getVal(id) { return document.getElementById(id)?.value }

  function handlePredict() {
    const age = +getVal('f-age'), bmi = +getVal('f-bmi'), bp = +getVal('f-bp')
    if (!age || !bmi || !bp) { alert('Please fill in Age, BMI, and Blood Pressure.'); return }

    const data = {
      age, bmi,
      gender: +getVal('f-gender'),
      blood_pressure: bp,
      cholesterol: +getVal('f-chol') || 200,
      glucose: +getVal('f-gluc') || 100,
      smoking_status: +getVal('f-smoke'),
      physical_activity: +getVal('f-act'),
      alcohol_intake: +getVal('f-alc'),
    }

    setInputData(data)

    predict(data, (result) => {
      // Pass prediction data to Dashboard
      setPredictionData({ ...data, ...result })

      // Save to localStorage for history & trend tracking
      try {
        const history = JSON.parse(localStorage.getItem('vitals_history') || '[]')
        history.push({
          id: Date.now(),
          timestamp: new Date().toISOString(),
          input: data,
          result: result,
        })
        // Keep last 50 entries
        if (history.length > 50) history.splice(0, history.length - 50)
        localStorage.setItem('vitals_history', JSON.stringify(history))
      } catch (e) {
        console.error('Failed to save prediction history:', e)
      }
    })
  }

  return (
    <div style={{ padding: '22px 24px 40px', maxWidth: 820 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>AI Risk Assessment</div>
        <div style={{ fontSize: 13, color: 'rgba(15,23,42,0.4)' }}>
          Enter patient vitals — our ensemble model analyzes risk in real-time
        </div>
      </div>

      {/* Form Card */}
      <div style={{ ...card, marginBottom: 14 }}>
        <div style={{ ...cardHeader, alignItems: 'center' }}>
          <div>
            <div style={cardTitle}>Patient Information</div>
            <div style={cardSub}>Physiological &amp; lifestyle indicators</div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#e6f7f4', color: '#0fa88a',
            fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 20,
          }}>
            <span style={{ width: 6, height: 6, background: '#0fa88a', borderRadius: '50%' }} />
            Flask API
          </div>
        </div>

        <div style={{ padding: '16px 18px' }}>
          <SectionLabel>Physiological Indicators</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <Field label="Age (years)">        <Input id="f-age"   placeholder="e.g. 45" /></Field>
            <Field label="Gender">             <Select id="f-gender" options={[['1','Male'],['0','Female']]} defaultValue="1" /></Field>
            <Field label="BMI (kg/m²)">        <Input id="f-bmi"   placeholder="e.g. 27.5" step="0.1" /></Field>
            <Field label="Blood Pressure (mmHg)"><Input id="f-bp"  placeholder="e.g. 125" /></Field>
            <Field label="Cholesterol (mg/dL)"><Input id="f-chol"  placeholder="e.g. 200" /></Field>
            <Field label="Glucose (mg/dL)">    <Input id="f-gluc"  placeholder="e.g. 100" /></Field>
          </div>

          <SectionLabel>Lifestyle &amp; Behavioral</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
            <Field label="Smoking Status">
              <Select id="f-smoke" defaultValue="0" options={[['0','Non-Smoker'],['1','Former Smoker'],['2','Current Smoker']]} />
            </Field>
            <Field label="Physical Activity">
              <Select id="f-act" defaultValue="2" options={[['0','Sedentary'],['1','Low'],['2','Moderate'],['3','Active'],['4','Very Active']]} />
            </Field>
            <Field label="Alcohol Intake">
              <Select id="f-alc" defaultValue="0" options={[['0','None'],['1','Moderate'],['2','High']]} />
            </Field>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            style={{
              width: '100%', padding: '11px',
              background: loading ? 'rgba(15,168,138,0.6)' : 'linear-gradient(135deg,#0fa88a,#0e9e84)',
              color: 'white', fontFamily: 'DM Sans, sans-serif',
              fontSize: 13, fontWeight: 600,
              border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.2px', transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze Health Risk'}
          </button>

          {result && !error && <ResultCard result={result} inputData={inputData} />}
          {error && <ErrorCard message={error} />}
        </div>
      </div>

      <HowItWorks />
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.06em', color: 'rgba(15,23,42,0.35)', marginBottom: 10,
    }}>
      {children}
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
