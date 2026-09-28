import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Écoute & Analyse",
    subtitle: "Compréhension profonde des besoins",
    description: "Chaque projet commence par une phase d'écoute active. Nous analysons vos ambitions, vos contraintes et l'identité de votre espace pour définir une vision claire et sur mesure.",
  },
  {
    number: "02",
    title: "Conception & Esquisses",
    subtitle: "Recherches créatives et volumes",
    description: "Traduction de la vision en concepts architecturaux. Nous explorons les circulations, les harmonies de matières et les implantations à travers des plans et des croquis détaillés.",
  },
  {
    number: "03",
    title: "Visualisation 3D",
    subtitle: "Immersion photoréaliste",
    description: "Avant toute réalisation, nos rendus 3D vous plongent au cœur de votre futur espace. Chaque détail de lumière, de texture et de mobilier est rigoureusement mis en scène.",
  },
  {
    number: "04",
    title: "Réalisation & Suivi",
    subtitle: "De la vision à la matérialité",
    description: "Coordination des savoir-faire et des artisans. Nous supervisons chaque étape du chantier pour garantir une fidélité absolue au projet validé et une exécution irréprochable.",
  },
];

export default function Processus() {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const bannerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ['start start', 'end end'],
  });

  // Les bandes s'ouvrent au scroll (fond noir)
  const curtainScaleX = useTransform(scrollYProgress, [0.05, 0.65], [1, 0]);

  // Rotation automatique rapide (2.2 secondes par carte)
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black">
      
      {/* 1. SECTION BANNIÈRE */}
      <section ref={bannerRef} className="relative w-full h-[200vh] bg-black">
        <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
          <div className="relative block w-full h-full overflow-hidden">
            
            {/* Image de fond */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop"
                alt="Architecture d'intérieur et design contemporain"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Texte stable */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="absolute inset-0 z-30 flex items-center left-8 md:left-20 max-w-2xl pointer-events-none"
            >
              <div className="px-4">
                <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-white/90 drop-shadow">
                  04 — Processus
                </p>
                <h2 className="font-display text-5xl italic leading-tight sm:text-7xl md:text-8xl text-white drop-shadow-xl">
                  De la vision à la réalité
                </h2>
              </div>
            </motion.div>

            {/* Les 3 blocs rideaux verticaux en noir */}
            <motion.div 
              style={{ scaleX: curtainScaleX }}
              className="absolute inset-y-0 left-0 w-1/3 bg-black z-20 origin-left"
            />
            <motion.div 
              style={{ scaleX: curtainScaleX }}
              className="absolute inset-y-0 left-1/3 w-1/3 bg-black z-20 origin-center"
            />
            <motion.div 
              style={{ scaleX: curtainScaleX }}
              className="absolute inset-y-0 right-0 w-1/3 bg-black z-20 origin-right"
            />

          </div>
        </div>
      </section>

      {/* 2. SECTION PROCESSUS - DESIGN CARTES IMMERSIVES */}
      <section className="relative bg-black py-32 md:py-48 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-16">
          
          {/* En-tête de section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
            <div>
              <span className="text-xs uppercase tracking-[0.35em] text-white/50 block mb-3 font-mono">
                Méthodologie détaillée
              </span>
              <h3 className="text-4xl sm:text-6xl font-normal tracking-tight text-white font-display">
                Les étapes clés
              </h3>
            </div>
            <p className="mt-4 md:mt-0 max-w-md text-sm text-white/60 leading-relaxed">
              Une approche structurée et transparente pour donner vie à vos projets architecturaux, du premier trait jusqu’à la livraison finale.
            </p>
          </div>

          {/* Grille des étapes */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {steps.map((step, index) => {
              const isActive = activeStep === index;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  onClick={() => setActiveStep(index)}
                  className={`group relative p-8 md:p-10 rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[380px] ${
                    isActive 
                      ? 'bg-white/10 border-white/50 shadow-2xl shadow-white/10 scale-[1.02]' 
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  {/* Haut de la carte : Numéro et indicateur graphique */}
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className={`text-2xl font-mono tracking-wider transition-colors duration-400 ${
                        isActive ? 'text-white font-bold' : 'text-white/30'
                      }`}>
                        {step.number}
                      </span>
                      <div className={`w-3 h-3 rounded-full transition-all duration-400 ${
                        isActive ? 'bg-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.9)]' : 'bg-white/20'
                      }`} />
                    </div>

                    <h4 className={`text-2xl sm:text-3xl font-display mb-3 transition-colors duration-400 ${
                      isActive ? 'text-white italic font-normal' : 'text-white/80'
                    }`}>
                      {step.title}
                    </h4>
                    
                    <p className="text-xs uppercase tracking-wider text-white/50 mb-6 font-mono">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Bas de la carte : Description détaillée */}
                  <div className="pt-6 border-t border-white/10">
                    <p className={`text-xs sm:text-sm leading-relaxed transition-colors duration-400 ${
                      isActive ? 'text-white/90' : 'text-white/50'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}