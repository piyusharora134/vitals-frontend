import { useState } from "react"
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ShieldCheck, AlertTriangle, Heart, Activity, User, Droplets, Wind, Cigarette, Wine, Dumbbell } from 'lucide-react'

export default function PredictForm() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [values, setValues] = useState({
    age: "", gender: "1", bmi: "", blood_pressure: "", cholesterol: "",
    glucose: "", smoking_status: "0", physical_activity: "2", alcohol_intake: "0"
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: +values.age,
          gender: +values.gender,
          bmi: +values.bmi,
          blood_pressure: +values.blood_pressure,
          cholesterol: +values.cholesterol,
          glucose: +values.glucose,
          smoking_status: +values.smoking_status,
          physical_activity: +values.physical_activity,
          alcohol_intake: +values.alcohol_intake,
        })
      })

      const data = await res.json()
      setResult(data)
    } catch (err) {
      alert("Backend error. Make sure Flask is running on port 5000.")
    }
    setLoading(false)
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-ink/10 bg-white/70 backdrop-blur-sm text-ink text-sm font-light focus:outline-none focus:ring-2 focus:ring-mint-400/40 focus:border-mint-400 transition-all duration-200 placeholder:text-ink/30"
  const labelClass = "text-xs font-medium text-ink/50 uppercase tracking-wider mb-1.5 block"

  const riskStyles = {
    "Low Risk": { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: ShieldCheck, gradient: "from-emerald-500 to-teal-500" },
    "Moderate Risk": { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: AlertTriangle, gradient: "from-amber-500 to-orange-500" },
    "High Risk": { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", icon: Heart, gradient: "from-rose-500 to-red-500" },
  }

  return (
    <section id="predict" className="py-32 bg-gradient-to-b from-white via-mint-50/20 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold tracking-wide uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Risk Assessment
          </div>
          <h2 className="font-display font-800 text-4xl lg:text-5xl text-ink mb-4 tracking-tight">
            Check your{' '}
            <span className="gradient-text">health risk</span>
          </h2>
          <p className="text-ink/50 text-lg max-w-xl mx-auto font-light">
            Enter your health indicators below. Our AI ensemble analyzes lifestyle, behavioral, and physiological data for early chronic disease detection.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3 p-8 rounded-3xl border border-ink/5 bg-white shadow-sm"
          >
            <h3 className="font-display font-700 text-xl text-ink mb-6 flex items-center gap-2">
              <User size={20} className="text-mint-500" />
              Patient Information
            </h3>

            {/* Physiological indicators */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-ink/30 uppercase tracking-widest mb-3">Physiological Indicators</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Age (years)</label>
                  <input name="age" type="number" placeholder="e.g. 45" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <select name="gender" onChange={handleChange} defaultValue="1" className={inputClass}>
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>BMI (kg/m²)</label>
                  <input name="bmi" type="number" step="0.1" placeholder="e.g. 27.5" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Blood Pressure (mmHg)</label>
                  <input name="blood_pressure" type="number" placeholder="e.g. 125" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Cholesterol (mg/dL)</label>
                  <input name="cholesterol" type="number" placeholder="e.g. 200" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Glucose (mg/dL)</label>
                  <input name="glucose" type="number" placeholder="e.g. 100" onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Lifestyle & Behavioral indicators */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-ink/30 uppercase tracking-widest mb-3">Lifestyle & Behavioral Indicators</p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Smoking Status</label>
                  <select name="smoking_status" onChange={handleChange} defaultValue="0" className={inputClass}>
                    <option value="0">Non-Smoker</option>
                    <option value="1">Former Smoker</option>
                    <option value="2">Current Smoker</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Physical Activity</label>
                  <select name="physical_activity" onChange={handleChange} defaultValue="2" className={inputClass}>
                    <option value="0">Sedentary</option>
                    <option value="1">Low</option>
                    <option value="2">Moderate</option>
                    <option value="3">Active</option>
                    <option value="4">Very Active</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Alcohol Intake</label>
                  <select name="alcohol_intake" onChange={handleChange} defaultValue="0" className={inputClass}>
                    <option value="0">None</option>
                    <option value="1">Moderate</option>
                    <option value="2">High</option>
                  </select>
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(20,184,166,0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-mint-600 to-azure-600 text-white font-semibold rounded-xl shadow-lg shadow-mint-500/25 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Health Risk'}
            </motion.button>
          </motion.div>

          {/* Result Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {!result && (
              <div className="p-8 rounded-3xl border border-ink/5 bg-white shadow-sm text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-mint-100 to-azure-100 flex items-center justify-center">
                  <Activity size={24} className="text-mint-500" />
                </div>
                <h3 className="font-display font-700 text-lg text-ink mb-2">Awaiting Input</h3>
                <p className="text-sm text-ink/40 font-light">Fill in your health data and click Analyze to get your risk assessment.</p>
              </div>
            )}

            {result && (() => {
              const style = riskStyles[result.risk_level] || riskStyles["Low Risk"]
              const Icon = style.icon
              const prob = (result.probability * 100).toFixed(1)

              return (
                <>
                  {/* Risk Score Card */}
                  <div className={`p-6 rounded-3xl border-2 ${style.bg} text-center`}>
                    <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <p className={`font-display font-800 text-4xl ${style.text} mb-1`}>{prob}%</p>
                    <p className={`font-semibold text-sm ${style.text}`}>{result.risk_level}</p>
                  </div>

                  {/* Details */}
                  <div className="p-6 rounded-3xl border border-ink/5 bg-white shadow-sm space-y-4">
                    <h4 className="font-display font-700 text-sm text-ink/50 uppercase tracking-wider">Analysis Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-ink/60">Risk Probability</span>
                        <span className="font-mono text-sm font-semibold text-ink">{prob}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-ink/60">Classification</span>
                        <span className={`text-sm font-semibold ${style.text}`}>{result.classification}</span>
                      </div>
                    </div>

                    {/* Probability bar */}
                    <div className="pt-2">
                      <div className="relative h-3 bg-ink/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${prob}%` }}
                          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${style.gradient}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="p-6 rounded-3xl border border-ink/5 bg-white shadow-sm">
                    <h4 className="font-display font-700 text-sm text-ink/50 uppercase tracking-wider mb-3">Recommendation</h4>
                    <div className="space-y-3">
                      {/* Smoking recommendation */}
                      {values.smoking_status === "2" && (
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                          <Cigarette size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-700 font-light">Quitting smoking is one of the most impactful steps you can take for your health. Consider seeking support to reduce or eliminate tobacco use.</p>
                        </div>
                      )}
                      {values.smoking_status === "1" && (
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                          <Cigarette size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-orange-700 font-light">As a former smoker, maintaining your smoke-free lifestyle is crucial. Avoid relapse and continue prioritizing your respiratory health.</p>
                        </div>
                      )}

                      {/* Physical activity recommendation */}
                      {values.physical_activity === "0" && (
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                          <Dumbbell size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-700 font-light">A sedentary lifestyle significantly increases health risks. Start with light daily activities like walking or stretching.</p>
                        </div>
                      )}
                      {values.physical_activity === "1" && (
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                          <Dumbbell size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-orange-700 font-light">Your activity level is below optimal. Aim for at least 150 minutes of moderate exercise per week.</p>
                        </div>
                      )}
                      {values.physical_activity === "3" && (
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                          <Dumbbell size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-green-700 font-light">Great job staying active! Continue your current exercise routine to maintain cardiovascular health.</p>
                        </div>
                      )}
                      {values.physical_activity === "4" && (
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                          <Dumbbell size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-green-700 font-light">Excellent activity level! Your very active lifestyle is providing significant health benefits.</p>
                        </div>
                      )}

                      {/* Alcohol recommendation */}
                      {values.alcohol_intake === "2" && (
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                          <Wine size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-700 font-light">High alcohol consumption poses serious health risks. Consider reducing intake or seeking professional support.</p>
                        </div>
                      )}
                      {values.alcohol_intake === "1" && (
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                          <Wine size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-orange-700 font-light">Moderate alcohol intake may still impact health. Consider reducing consumption or maintaining within recommended limits.</p>
                        </div>
                      )}

                      {/* General risk recommendation */}
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <Heart size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700 font-light">
                          {result.risk_level === "Low Risk"
                            ? "Your overall risk profile is favorable. Continue with regular health checkups and balanced nutrition."
                            : result.risk_level === "Moderate Risk"
                            ? "Some indicators suggest moderate risk. Consider consulting a healthcare professional for a detailed assessment."
                            : "Multiple indicators suggest elevated risk. Please consult a healthcare professional promptly for comprehensive evaluation."}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )
            })()}

            {/* Disclaimer */}
            <p className="text-xs text-ink/30 text-center font-light px-4">
              This AI assessment is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}