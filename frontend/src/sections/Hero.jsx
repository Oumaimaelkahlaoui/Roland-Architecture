import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import WorldClock from '../components/WorldClock';

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.5 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  const videoRef = useRef(null);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-ink">
      {/* Vidéo d'arrière-plan
          Mobile : object-[60%_50%] → change le 60% pour décaler le cadrage
          (0% = gauche, 50% = centre, 100% = droite) */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-[60%_50%] md:object-center [filter:grayscale(1)_contrast(1.05)_brightness(0.95)]"
        src="/videos/hero-reel-fixed.mp4"
        poster="/videos/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Voile — dégradé en 4 paliers */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.05)_30%,rgba(0,0,0,0.05)_62%,rgba(0,0,0,0.6)_100%)]" />

      {/* Bloc principal */}
      <motion.div
        variants={reduceMotion ? {} : container}
        initial={reduceMotion ? 'visible' : 'hidden'}
        animate="visible"
        className="absolute bottom-24 left-6 right-6 md:bottom-16 md:left-16 md:right-16"
      >
        <motion.h1
          variants={reduceMotion ? {} : item}
          className="font-display text-[13vw] uppercase leading-[0.88] tracking-tight text-paper sm:text-[11vw] md:text-[7.5vw]"
        >
          Architecture
        </motion.h1>

        <motion.h1
          variants={reduceMotion ? {} : item}
          className="font-display text-[13vw] uppercase leading-[0.88] tracking-tight text-paper sm:text-[11vw] md:text-[7.5vw]"
        >
          Design intérieur.
        </motion.h1>

        <motion.p
          variants={reduceMotion ? {} : item}
          className="mt-6 max-w-md text-sm leading-relaxed text-paper/60"
        >
          Un studio qui conçoit des espaces épurés et guidés par la matière,
          où l’architecture et l’intérieur ne forment qu’une seule et même idée.
        </motion.p>

        <motion.a
          variants={reduceMotion ? {} : item}
          href="/projects"
          className="group mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-paper"
        >
          <span className="relative pb-1">
            Voir les projets
            <span className="absolute -bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-paper transition-transform duration-500 ease-editorial group-hover:scale-x-100" />
          </span>

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </motion.a>
      </motion.div>

      {/* Horloge + indication de défilement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10 right-6 flex flex-col items-end gap-6 md:right-16"
      >
        <WorldClock />

        {/* Masqué sur mobile pour éviter le chevauchement */}
        <div className="hidden md:flex flex-col items-center gap-2.5 text-[15px] tracking-[0.08em] text-paper">
          {!reduceMotion && (
            <motion.span
              className="w-px bg-paper/50"
              style={{ height: 46, transformOrigin: 'top' }}
              animate={{ scaleY: [0, 1, 0], opacity: [1, 1, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.4, 1],
              }}
            />
          )}

          <span className="text-[10px] uppercase tracking-[0.3em] text-paper/60">
            Défiler
          </span>
        </div>
      </motion.div>
    </section>
  );
}