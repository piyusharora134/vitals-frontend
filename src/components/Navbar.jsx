import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { Activity } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 40)
  })

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-sm shadow-mint-100/50' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mint-500 to-azure-500 flex items-center justify-center shadow-lg shadow-mint-500/30">
            <Activity size={16} className="text-white" />
          </div>
          <span className="font-display font-700 text-xl tracking-tight text-ink">
            VITALS<span className="text-mint-500">.</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Model', 'Predict'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium text-ink/60 hover:text-ink transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        <motion.a
          href="#predict"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-5 py-2.5 bg-ink text-cream text-sm font-medium rounded-full hover:bg-ink/80 transition-colors duration-200"
        >
          Check Your Risk
        </motion.a>
      </div>
    </motion.nav>
  )
}
