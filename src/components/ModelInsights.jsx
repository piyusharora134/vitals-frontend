import { motion, useInView, useAnimation } from 'framer-motion'
import { useRef, useEffect } from 'react'

const metrics = [
  { label: 'Model Accuracy', value: 83, suffix: '%', color: 'from-mint-500 to-teal-500', description: 'Ensemble on held-out test set' },
  { label: 'ROC-AUC Score', value: 92, suffix: '%', color: 'from-azure-500 to-blue-500', description: 'Area under ROC curve' },
  { label: 'Sensitivity (Recall)', value: 87, suffix: '%', color: 'from-violet-500 to-purple-500', description: 'True positive rate' },
  { label: 'Specificity', value: 80, suffix: '%', color: 'from-amber-500 to-orange-500', description: 'True negative rate' },
]

const models = [
  { name: 'XGBoost', contribution: 38, color: 'bg-mint-500' },
  { name: 'Random Forest', contribution: 25, color: 'bg-azure-500' },
  { name: 'Gradient Boosting', contribution: 22, color: 'bg-violet-500' },
  { name: 'Logistic Regression', contribution: 15, color: 'bg-amber-500' },
]

function AnimatedBar({ value, color, inView, delay }) {
  return (
    <div className="relative h-2.5 bg-ink/5 rounded-full overflow-hidden">
      <motion.div
        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color}`}
        initial={{ width: 0 }}
        animate={inView ? { width: `${value}%` } : { width: 0 }}
        transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

function AnimatedNumber({ value, inView, delay }) {
  const controls = useAnimation()
  const ref = useRef(null)

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        transition: { duration: 0.5, delay },
      })
    }
  }, [inView])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {value}
    </motion.span>
  )
}

export default function ModelInsights() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="model" className="py-32 bg-gradient-to-b from-white via-mint-50/20 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold tracking-wide uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Model Performance
          </div>
          <h2 className="font-display font-800 text-4xl lg:text-5xl text-ink mb-4 tracking-tight">
            Transparent{' '}
            <span className="gradient-text">model metrics</span>
          </h2>
          <p className="text-ink/50 text-lg max-w-xl mx-auto font-light">
            We believe in explainability. Here's exactly how our ensemble performs.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Metric cards */}
          <div className="space-y-5">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="p-6 rounded-2xl border border-ink/5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 group"
              >
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-ink/60 mb-0.5">{metric.label}</p>
                    <p className="text-xs text-ink/30">{metric.description}</p>
                  </div>
                  <div className="font-display font-800 text-3xl text-ink">
                    <AnimatedNumber value={metric.value} inView={inView} delay={i * 0.1 + 0.3} />
                    <span className="text-lg text-ink/40">{metric.suffix}</span>
                  </div>
                </div>
                <AnimatedBar value={metric.value} color={metric.color} inView={inView} delay={i * 0.1 + 0.2} />
              </motion.div>
            ))}
          </div>

          {/* Ensemble breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 rounded-3xl border border-ink/5 bg-white shadow-sm"
          >
            <h3 className="font-display font-700 text-xl text-ink mb-2">Ensemble Composition</h3>
            <p className="text-sm text-ink/40 mb-8 font-light">Weighted contribution of each model in the final prediction</p>

            {/* Donut chart simulation */}
            <div className="relative w-48 h-48 mx-auto mb-10">
              <svg viewBox="0 0 160 160" className="transform -rotate-90">
                {models.reduce((acc, model, i) => {
                  const prev = acc.offset
                  const strokeDash = (model.contribution / 100) * 440
                  const gap = 4
                  acc.elements.push(
                    <motion.circle
                      key={model.name}
                      cx="80" cy="80" r="70"
                      fill="none"
                      stroke={['#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b'][i]}
                      strokeWidth="18"
                      strokeDasharray={`${strokeDash - gap} ${440 - strokeDash + gap}`}
                      strokeDashoffset={-prev}
                      strokeLinecap="round"
                      initial={{ strokeDasharray: `0 440` }}
                      animate={inView ? { strokeDasharray: `${strokeDash - gap} ${440 - strokeDash + gap}` } : {}}
                      transition={{ duration: 1.2, delay: i * 0.2 + 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )
                  acc.offset = prev + strokeDash
                  return acc
                }, { elements: [], offset: 0 }).elements}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-display font-800 text-2xl text-ink">4</p>
                <p className="text-xs text-ink/40">Models</p>
              </div>
            </div>

            <div className="space-y-4">
              {models.map((model, i) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 + 0.8 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${model.color}`} />
                    <span className="text-sm text-ink/70 font-medium">{model.name}</span>
                  </div>
                  <span className="font-mono text-sm text-ink font-medium">{model.contribution}%</span>
                </motion.div>
              ))}
            </div>

            {/* Dataset badge */}
            <div className="mt-8 pt-6 border-t border-ink/5">
              <p className="text-xs text-ink/30 font-medium mb-3 uppercase tracking-widest">Training Datasets</p>
              <div className="flex flex-wrap gap-2">
                {['Heart Disease UCI', 'PIMA Diabetes', 'Stroke', 'NHANES', 'Cardiovascular'].map((ds) => (
                  <span key={ds} className="px-3 py-1.5 rounded-full bg-mint-50 border border-mint-100 text-mint-700 text-xs font-medium">
                    {ds}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
