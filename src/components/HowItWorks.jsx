import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ClipboardList, Cpu, TrendingUp, Heart } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Enter Health Data',
    description: 'Input your physiological, lifestyle, and behavioral indicators — age, BMI, blood pressure, glucose, cholesterol, smoking, and activity levels.',
    color: 'from-mint-500 to-teal-600',
    light: 'bg-mint-50',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'AI Analysis',
    description: 'Our 4-model ensemble (XGBoost, RF, GB, LR) processes your data through parallel classifiers for early risk detection.',
    color: 'from-azure-500 to-blue-600',
    light: 'bg-azure-50',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Risk Prediction',
    description: 'Receive a calibrated risk score with early warning classification — detect chronic disease risk before symptoms appear.',
    color: 'from-violet-500 to-purple-600',
    light: 'bg-violet-50',
  },
  {
    number: '04',
    icon: Heart,
    title: 'Recommendations',
    description: 'Get personalized preventive recommendations to intervene early and prevent severe chronic disease deterioration.',
    color: 'from-rose-500 to-pink-600',
    light: 'bg-rose-50',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="how-it-works" className="py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-ink" />
      <div className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(at 20% 50%, rgba(20,184,166,0.15) 0px, transparent 60%), radial-gradient(at 80% 20%, rgba(59,130,246,0.12) 0px, transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-mint-300 text-xs font-semibold tracking-wide uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-pulse" />
            The Process
          </div>
          <h2 className="font-display font-800 text-4xl lg:text-5xl text-white mb-4 tracking-tight">
            From data to{' '}
            <span className="gradient-text-warm">diagnosis</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto font-light">
            Four steps. Under a second. Clinical-grade results.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full bg-gradient-to-r from-mint-500/0 via-mint-500/40 to-azure-500/0 origin-left"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.15 * i + 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative group"
                >
                  {/* Step number */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={20} className="text-white" />
                  </div>

                  <motion.div
                    whileHover={{ y: -4 }}
                    className="glass-dark rounded-2xl p-6 text-center relative overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500`} />
                    
                    <span className="font-mono text-xs text-white/20 font-medium tracking-widest">{step.number}</span>
                    <h3 className="font-display font-700 text-lg text-white mt-2 mb-3">{step.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed font-light">{step.description}</p>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
