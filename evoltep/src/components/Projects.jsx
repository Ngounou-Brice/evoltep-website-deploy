import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { useScrollAnimation, staggerContainer, fadeUp, scaleIn } from '../hooks/useScrollAnimation';
import axios from 'axios';
import { API_BASE, getImageUrl } from '../utils/api';

// Project Card
const ProjectCard = ({ project, onClick }) => (
  <motion.div
    variants={scaleIn}
    whileHover={{ y: -6 }}
    onClick={() => onClick(project)}
    className="group cursor-pointer card overflow-hidden"
  >
    {/* Image area */}
    <div className="relative h-52 flex items-center justify-center overflow-hidden rounded-xl">
      <img
        src={getImageUrl(project.image)}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex items-center gap-2 text-white font-display font-semibold">
          View Project <ArrowUpRight size={18} />
        </div>
      </div>

      {/* Year badge */}
      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-body px-2 py-1 rounded-full">
        {project.year}
      </div>
    </div>

    {/* Content */}
    <div className="p-5">
      <span className="section-label text-xs">{project.category}</span>
      <h3 className="font-display font-bold text-lg text-brand-dark mb-2">{project.title}</h3>
      <p className="font-body text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline flex items-center gap-2 text-sm w-full justify-center"
        >
          Open Project <ArrowUpRight size={16} />
        </a>
      )}
    </div>
  </motion.div>
);

// Modal for project details
const ProjectModal = ({ project, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      transition={{ type: 'spring', damping: 25 }}
      className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative h-56">
        <img
          src={getImageUrl(project.image)}
          alt={project.title}
          className="w-full h-full object-cover rounded-t-3xl"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-8">
        <span className="section-label">{project.category}</span>
        <h2 className="font-display font-bold text-2xl text-brand-dark mb-3">{project.title}</h2>
        <p className="font-body text-gray-500 mb-6 leading-relaxed">{project.description}</p>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Visit Project <ArrowUpRight size={16} />
          </a>
        )}
      </div>
    </motion.div>
  </motion.div>
);

// Main Projects Section
export default function Projects() {
  const { ref, isInView } = useScrollAnimation();
  const [selected, setSelected] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE}/data`);
        setProjects(data.projects || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects. Using fallback data.");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="text-center py-12">Loading projects...</p>;

  return (
    <section id="projects" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.span variants={fadeUp} className="section-label">Portfolio</motion.span>
          <motion.h2 variants={fadeUp} className="section-title mb-4">Our Work</motion.h2>
          <motion.p variants={fadeUp} className="font-body text-gray-500 text-lg max-w-xl mx-auto">
            A selection of projects we've built for clients across Africa and beyond.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={setSelected} />
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mt-12"
        >
          <button className="btn-outline">View All Projects</button>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}