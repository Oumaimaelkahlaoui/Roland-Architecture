import { useRef, useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function StorytellingSection() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-black text-paper flex items-center overflow-hidden py-24 md:py-32 px-6 md:px-20 border-t border-paper/10"
    >
      {/* Lignes de niveau topographiques en filigrane */}
      <div className="absolute inset-0 opacity-[0.28] md:opacity-[0.18] pointer-events-none overflow-hidden text-white">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio={isMobile ? 'none' : 'xMidYMid slice'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0.0,386.4 C 12.5,380.7 56.8,370.3 74.8,352.1 C 92.8,334.0 94.1,300.2 108.2,277.6 C 122.3,255.0 137.6,229.7 159.3,216.4 C 181.1,203.1 215.7,192.5 238.8,197.7 C 261.8,202.8 275.3,233.3 297.6,247.2 C 320.0,261.2 345.2,276.7 372.8,281.4 C 400.3,286.1 433.4,279.2 463.0,275.7 C 492.5,272.3 526.1,254.1 550.1,260.7 C 574.2,267.2 596.0,292.6 607.0,315.1 C 618.1,337.5 607.0,390.2 616.3,395.4 C 625.7,400.5 655.7,370.1 663.1,345.9 C 670.6,321.8 649.6,270.4 660.9,250.2 C 672.1,230.0 711.1,218.7 730.5,224.9 C 749.9,231.1 775.4,264.5 777.4,287.3 C 779.3,310.0 756.6,339.0 742.3,361.4 C 728.0,383.8 704.9,401.7 691.4,421.5 C 678.0,441.2 668.9,458.9 661.4,479.9 C 653.9,500.9 661.9,541.1 646.3,547.4 C 630.8,553.7 594.2,523.6 568.2,517.7 C 542.1,511.8 514.6,506.1 490.0,511.9 C 465.5,517.7 445.4,545.6 420.9,552.5 C 396.3,559.3 370.0,552.2 342.7,552.8 C 315.4,553.4 275.2,542.3 257.2,556.0 C 239.1,569.6 229.9,611.6 234.5,634.8 C 239.1,657.9 272.9,670.0 284.7,695.0 C 296.4,719.9 301.7,767.1 305.2,784.6 C 308.6,802.1 305.5,797.4 305.5,800.0"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            fill="none"
          />
          <path
            d="M 1164.1,0.0 C 1173.4,8.2 1215.2,29.3 1220.1,49.4 C 1225.0,69.5 1194.4,95.8 1193.4,120.5 C 1192.3,145.2 1207.9,174.0 1213.8,197.7 C 1219.7,221.4 1223.3,242.5 1228.6,262.5 C 1234.0,282.6 1250.7,299.1 1246.0,318.1 C 1241.3,337.2 1213.6,355.7 1200.2,376.8 C 1186.9,397.9 1169.9,419.4 1165.8,444.8 C 1161.6,470.2 1180.2,504.0 1175.4,529.3 C 1170.7,554.5 1155.1,579.6 1137.1,596.1 C 1119.0,612.6 1090.4,621.1 1067.2,628.3 C 1044.0,635.5 1021.0,641.2 998.0,639.4 C 974.9,637.6 947.6,611.5 928.9,617.7 C 910.3,623.9 902.7,672.3 886.3,676.4 C 869.9,680.6 845.8,659.5 830.4,642.5 C 815.0,625.5 797.0,597.5 793.9,574.5 C 790.7,551.5 801.2,525.8 811.7,504.7 C 822.2,483.6 836.8,461.1 856.9,447.9 C 876.9,434.6 916.2,443.2 931.9,425.2 C 947.7,407.2 938.5,361.2 951.5,339.8 C 964.6,318.3 986.0,306.3 1010.3,296.5 C 1034.6,286.7 1082.7,295.8 1097.3,280.9 C 1111.9,266.0 1108.8,225.0 1097.8,206.9 C 1086.8,188.9 1038.3,187.8 1031.1,172.9 C 1024.0,158.0 1042.5,135.1 1055.2,117.6 C 1067.9,100.1 1108.2,82.9 1107.4,68.0 C 1106.6,53.0 1061.7,39.1 1050.3,27.8 C 1038.8,16.5 1040.7,4.6 1038.7,0.0"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            fill="none"
          />
        </svg>
      </div>

      {/* Conteneur principal en grille */}
      <div className="mx-auto max-w-[1600px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">

        {/* Grand Titre à gauche */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          <h2 className="font-display text-7xl sm:text-8xl md:text-9xl lg:text-[9.5rem] font-bold leading-[0.88] tracking-tight text-paper">
            Raconter <br />
            Façonner <br />
            Concevoir
          </h2>
        </motion.div>

        {/* Texte descriptif en français à droite */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
            },
          }}
          className="lg:col-span-5 flex flex-col gap-6 lg:pl-12 max-w-lg"
        >
          <p className="text-base sm:text-lg md:text-xl font-light leading-relaxed text-paper/80">
            Nous guidons la vision de votre projet pour bâtir des identités fortes et des ambiances uniques, du concept jusqu'à la réalisation.
          </p>
          <p className="text-sm sm:text-base font-light leading-relaxed text-paper/60">
            Nous redéfinissons et sublimons les espaces pour éveiller les sens et susciter de véritables émotions.
          </p>
        </motion.div>

      </div>
    </section>
  );
}