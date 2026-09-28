import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Le mariage des matières brutes et de la lumière naturelle a totalement métamorphosé notre lieu de vie.",
    author: "Nathalie & Paul D.",
    role: "Rénovation Penthouse",
  },
  {
    id: 2,
    quote: "Une rigueur architecturale exemplaire. Chaque espace respire le calme, le luxe et l'épure.",
    author: "Mehdi K.",
    role: "Directeur Artistique",
  },
  {
    id: 3,
    quote: "Un accompagnement sur-mesure du concept initial jusqu'aux derniers finitions d'intérieur. Remarquable.",
    author: "Clara S.",
    role: "Propriétaire de Boutique Hotel",
  },
  {
    id: 4,
    quote: "Leur vision de l'espace a transformé notre projet commercial en une véritable œuvre architecturale.",
    author: "Antoine M.",
    role: "Fondateur de Marque",
  }
];

export default function Testimonials() {
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="relative bg-ink py-32 overflow-hidden border-t border-paper/10">
      {/* Background flou de fond général */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden filter blur-[140px] opacity-30">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-amber-600/20 rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] bg-stone-500/20 rounded-full animate-pulse duration-1000" />
      </div>

      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16 mb-16 relative z-10">
        <span className="text-[11px] uppercase tracking-[0.25em] text-paper/60 block mb-3">
          Témoignages
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight text-paper">
          Ce que disent <span className="italic font-normal text-paper/70">nos clients</span>
        </h2>
      </div>

      {/* Carrousel glissable à la souris */}
      <div 
        className="relative w-full overflow-hidden z-15 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          drag="x"
          dragConstraints={{ left: -1500, right: 0 }}
          animate={isPaused ? {} : { x: ["0%", "-50%"] }}
          transition={
            isPaused
              ? {}
              : {
                  duration: 35,
                  ease: "linear",
                  repeat: Infinity,
                }
          }
        >
          {duplicatedTestimonials.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-[380px] md:w-[460px] shrink-0 bg-ink/70 border border-paper/15 backdrop-blur-md p-8 rounded-2xl flex flex-col justify-between shadow-2xl relative group overflow-hidden transition-all duration-700 hover:border-amber-500/40 hover:-translate-y-1"
            >
              {/* Effet de couleur dynamique au survol qui casse le noir et blanc */}
              <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Étoiles */}
              <div className="flex items-center gap-1 mb-6 text-paper/90 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" className="text-paper/90 group-hover:text-amber-400 transition-colors duration-500" />
                ))}
              </div>

              <p className="font-display text-lg md:text-xl font-light text-paper/90 whitespace-normal leading-relaxed mb-8 relative z-10">
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="whitespace-normal relative z-10">
                <h4 className="text-xs uppercase tracking-[0.15em] font-medium text-paper group-hover:text-amber-200 transition-colors duration-300">
                  {item.author}
                </h4>
                <p className="text-[11px] uppercase tracking-[0.1em] text-paper/50 mt-1">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}