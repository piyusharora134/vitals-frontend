import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, ShieldCheck, Zap, Brain } from 'lucide-react'

function FloatingOrb({ className, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

function PulsingRing({ size, delay }) {
  return (
    <motion.div
      className="absolute rounded-full border border-mint-400/30"
      style={{ width: size, height: size }}
      animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  )
}

function HealthCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl shadow-mint-500/10"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={16} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-ink/50 font-medium">{label}</p>
        <p className="text-sm font-semibold text-ink font-mono">{value}</p>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh"
      style={{ background: 'radial-gradient(at 30% 20%, rgba(20,184,166,0.12) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(59,130,246,0.1) 0px, transparent 50%), radial-gradient(at 10% 80%, rgba(99,102,241,0.08) 0px, transparent 50%), #fafaf7' }}
    >
      {/* Background orbs */}
      <FloatingOrb className="w-96 h-96 bg-mint-300 top-20 -left-32" delay={0} />
      <FloatingOrb className="w-80 h-80 bg-azure-300 top-40 right-0" delay={2} />
      <FloatingOrb className="w-64 h-64 bg-indigo-300 bottom-20 left-1/3" delay={4} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(10,14,26,1) 1px, transparent 1px), linear-gradient(90deg, rgba(10,14,26,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-16 items-center"
      >
        {/* Left: Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint-50 border border-mint-200 text-mint-700 text-xs font-semibold tracking-wide uppercase mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-mint-500 animate-pulse" />
            Clinical AI · v2.0 · Research Grade
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-800 text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-ink mb-6"
          >
            AI-Powered{' '}
            <span className="gradient-text">Health Risk</span>{' '}
            Detection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-lg text-ink/60 leading-relaxed max-w-lg mb-10 font-light"
          >
            Detect chronic disease risk early — before symptoms appear. 
            Our AI analyzes lifestyle, behavioral, and physiological indicators to warn you before severe deterioration occurs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4"
          >
            <motion.a
              href="#predict"
              whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(20,184,166,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2.5 px-7 py-4 bg-gradient-to-r from-mint-600 to-azure-600 text-white font-semibold rounded-full shadow-lg shadow-mint-500/25 text-sm"
            >
              Check Your Risk
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={16} />
              </motion.span>
            </motion.a>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink transition-colors"
            >
              See how it works
              <span className="text-mint-500">↓</span>
            </a>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-6 mt-10 pt-10 border-t border-ink/8"
          >
            {[
              { label: 'Model Accuracy', value: '~83%' },
              { label: 'ROC-AUC Score', value: '0.92' },
              { label: 'Datasets Used', value: '6' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display font-700 text-2xl text-ink">{stat.value}</p>
                <p className="text-xs text-ink/50 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Illustration */}
        <div className="relative flex items-center justify-center">
          {/* Central orb */}
          <div className="relative">
            {/* Pulsing rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <PulsingRing size={280} delay={0} />
              <PulsingRing size={280} delay={1} />
              <PulsingRing size={280} delay={2} />
            </div>

            {/* Main circle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="w-64 h-64 rounded-full border border-dashed border-mint-300/40"
            />

            {/* Inner glass card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-8 glass rounded-full flex items-center justify-center shadow-2xl shadow-mint-500/20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-mint-500 to-azure-500 flex items-center justify-center shadow-lg"
                >
                  <Brain size={28} className="text-white" />
                </motion.div>
                <p className="font-display font-700 text-2xl gradient-text">AI</p>
                <p className="text-xs text-ink/50">Health Engine</p>
              </div>
            </motion.div>

            {/* Orbiting dots */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.div
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#14b8a6' : '#3b82f6',
                  top: `${50 - 48 * Math.cos((deg * Math.PI) / 180)}%`,
                  left: `${50 + 48 * Math.sin((deg * Math.PI) / 180)}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
          </div>

          {/* Floating metric cards */}
          <div className="absolute -left-8 top-8">
            <HealthCard icon={ShieldCheck} label="Risk Level" value="Low Risk" color="bg-gradient-to-br from-mint-500 to-mint-600" delay={0.7} />
          </div>
          <div className="absolute -right-8 top-24">
            <HealthCard icon={Zap} label="Analysis Time" value="< 100ms" color="bg-gradient-to-br from-azure-500 to-azure-600" delay={0.9} />
          </div>
          <div className="absolute -left-4 bottom-16">
            <HealthCard icon={Brain} label="Confidence" value="87.3%" color="bg-gradient-to-br from-violet-500 to-purple-600" delay={1.1} />
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-ink/30 font-medium tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-ink/20 to-transparent"
        />
      </motion.div>
    </section>
  )
}
