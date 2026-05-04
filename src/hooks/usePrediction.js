import { useState } from 'react'
import { predictRisk } from '../services/api'

export function usePrediction() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function predict(formValues, callback) {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await predictRisk(formValues)
      setResult(data)
      if (callback) callback(data)
    } catch {
      setError('Backend not reachable. Start Flask with: python app.py')
    } finally {
      setLoading(false)
    }
  }

  return { result, loading, error, predict }
}