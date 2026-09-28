import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const projectsData = [
  {
    id: '01',
    title: 'Villa Tamazouzte',
    category: 'Architecture Résidentielle',
    location: 'Tamazouzte, Province Al Haouz',
    year: '796 m²',
    images: [
      '/projects/villa-tamazouzte-1.jpg',
      '/projects/villa-tamazouzte-2.jpg',
      '/projects/villa-tamazouzte-3.jpg',
      '/projects/villa-tamazouzte-4.jpg',
    ],
    description: "Niché au cœur d'Al Haouz (Aït Ourir – Tamazouzte), cette villa contemporaine incarne la rencontre entre rigueur géométrique et élégance architecturale, entre volumes sculptés et jeux de lumière.",
  },
  {
    id: '02',
    title: 'Villa Argan Golf',
    category: 'Architecture Résidentielle',
    location: 'Argan Golf, Marrakech',
    year: '673 m²',
    images: [
      '/projects/villa-argan-golf-1.jpg',
      '/projects/villa-argan-golf-2.jpg',
      '/projects/villa-argan-golf-3.jpg',
    ],
    description: "Une identité résolument futuriste, où la pureté des lignes et la maîtrise de la lumière sculptent l'architecture. Volumes en porte-à-faux et silhouette dynamique, presque cinématographique.",
  },
  {
    id: '03',
    title: 'Villa Akenza',
    category: 'Architecture Résidentielle',
    location: "Golf d'Akenza, Marrakech",
    year: '658 m²',
    images: [
      '/projects/villa-akenza-1.jpg',
      '/projects/villa-akenza-2.jpg',
      '/projects/villa-akenza-3.jpg',
      '/projects/villa-akenza-4.jpg',
    ],
    description: "La rencontre entre rigueur géométrique et élégance architecturale. Une villa qui dialogue avec son environnement naturel tout en affirmant une identité forte et intemporelle.",
  },
  {
    id: '04',
    title: 'Riad Bensaleh',
    category: 'Rénovation & Hôtellerie',
    location: 'Médina, Marrakech',
    year: '108 m²',
    images: [
      '/projects/riad-bensaleh-1.jpg',
      '/projects/riad-bensaleh-2.jpg',
      '/projects/riad-bensaleh-3.jpg',
      '/projects/riad-bensaleh-4.jpg',
    ],
    description: "Entre arcades traditionnelles, bois naturel, zellige et lignes épurées : une reconstruction poétique où chaque détail réinterprète l'art de vivre marocain dans sa version la plus contemporaine.",
  },
  {
    id: '05',
    title: 'Villa K',
    category: 'Architecture Résidentielle',
    location: 'Tamazouzte, Marrakech',
    year: '1053 m²',
    images: [
      '/projects/villa-k-1.jpg',
      '/projects/villa-k-2.jpg',
      '/projects/villa-k-3.jpg',
      '/projects/villa-k-4.jpg',
    ],
    description: "L'âme rurale de Tamazouzte, réinterprétée. Lignes claires, volumes équilibrés, persiennes en bois d'aluminium : un projet ancré dans son territoire, entre tradition et élégance épurée.",
  },
  {
    id: '06',
    title: 'Villa S',
    category: 'Design d’Intérieur',
    location: 'Marrakech',
    year: '250 m²',
    images: [
      '/projects/villa-s-1.jpg',
      '/projects/villa-s-2.jpg',
      '/projects/villa-s-3.jpg',
    ],
    description: "Le minimalisme comme art de vivre. Plus qu'une maison, un geste artistique — un espace pensé comme une œuvre, où la lumière sculpte les volumes et où l'essentiel devient esthétique.",
  },
  {
    id: '07',
    title: 'Villa Bourous',
    category: 'Architecture Résidentielle',
    location: 'Marrakech',
    year: '500 m²',
    images: [
      '/projects/villa-bourous-1.jpg',
      '/projects/villa-bourous-2.jpg',
      '/projects/villa-bourous-3.jpg',
    ],
    description: "L'élégance dans la simplicité. Volumes fluides, matériaux nobles, lignes claires : un refuge moderne où le luxe s'exprime dans la discrétion et la justesse des proportions.",
  },
  {
    id: '08',
    title: 'Domaine El Houat',
    category: 'Espace Commercial',
    location: 'Ouidane, Marrakech',
    year: '6 villas',
    images: [
      '/projects/domaine-el-houat-1.jpg',
      '/projects/domaine-el-houat-2.jpg',
      '/projects/domaine-el-houat-3.jpg',
    ],
    description: "L'Asie au cœur de l'Ouidane. Un groupement exclusif de villas de plain-pied inspirées de l'univers asiatique — lignes horizontales apaisantes, jardins privatifs zen, matériaux nobles.",
  },
  {
    id: '09',
    title: 'Villa B',
    category: 'Architecture Résidentielle',
    location: 'Arrondissement Menara, Marrakech',
    year: '2025',
    images: [
      '/projects/villa-b-1.jpg',
      '/projects/villa-b-2.jpg',
      '/projects/villa-b-3.jpg',
    ],
    description: "Une architecture tout en courbes, pensée pour s'harmoniser avec son environnement. Une signature élégante et contemporaine au cœur de Ménara, où chaque ligne épouse la nature.",
  },
];

