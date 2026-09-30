import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import { useCursor } from '../components/CursorContext';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const AUTO_DELAY = 3500; // ms entre chaque projet sur mobile

export default function Projects() {
  const { setLabel } = useCursor();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  const list = projects.slice(0, 4);

  // Détection appareil tactile (pas de hover)
  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    setIsTouch(mq.matches);
    const onChange = (e) => setIsTouch(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Défilement automatique sur mobile
  // (le timer se réinitialise à chaque changement d'activeIndex, donc après un tap aussi)
  useEffect(() => {
    if (!isTouch) return;
    const t = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % list.length);
    }, AUTO_DELAY);
    return () => clearTimeout(t);
  }, [isTouch, activeIndex, list.length]);

  const current = isTouch ? activeIndex : hoveredIndex;

  return (
    <div className="bg-ink text-paper w-full min-h-screen flex flex-col justify-between overflow-hidden">

      {/* En-tête de section */}
      <div className="px-6 md:px-12 pt-16 pb-8">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
          className="text-[11px] uppercase tracking-[0.35em] text-paper/50"
        >
          02 — Projets sélectionnés
        </motion.p>
      </div>

      {/* Conteneur des 4 colonnes interactives */}
      <section className="w-full h-[70vh] md:h-[75vh] flex flex-col md:flex-row px-4 md:px-12 gap-3">
        {list.map((project, i) => {
          const isHovered = current === i;
          const isAnyHovered = current !== null;

          return (
            <motion.a
              key={project.slug}
              href={`/projects`}
              onClick={(e) => {
                // Mobile : 1er tap = sélectionner, 2e tap = ouvrir
                if (isTouch && activeIndex !== i) {
                  e.preventDefault();
                  setActiveIndex(i);
                }
              }}
              onMouseEnter={() => {
                if (isTouch) return;
                setHoveredIndex(i);
                setLabel('EXPLORER');
              }}
              onMouseLeave={() => {
                if (isTouch) return;
                setHoveredIndex(null);
                setLabel(null);
              }}
              animate={{
                flex: isAnyHovered ? (isHovered ? 2.2 : 0.9) : 1,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group relative h-full overflow-hidden rounded-md cursor-pointer flex flex-col justify-end p-6 md:p-8"
            >
              {/* Image de fond */}
              <img
                src={project.image}
                alt={project.name}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                  isHovered
                    ? 'grayscale-0 scale-105 brightness-100'
                    : 'grayscale brightness-90 scale-100'
                }`}
              />

              {/* Voile assombrissant dynamique */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isHovered
                    ? 'bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-80'
                    : 'bg-ink/40'
                }`}
              />

              {/* Informations du projet */}
              <div className="relative z-10 flex flex-col justify-end">
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-paper/70 mb-2">
                  {project.location} | {project.category}
                </span>

                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl italic leading-tight text-paper">
                  {project.name}
                </h3>
              </div>

              {/* Barre de progression (mobile uniquement) */}
              {isTouch && isHovered && (
                <motion.div
                  key={`bar-${activeIndex}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTO_DELAY / 1000, ease: 'linear' }}
                  className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-paper/80"
                />
              )}
            </motion.a>
          );
        })}
      </section>

      {/* Bouton "Voir tous les projets" en bas */}
      <div className="px-6 md:px-12 py-16 flex justify-center md:justify-end">
        <motion.a
          href="/projects"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          onMouseEnter={() => setLabel('Explorer')}
          onMouseLeave={() => setLabel(null)}
          className="group inline-flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-paper/70 hover:text-paper transition-colors duration-300"
        >
          <span>Voir tous les projets</span>

          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 group-hover:border-paper transition-colors duration-300">
            <svg
              className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </motion.a>
      </div>

    </div>
  );
}