import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const servicesList = [
  {
    number: '01',
    title: 'Architecture & Conception',
    subtitle: 'De l’esquisse initiale au permis de construire',
    description: "Nous concevons des bâtiments uniques qui dialoguent avec leur environnement direct, le climat et la topographie. Chaque projet architectural est guidé par une recherche d'équilibre entre esthétique intemporelle, fonctionnalité spatiale et maîtrise technique.",
    deliverables: ['Études de faisabilité & Avant-projet', 'Plans d’implantation & volumétrie 3D', 'Dossier de permis de construire', 'Détails constructifs & spécifications techniques'],
  },
  {
    number: '02',
    title: 'Design d’Intérieur',
    subtitle: 'Scénographie des volumes et art de vivre',
    description: "L'intérieur d'un espace doit raconter une histoire et procurer une émotion dès les premiers pas. Nous sculptons la lumière, dessinons le mobilier sur-mesure et sélectionnons des matériaux nobles pour créer des ambiances chaleureuses et raffinées.",
    deliverables: ['Agencement des espaces & plans d’aménagement', 'Sélection des matériaux & palettes chromatiques', 'Design de mobilier sur-mesure', 'Conception lumineuse & intégration technique'],
  },
  {
    number: '03',
    title: 'Suivi de Chantier & Pilotage',
    subtitle: 'Rigueur d’exécution et excellence des finitions',
    description: "Parce qu'un grand dessin n'a de valeur que s'il est parfaitement exécuté, nous assurons une supervision minutieuse des travaux. De la coordination des corps de métier au respect des plannings et du budget, nous garantissons une fidélité absolue au projet validé.",
    deliverables: ['Direction de l’exécution des travaux (DET)', 'Coordination des entreprises & artisans', 'Contrôle qualité & respect des coûts', 'Réception des ouvrages & levée des réserves'],
  },
  {
    number: '04',
    title: 'Direction Artistique & Conseil',
    subtitle: 'Vision globale et mise en scène esthétique',
    description: "Un accompagnement sur-mesure pour les investisseurs, promoteurs ou particuliers souhaitant insuffler une identité forte et cohérente à leurs projets immobiliers, espaces commerciaux ou hôteliers.",
    deliverables: ['Audit architectural & stratégique', 'Sourcing d’objets d’art & de mobilier édité', 'Stylisme d’espace & mise en scène visuelle', 'Conseil en investissement immobilier d’exception'],
  }
];

