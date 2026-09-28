import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function TriptychReveal({ project }) {
  const wrapperRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  // Different ranges + different end values = different speeds/timing per panel.
  const leftX = useTransform(scrollYProgress, [0.08, 1], ['0%', '-95%']);
  const rightX = useTransform(scrollYProgress, [0, 0.85], ['0%', '95%']);
  const centerY = useTransform(scrollYProgress, [0.15, 0.9], ['0%', '-22%']);

  const contentOpacity = useTransform(scrollYProgress, [0.65, 0.88], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.65, 0.9], [20, 0]);

  const sharedImageStyle = {
    backgroundImage: `url(${project.image})`,
    backgroundSize: '300% 100%',
  };

  return (
    // Full-bleed breakout — le viewport padding du conteneur parent
    // (max-w-[1600px] px-6/16) est neutralisé pour que les 3 panneaux
    // couvrent tout l'écran, comme un Hero.
    <div className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] overflow-x-hidden">
      <div ref={wrapperRef} className="relative h-[280vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-paper">
          <div className="absolute inset-0 flex">
            <motion.div
              style={{
                x: leftX,
                ...sharedImageStyle,
                backgroundPosition: '0% center',
              }}
              className="h-full w-1/3 bg-graphite/40 [filter:grayscale(1)_contrast(1.05)]"
            />
            <motion.div
              style={{
                y: centerY,
                ...sharedImageStyle,
                backgroundPosition: '50% center',
              }}
              className="h-full w-1/3 bg-graphite/40 [filter:grayscale(1)_contrast(1.05)]"
            />
            <motion.div
              style={{
                x: rightX,
                ...sharedImageStyle,
                backgroundPosition: '100% center',
              }}
              className="h-full w-1/3 bg-graphite/40 [filter:grayscale(1)_contrast(1.05)]"
            />
          </div>

          {/* Titre / infos — révélés une fois les panneaux séparés */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="pointer-events-none absolute inset-x-6 bottom-16 flex flex-col gap-4 text-ink md:inset-x-16 md:flex-row md:items-end md:justify-between"
          >
            <h3 className="font-display text-4xl italic leading-none sm:text-5xl md:text-6xl">
              {project.name}
            </h3>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.2em] text-graphite">
              <span>{project.location}</span>
              <span className="text-graphite/40">—</span>
              <span>{project.year}</span>
              <span className="text-graphite/40">—</span>
              <span>{project.category}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}