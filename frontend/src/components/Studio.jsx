import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Détection appareil tactile (pas de hover)
function useIsTouch() {
  const [isTouch, setIsTouch] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(hover: none)').matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    setIsTouch(mq.matches);
    const onChange = (e) => setIsTouch(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isTouch;
}

// Composant pour animer les chiffres au scroll
function Counter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  // Convertir la valeur en nombre si possible
  const numericValue = parseInt(value, 10);
  const isNumber = !isNaN(numericValue);

  useEffect(() => {
    if (isInView && isNumber) {
      let start = 0;
      const duration = 1500; // 1.5 secondes
      const steps = 40;
      const increment = numericValue / steps;
      const stepTime = duration / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    } else if (!isInView) {
      setCount(0); // Réinitialise quand on sort de l'écran pour rejouer l'anim
    }
  }, [isInView, numericValue, isNumber]);

  return (
    <span
      ref={ref}
      className="font-display text-4xl sm:text-6xl font-normal text-[#f4f2ee] mb-2 break-words"
    >
      {isNumber ? `${count}${suffix}` : value}
    </span>
  );
}

const values = [
  {
    number: '01',
    title: 'Vision & Identité',
    description: "Chaque projet est pensé comme une œuvre unique, dictée par le dialogue entre le site, sa lumière et les désirs de ceux qui l'habitent. Une écriture architecturale ancrée dans son époque et son territoire."
  },
  {
    number: '02',
    title: 'Matières & Authenticité',
    description: "Du zellige traditionnel au béton brut, en passant par le bois et la pierre locale, nous explorons la noblesse des matériaux pour créer des espaces texturés, chaleureux et durables."
  },
  {
    number: '03',
    title: 'Maîtrise & Précision',
    description: "De la conception initiale au suivi de chantier rigoureux, nous supervisons chaque détail avec une exigence absolue pour garantir une exécution fidèle et irréprochable."
  }
];

const stats = [
  { value: '10', suffix: '+', label: 'Années d’expérience' },
  { value: '50', suffix: '+', label: 'Projets réalisés' },
  { value: '100', suffix: '%', label: 'Sur-mesure' },
  { value: 'Marrakech', suffix: '', label: 'Basé au Maroc' },
];

export default function Studio() {
  const isTouch = useIsTouch();

  // Mobile : l'image passe en couleur quand elle est au centre de l'écran,
  // et repasse en gris dès qu'elle s'éloigne (marge de 35% en haut et en bas)
  const imageRef = useRef(null);
  const isImageCentered = useInView(imageRef, {
    margin: '-35% 0px -35% 0px',
  });

  return (
    // Fond chaleureux texturé inspiré des tons terre/sable pour casser le noir pur et s'harmoniser avec le footer
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
              02 — Studio
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight"
            >
              L’art de façonner l’espace
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-[#f4f2ee]/60 max-w-md leading-relaxed"
          >
            Studio pluridisciplinaire d’architecture et de design d’intérieur, nous concevons des lieux de vie et des espaces d’exception où l'esthétique rencontre la fonction.
          </motion.p>
        </div>

        {/* Section Manifesto / Présentation principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-28 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal leading-tight mb-8 text-[#f4f2ee]/90">
              « Entre tradition et modernité, nous réinterprétons l'art de bâtir pour créer des espaces intemporels. »
            </h3>
            <p className="text-sm sm:text-base text-[#f4f2ee]/60 leading-relaxed mb-6">
              Basé à Marrakech, notre studio s'attache à valoriser le patrimoine architectural local tout en y insufflant une vision contemporaine, épurée et audacieuse. Chaque volume est sculpté par la lumière naturelle, respectant le climat et l'environnement de chaque site.
            </p>
            <p className="text-sm sm:text-base text-[#f4f2ee]/60 leading-relaxed">
              De la villa résidentielle au projet hôtelier ou commercial, nous accompagnons nos clients à chaque étape clé, transformant des idées en réalités architecturales d'exception.
            </p>
          </motion.div>

          {/* Image du studio : mobile = gris → couleur au centre de l'écran, desktop = gris + hover */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative w-full aspect-[16/11] sm:aspect-[4/3] overflow-hidden rounded-2xl border border-[#f4f2ee]/15 bg-[#171513] group md:cursor-pointer shadow-2xl"
          >
            <img
              src="/projects/villa-marrakech.jfif"
              alt="Villa Atlas Marrakech"
              className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                isTouch
                  ? isImageCentered
                    ? 'grayscale-0 scale-105'
                    : 'grayscale contrast-125 scale-100'
                  : 'grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#f4f2ee]/60 block mb-1">Atelier</span>
                <p className="text-lg font-display">Marrakech, Maroc</p>
              </div>

              {/* Le badge "Survoler" n'a de sens que sur desktop */}
              {!isTouch && (
                <span className="text-xs font-mono uppercase tracking-widest bg-[#f4f2ee]/10 backdrop-blur-md px-3 py-1 rounded-full border border-[#f4f2ee]/15 text-[#f4f2ee]/80 group-hover:bg-[#f4f2ee] group-hover:text-[#121110] transition-colors duration-300">
                  Survoler
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Section Chiffres clés / Statistiques avec fond nuancé */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 px-8 sm:px-12 rounded-3xl bg-[#171513]/80 border border-[#f4f2ee]/15 backdrop-blur-xl mb-28 shadow-2xl relative overflow-hidden"
        >
          {/* Effet lumineux subtil en arrière-plan */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#f4f2ee]/5 rounded-full blur-3xl pointer-events-none" />

          {stats.map((stat, idx) => {
            const isText = isNaN(parseInt(stat.value, 10));

            return (
              <div
                key={idx}
                className={`flex flex-col relative z-10 min-w-0 ${
                  isText ? 'col-span-2 md:col-span-1' : ''
                }`}
              >
                <Counter value={stat.value} suffix={stat.suffix} />
                <span className="text-xs uppercase font-mono tracking-widest text-[#f4f2ee]/50">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Section Piliers / Valeurs */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#f4f2ee]/50 font-mono block mb-3">Notre Approche</span>
            <h3 className="font-display text-3xl sm:text-5xl font-normal">Nos piliers de conception</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-[#171513]/60 border border-[#f4f2ee]/10 rounded-2xl p-8 sm:p-10 flex flex-col justify-between hover:border-[#f4f2ee]/30 hover:bg-[#1b1917]/80 transition-all duration-300 shadow-lg backdrop-blur-md"
              >
                <div>
                  <span className="text-xs font-mono text-[#f4f2ee]/40 mb-6 block">{item.number}</span>
                  <h4 className="font-display text-2xl font-normal mb-4 text-[#f4f2ee]">{item.title}</h4>
                  <p className="text-sm text-[#f4f2ee]/60 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}