const categories = ['Tous', 'Architecture Résidentielle', 'Design d’Intérieur', 'Rénovation & Hôtellerie', 'Espace Commercial'];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [currentImageIndices, setCurrentImageIndices] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndices((prevIndices) => {
        const newIndices = { ...prevIndices };
        projectsData.forEach((project) => {
          const currentIndex = newIndices[project.id] || 0;
          newIndices[project.id] = (currentIndex + 1) % project.images.length;
        });
        return newIndices;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const filteredProjects = selectedCategory === 'Tous' 
    ? projectsData 
    : projectsData.filter(p => p.category === selectedCategory);

  return (
    <section className="bg-black text-white py-28 md:py-40 px-6 md:px-16 min-h-screen">
      <div className="max-w-[1600px] mx-auto">

        {/* En-tête de la page */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-12 border-b border-white/10 gap-8">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-4 text-[11px] uppercase tracking-[0.35em] text-white/50 font-mono"
            >
              01 — Réalisations
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight"
            >
              Sélection de projets
            </motion.h2>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-white/60 max-w-md leading-relaxed"
          >
            Découvrez nos réalisations en architecture et aménagement d’intérieur à Marrakech et à travers le Maroc, où chaque espace est pensé comme une œuvre unique.
          </motion.p>
        </div>

        {/* Filtres par catégorie */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-3 mb-16"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-xs uppercase tracking-widest font-mono py-3 px-6 rounded-full border transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Grille des projets */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => {
              const activeIndex = currentImageIndices[project.id] || 0;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={project.id}
                  className="group cursor-pointer flex flex-col"
                >
                  {/* Conteneur image ajusté (aspect 16/11 pour mieux voir les photos sans gros zoom) */}
                  <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-neutral-900 mb-6 border border-white/10">
                    <AnimatePresence mode="popLayout">
                      <motion.img 
                        key={activeIndex}
                        src={project.images[activeIndex]} 
                        alt={`${project.title} - ${activeIndex + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    </AnimatePresence>
                    
                    {/* Indicateurs de progression */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      {project.images.map((_, imgIdx) => (
                        <span 
                          key={imgIdx} 
                          className={`h-1 rounded-full transition-all duration-500 ${
                            imgIdx === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Badge Année / Surface */}
                    <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-mono tracking-widest text-white/90 border border-white/10">
                      {project.year}
                    </div>
                  </div>

                  {/* Infos du projet avec "Découvrir +" aligné proprement */}
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-white/40">{project.id}</span>
                        <span className="w-1 h-1 rounded-full bg-white/40" />
                        <span className="text-xs uppercase tracking-wider text-white/60 font-mono">{project.category}</span>
                      </div>
                      <h3 className="font-display text-2xl sm:text-3xl font-normal group-hover:italic transition-all duration-300 text-white">
                        {project.title}
                      </h3>
                      <p className="text-xs text-white/40 font-mono mt-1">{project.location}</p>
                    </div>

                    <div className="text-xs uppercase tracking-widest font-mono text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 pb-1">
                      Découvrir +
                    </div>
                  </div>

                  {/* Description complète */}
                  <p className="text-xs sm:text-sm text-white/60 mt-3 max-w-xl leading-relaxed transition-colors duration-300 group-hover:text-white/90">
                    {project.description}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}