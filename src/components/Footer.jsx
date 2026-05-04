import { motion } from 'framer-motion'
import { Activity, Github, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-ink overflow-hidden py-16">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(at 50% 100%, rgba(20,184,166,0.12) 0px, transparent 60%)' }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-mint-500 to-azure-500 flex items-center justify-center">
                <Activity size={17} className="text-white" />
              </div>
              <span className="font-display font-700 text-xl text-white">
                VITALS<span className="text-mint-400">.</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed font-light max-w-xs">
              AI-Based Health Risk Detection System. Empowering preventive healthcare through intelligent clinical data analysis.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs text-white/25 uppercase tracking-widest font-semibold mb-5">Navigate</p>
            <div className="space-y-3">
              {['Features', 'How It Works', 'Model Insights', 'Predict Risk'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block text-sm text-white/50 hover:text-white transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Tech */}
          <div>
            <p className="text-xs text-white/25 uppercase tracking-widest font-semibold mb-5">Built With</p>
            <div className="flex flex-wrap gap-2">
              {['React', 'Framer Motion', 'Tailwind CSS', 'Flask', 'XGBoost', 'Scikit-learn', 'Random Forest'].map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-sm font-light">
            © 2025 VITALS · AI Health Risk Detection System
          </p>
          <p className="text-white/25 text-sm flex items-center gap-1.5 font-light">
            Built with <Heart size={12} className="text-rose-400 inline" fill="currentColor" /> for better preventive healthcare
          </p>
        </div>
      </div>
    </footer>
  )
}
