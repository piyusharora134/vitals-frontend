const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

export async function predictRisk(payload) {
  const res = await fetch(`${BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('API error')
  return res.json()
}