export default function Services() {
  const [activeService, setActiveService] = useState(0);

  return (
    // Fond chaleureux texturé inspiré des tons terre/sable (fini le noir pur)
    <section className="bg-[#121110] text-[#f4f2ee] py-28 md:py-40 px-6 md:px-16 min-h-screen relative overflow-hidden">
      
      {/* Halos de lumière ambrés et doux pour réchauffer l'atmosphère */}
      <div className="absolute top-10 left-10 w-[600px] h-[600px] bg-[#26211d] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#1c1815] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto relative z-10">

        {/* En-tête de la page */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 pb-12 border-b border-[#f4f2ee]/15 gap-8">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-4 text-[11px] uppercase tracking-[0.35em] text-[#f4f2ee]/50 font-mono"
            >
              03 — Expertise & Services
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight"
            >
              Une approche globale de l'espace
            </motion.h2>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-[#f4f2ee]/60 max-w-md leading-relaxed"
          >
            De la feuille blanche à la remise des clés, nous accompagnons chaque projet avec une exigence absolue de qualité, de créativité et de précision technique.
          </motion.p>
        </div>

        {/* Section Interactive des Services */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-28">
          
          {/* Liste interactive (Colonne de gauche) */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            {servicesList.map((service, index) => {
              const isActive = activeService === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setActiveService(index)}
                  className={`group p-8 rounded-2xl border cursor-pointer transition-all duration-500 backdrop-blur-md ${
                    isActive 
                      ? 'bg-[#1b1917] border-[#f4f2ee]/40 shadow-[0_15px_40px_rgba(0,0,0,0.5)] scale-[1.01]' 
                      : 'bg-[#171513]/60 border-[#f4f2ee]/10 hover:border-[#f4f2ee]/25 hover:bg-[#1b1917]/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-xs font-mono transition-colors duration-300 ${isActive ? 'text-[#f4f2ee]' : 'text-[#f4f2ee]/40'}`}>
                      {service.number}
                    </span>
                    <span className={`text-xs font-mono uppercase tracking-widest px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
                      isActive ? 'bg-[#f4f2ee] text-[#121110] border-[#f4f2ee] font-medium' : 'border-[#f4f2ee]/10 text-[#f4f2ee]/50 group-hover:border-[#f4f2ee]/30'
                    }`}>
                      {isActive ? 'Sélectionné' : 'Explorer'}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-normal mb-2 text-[#f4f2ee]">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#f4f2ee]/50 font-mono mb-4">{service.subtitle}</p>

                  {/* Affichage mobile direct du contenu si actif */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="lg:hidden mt-6 pt-6 border-t border-[#f4f2ee]/15 overflow-hidden"
                      >
                        <p className="text-sm text-[#f4f2ee]/70 leading-relaxed mb-6">{service.description}</p>
                        <h4 className="text-xs font-mono tracking-widest uppercase text-[#f4f2ee]/40 mb-3">Livrables clés :</h4>
                        <ul className="grid grid-cols-1 gap-2.5">
                          {service.deliverables.map((item, idx) => (
                            <li key={idx} className="text-xs text-[#f4f2ee]/80 flex items-center space-x-2.5 bg-[#121110]/60 p-2.5 rounded-lg border border-[#f4f2ee]/5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#f4f2ee]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Panneau de détails dynamique (Colonne de droite - Desktop uniquement) */}
          <div className="hidden lg:block lg:col-span-6 sticky top-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-[#1b1917]/90 border border-[#f4f2ee]/20 rounded-3xl p-10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden"
              >
                {/* Effet lumineux interne subtil */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#f4f2ee]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#f4f2ee]/15">
                  <div>
                    <span className="text-xs font-mono text-[#f4f2ee]/40 block mb-1">Détails de la prestation</span>
                    <span className="font-mono text-xl text-[#f4f2ee]/90">{servicesList[activeService].number} / 04</span>
                  </div>
                  <span className="w-12 h-12 rounded-full border border-[#f4f2ee]/20 flex items-center justify-center font-mono text-sm text-[#f4f2ee]/80 bg-[#f4f2ee]/5">
                    →
                  </span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl font-normal mb-3 text-[#f4f2ee]">
                  {servicesList[activeService].title}
                </h3>
                <p className="text-sm font-mono text-[#f4f2ee]/50 mb-6">{servicesList[activeService].subtitle}</p>
                
                <p className="text-base text-[#f4f2ee]/75 leading-relaxed mb-8">
                  {servicesList[activeService].description}
                </p>

                <div className="space-y-4 pt-6 border-t border-[#f4f2ee]/15">
                  <h4 className="text-xs font-mono tracking-widest uppercase text-[#f4f2ee]/40">Livrables & Étapes clés :</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {servicesList[activeService].deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3 bg-[#121110]/60 p-3.5 rounded-xl border border-[#f4f2ee]/5">
                        <span className="w-2 h-2 rounded-full bg-[#f4f2ee] shadow-[0_0_10px_rgba(244,242,238,0.5)]" />
                        <span className="text-sm text-[#f4f2ee]/90">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-[#f4f2ee]/15 flex justify-between items-center">
                  <span className="text-xs font-mono text-[#f4f2ee]/40 uppercase tracking-widest">Besoin d'un accompagnement ?</span>
                  <a 
                    href="/contact" 
                    className="text-xs font-mono uppercase tracking-widest bg-[#f4f2ee] text-[#121110] px-6 py-3.5 rounded-full hover:bg-[#e2dfdb] transition-colors duration-300 font-medium shadow-lg"
                  >
                    Discuter du projet
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Nouvelle section immersive : Du plan 2D à la modélisation 3D */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-[#171513]/80 border border-[#f4f2ee]/15 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#f4f2ee]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-5">
              <span className="text-[11px] uppercase tracking-[0.35em] text-[#f4f2ee]/50 font-mono block mb-3">Méthodologie immersive</span>
              <h3 className="font-display text-3xl sm:text-4xl font-normal mb-6 text-[#f4f2ee]">
                Du plan 2D à la matérialité spatiale
              </h3>
              <p className="text-sm sm:text-base text-[#f4f2ee]/70 leading-relaxed mb-6">
                Chaque étude s'articule autour d'une rigueur géométrique absolue. Nous transformons les plans architecturaux en volumes tangibles, permettant d'appréhender chaque perspective, circulation et apport de lumière naturelle avant même le premier coup de pioche.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#f4f2ee]/15">
                <div>
                  <span className="text-xl font-display text-[#f4f2ee] block mb-1">1:50</span>
                  <span className="text-xs font-mono text-[#f4f2ee]/50 uppercase tracking-wider">Échelle d'étude</span>
                </div>
                <div>
                  <span className="text-xl font-display text-[#f4f2ee] block mb-1">3D Volumétrique</span>
                  <span className="text-xs font-mono text-[#f4f2ee]/50 uppercase tracking-wider">Modélisation interactive</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-[#f4f2ee]/15 bg-[#121110] shadow-2xl aspect-[16/9]">
              <video 
                src="/videos/intro-plan-to-villa.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121110]/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs font-mono text-[#f4f2ee]/80 bg-[#121110]/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#f4f2ee]/10">
                <span>RÉSIDENCE M4 — LEVEL 04</span>
                <span className="text-[#f4f2ee]/40 uppercase tracking-widest">Étude de volume</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}