import { useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { services } from '../data/services';
import { useCursor } from '../components/CursorContext';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const aiGeneratedImages = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1000&auto=format&fit=crop",
];

export default function ServicesSection() {
  const { setLabel } = useCursor();
  const [active, setActive] = useState(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 26, stiffness: 260, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 26, stiffness: 260, mass: 0.5 });

  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - bounds.left);
    mouseY.set(e.clientY - bounds.top);
  };

  return (
    <section className="relative bg-paper py-28 text-ink md:py-40 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-16">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
          className="mb-12 text-[11px] uppercase tracking-[0.35em] text-graphite/70"
        >
          03 — Services
        </motion.p>

        {/* Grille 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">

          {/* Colonne de gauche : Titre Expertise avec le logo en arrière-plan */}
          <div className="lg:col-span-5 relative py-8 md:py-0">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[41%] lg:translate-y-[-50%] lg:-translate-x-[61%] w-[380px] h-[380px] sm:w-[450px] sm:h-[450px] md:w-[540px] md:h-[540px] pointer-events-none opacity-[0.07] select-none z-0 flex items-center justify-center">
              <img
                src="/logo/logo-mark-dark.png"
                alt="Background Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeUp}
              className="relative z-10 text-6xl sm:text-7xl md:text-8xl font-normal tracking-tight text-ink"
            >
              Expertise
            </motion.h2>
          </div>

          {/* Colonne de droite : Liste des services */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              setActive(null);
              setLabel(null);
            }}
            className="lg:col-span-7 border-t border-ink/10 relative"
          >
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeUp}
                custom={i}
                onMouseEnter={() => {
                  setActive(i);
                  setLabel('VOIR');
                }}
                onClick={() => setActive(active === i ? null : i)}
                className="group relative flex flex-col cursor-pointer md:cursor-default border-b border-ink/10 py-6 md:py-10 transition-colors duration-500"
              >
                {/* Ligne principale du service */}
                <div className="flex items-center justify-between gap-6 w-full">
                  <div className="flex items-baseline gap-6 md:gap-10">
                    <span className="text-xs text-graphite/40 md:text-sm">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className={`font-display text-3xl italic leading-none transition-opacity duration-500 sm:text-4xl md:text-5xl ${
                        active === null || active === i
                          ? 'opacity-100'
                          : 'opacity-30'
                      }`}
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* Description sur desktop uniquement (alignée à droite) */}
                  <p
                    className={`hidden max-w-xs text-right text-sm leading-relaxed text-graphite transition-opacity duration-500 md:block ${
                      active === i ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {service.description}
                  </p>
                </div>

                {/* Bloc image + description sous l'élément cliqué sur MOBILE */}
                <AnimatePresence>
                  {active === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden md:hidden"
                    >
                      <div className="h-60 w-full overflow-hidden rounded-sm shadow-md mb-4">
                        <img
                          src={aiGeneratedImages[i % aiGeneratedImages.length]}
                          alt={service.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-sm leading-relaxed text-graphite">
                        {service.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Floating preview image — desktop uniquement, suit le curseur */}
            {active !== null && (
              <motion.div
                style={{ x: springX, y: springY }}
                className="pointer-events-none absolute left-0 top-0 z-30 hidden h-64 w-48 -translate-x-1/2 -translate-y-1/2 overflow-hidden md:block shadow-2xl rounded-sm"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full w-full"
                  >
                    <img
                      src={aiGeneratedImages[active % aiGeneratedImages.length]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}