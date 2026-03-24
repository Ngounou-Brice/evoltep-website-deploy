import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { useScrollAnimation, staggerContainer, fadeUp, slideLeft, slideRight } from '../hooks/useScrollAnimation';

const InputField = ({ label, name, type = 'text', value, onChange, placeholder, required }) => (
  <div>
    <label className="block font-body text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-brand-blue">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full border border-gray-200 rounded-xl px-4 py-3 font-body text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all duration-200 bg-white"
    />
  </div>
);

export default function Contact() {
  const { ref, isInView } = useScrollAnimation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production: send to API or email service
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-brand-light relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.span variants={fadeUp} className="section-label">Get In Touch</motion.span>
          <motion.h2 variants={fadeUp} className="section-title mb-4">
            Let's Build Something{' '}
            <span className="text-gradient">Amazing</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="font-body text-gray-500 text-lg max-w-xl mx-auto">
            Tell us about your project — we typically respond within 24 hours.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-5 gap-10"
        >
          {/* Contact info */}
          <motion.div variants={slideLeft} className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="font-display font-bold text-lg text-brand-dark mb-5">Contact Info</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@evoltep.com' },
                  { icon: Phone, label: 'Phone', value: '+237 6XX XXX XXX' },
                  { icon: MapPin, label: 'Location', value: 'Yaoundé, Cameroon 🇨🇲' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-brand-blue" />
                    </div>
                    <div>
                      <p className="font-body text-xs text-gray-400">{label}</p>
                      <p className="font-body text-sm font-medium text-brand-dark">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp quick contact */}
            <a
              href="https://wa.me/237600000000?text=Hi%20Evoltep!%20I%27d%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-display font-semibold px-6 py-4 rounded-xl transition-all duration-300 hover:shadow-lg w-full justify-center"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>

            {/* What to expect */}
            <div className="card p-6">
              <h4 className="font-display font-semibold text-brand-dark mb-4">What happens next?</h4>
              <div className="space-y-3">
                {[
                  'We review your project details',
                  'Schedule a free discovery call',
                  'Send you a tailored proposal',
                ].map((step, i) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-display font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="font-body text-sm text-gray-500">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={slideRight} className="lg:col-span-3">
            <div className="card p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-green-500" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-brand-dark mb-2">Message Sent!</h3>
                  <p className="font-body text-gray-500">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 btn-outline text-sm"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <InputField
                      label="Full Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                  <InputField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+237 600 000 000"
                  />
                  <div>
                    <label className="block font-body text-sm font-medium text-gray-700 mb-2">
                      Project Description <span className="text-brand-blue">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us about your project — what you're building, your timeline, budget range, and any specific requirements..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 font-body text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all duration-200 bg-white resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
                  >
                    Start My Project
                    <Send size={18} />
                  </button>
                  <p className="font-body text-xs text-gray-400 text-center">
                    No spam, ever. We take your privacy seriously.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
