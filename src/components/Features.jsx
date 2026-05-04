import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Zap, Database, BarChart3, Lightbulb } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Real-time Prediction',
    description: 'Sub-100ms inference latency with our optimized ML pipeline. Get instant risk assessments without any waiting.',
    accent: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-500/20',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: Database,
    title: 'Multi-Dataset Intelligence',
    description: 'Trained across 6 real-world datasets (Heart Disease, Diabetes, Stroke, NHANES, Cardiovascular, and Behavioral) for comprehensive coverage.',
    accent: 'from-mint-400 to-teal-600',
    glow: 'shadow-mint-500/20',
    bg: 'bg-mint-50',
    border: 'border-mint-100',
  },
  {
    icon: BarChart3,
    title: 'AI Risk Scoring',
    description: 'Ensemble of XGBoost, Random Forest, Gradient Boosting, and Logistic Regression delivering calibrated probability scores.',
    accent: 'from-azure-400 to-blue-600',
    glow: 'shadow-azure-500/20',
    bg: 'bg-azure-50',
    border: 'border-azure-100',
  },
  {
    icon: Lightbulb,
    title: 'Preventive Insights',
    description: 'Actionable, personalized recommendations based on your risk profile to help you take control of your health.',
    accent: 'from-violet-400 to-purple-600',
    glow: 'shadow-violet-500/20',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
]

function FeatureCard({ feature, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className={`group relative p-8 rounded-3xl border ${feature.border} bg-white/70 backdrop-blur-sm shadow-xl ${feature.glow} cursor-default overflow-hidden`}
    >
      {/* Background hover gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}
      />

      {/* Corner accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.accent} opacity-5 rounded-bl-full`} />

      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={22} className="text-white" />
      </div>

      <h3 className="font-display font-700 text-xl text-ink mb-3 group-hover:gradient-text transition-all duration-300">
        {feature.title}
      </h3>
      <p className="text-ink/55 leading-relaxed text-sm font-light">
        {feature.description}
      </p>

      {/* Bottom line accent */}
      <motion.div
        className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r ${feature.accent} opacity-0 group-hover:opacity-60 transition-opacity duration-500`}
      />
    </motion.div>
  )
}

export default function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="features" className="py-32 relative overflow-hidden bg-gradient-to-b from-white/0 via-mint-50/30 to-white/0">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-azure-50 border border-azure-100 text-azure-600 text-xs font-semibold tracking-wide uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-azure-500" />
            Core Capabilities
          </div>
          <h2 className="font-display font-800 text-4xl lg:text-5xl text-ink mb-4 tracking-tight">
            Everything you need to{' '}
            <span className="gradient-text">predict risk</span>
          </h2>
          <p className="text-ink/50 text-lg max-w-xl mx-auto font-light">
            Four pillars of clinical intelligence working together for accurate, actionable health insights.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
