import { motion } from 'framer-motion';
import { processSteps } from '../data';
import { useScrollAnimation, staggerContainer, fadeUp } from '../hooks/useScrollAnimation';

export default function Process() {
  const { ref, isInView } = useScrollAnimation(0.05);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-brand-blue/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-20"
        >
          <motion.span variants={fadeUp} className="section-label">How We Work</motion.span>
          <motion.h2 variants={fadeUp} className="section-title mb-4">
            Our Proven{' '}
            <span className="text-gradient">Process</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="font-body text-gray-500 text-lg max-w-xl mx-auto">
            A structured approach that delivers predictable results, every time.
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — desktop */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue via-brand-blue/30 to-transparent" />

          <div className="space-y-12">
            {processSteps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 ${!isEven ? 'lg:flex-row-reverse' : ''}`}
                >
                  {/* Card */}
                  <div className={`flex-1 ${isEven ? 'lg:text-right lg:pr-12' : 'lg:pl-12'}`}>
                    <div className={`card p-6 inline-block w-full group hover:shadow-card-hover transition-all duration-300 ${isEven ? 'lg:ml-auto' : ''}`}>
                      <div className={`flex items-center gap-3 mb-3 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                        <span className="font-display font-bold text-4xl text-brand-blue/20">{step.step}</span>
                        <h3 className="font-display font-bold text-lg text-brand-dark">{step.title}</h3>
                      </div>
                      <p className="font-body text-gray-500 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-brand-blue shadow-glow flex items-center justify-center">
                    <span className="text-white font-display font-bold text-xs">{step.step}</span>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
