import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function StudioStatement() {
  return (
    <section className="relative overflow-hidden bg-paper py-28 text-ink md:py-40">
      {/* Watermark mark */}
      <img
        src="/logo/mark.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 hidden h-[28rem] w-auto opacity-[0.04] invert md:block"
      />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-16">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
          className="mb-10 text-[11px] uppercase tracking-[0.35em] text-graphite/70 md:mb-16"
        >
          01 — Studio
        </motion.p>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
               <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            custom={1}
            className="md:col-span-8"
          >
            <span className="block font-sans text-4xl font-medium uppercase leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl">
              Chaque espace raconte
              <br />
              deux histoires.
            </span>
            <span className="mt-2 block font-display text-3xl italic leading-tight text-graphite sm:text-4xl md:text-5xl">
              l'architecture, et la vie qui l'habite.
            </span>
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            custom={2}
            className="md:col-span-4 md:mt-6"
          >
            <p className="text-sm leading-relaxed text-graphite">
              Nous travaillons à la croisée de l'architecture et du design
              d'intérieur — en pensant les bâtiments et les espaces qui les
              habitent comme une seule et même idée. Chaque matière, chaque
              ligne de lumière, chaque pièce est pensée ensemble, du premier
              croquis jusqu'au moindre détail.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}