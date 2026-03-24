import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Globe, Code2 } from 'lucide-react';
import { fadeUp, staggerContainer } from '../hooks/useScrollAnimation';

const FloatingCard = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay + 0.8, duration: 0.7 }}
    className={`absolute bg-white rounded-2xl shadow-card p-3 border border-gray-100 ${className}`}
  >
    {children}
  </motion.div>
);

const DashboardMockup = () => (
  <div className="relative w-full max-w-lg mx-auto lg:mx-0">
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-brand-dark rounded-3xl p-6 shadow-2xl border border-white/10 overflow-hidden"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 via-transparent to-transparent pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-3 h-3 rounded-full bg-red-400/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
        <div className="w-3 h-3 rounded-full bg-green-400/80" />
        <div className="flex-1 ml-2 bg-white/10 rounded-md h-6 flex items-center px-3">
          <span className="text-white/40 text-xs font-mono">evoltep.app/dashboard</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Revenue', value: '$128K', trend: '+24%', color: 'text-green-400' },
          { label: 'Users', value: '14.2K', trend: '+18%', color: 'text-blue-400' },
          { label: 'Uptime', value: '99.9%', trend: 'Stable', color: 'text-cyan-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 rounded-xl p-3 border border-white/10">
            <p className="text-white/40 text-xs mb-1 font-body">{stat.label}</p>
            <p className="text-white font-display font-bold text-lg leading-none">{stat.value}</p>
            <p className={`text-xs mt-1 font-body ${stat.color}`}>{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/70 text-xs font-body">Performance Overview</span>
          <span className="text-brand-blue text-xs font-body">Last 30 days</span>
        </div>
        <div className="flex items-end gap-1 h-16">
          {[30, 55, 40, 70, 60, 85, 75, 90, 80, 95, 88, 100].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.9 + i * 0.05, duration: 0.5 }}
              className="flex-1 rounded-t-sm"
              style={{
                background: i === 11
                  ? 'linear-gradient(to top, #1B79FD, #60a5fa)'
                  : i > 7
                  ? 'rgba(27,121,253,0.5)'
                  : 'rgba(255,255,255,0.1)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Code snippet */}
      <div className="bg-black/30 rounded-xl p-3 border border-white/10 font-mono text-xs">
        <span className="text-brand-blue">const</span>
        <span className="text-white"> app </span>
        <span className="text-white/50">= </span>
        <span className="text-green-400">Evoltep</span>
        <span className="text-white/50">.</span>
        <span className="text-yellow-300">build</span>
        <span className="text-white/50">{'({'}</span>
        <span className="text-cyan-400"> fast</span>
        <span className="text-white/50">, </span>
        <span className="text-pink-400">scalable </span>
        <span className="text-white/50">{'})'};</span>
      </div>
    </motion.div>
  </div>
);

export default function Hero({ backgroundImage }) {
  const scrollToContact = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToProjects = () => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `url(logo.png)`, // Replace with your actual image path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Optional overlays or gradient */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-20 lg:pt-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 bg-white/10 text-blue-500 text-xs font-body font-semibold px-4 py-2 rounded-full border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                Let's Innovate the future together
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display font-bold text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.05] mb-6">
              We Build <span className="text-gradient">Powerful</span> Digital Solutions
            </motion.h1>

            <motion.p variants={fadeUp} className="font-body text-lg text-white/80 leading-relaxed mb-10 max-w-xl">
              Evoltep helps startups and enterprises grow with high-performance websites, scalable applications, and cutting-edge technology built to last.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-12">
              <button onClick={scrollToProjects} className="btn-primary flex items-center gap-2 text-base py-4 px-8">
                View Projects
                <ArrowRight size={18} />
              </button>
              <button onClick={scrollToContact} className="btn-outline flex items-center gap-2 text-base py-4 px-8">
                <Play size={16} className="fill-white" />
                Start a Project
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="flex gap-8">
              {[
                { value: '10+', label: 'Projects Delivered' },
                { value: '08+', label: 'Happy Clients' },
                { value: '4.5★', label: 'Average Rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display font-bold text-2xl text-white">{stat.value}</p>
                  <p className="font-body text-sm text-white/70">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Dashboard */}
          <div className="relative hidden lg:flex justify-end items-center">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}