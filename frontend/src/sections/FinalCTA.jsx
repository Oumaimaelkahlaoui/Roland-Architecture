import { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.25em] text-graphite/60 font-mono mb-3">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClasses =
  'w-full bg-ink/[0.03] border border-ink/10 rounded-xl px-4 py-4 text-ink placeholder:text-graphite/40 focus:outline-none focus:border-ink/30 focus:bg-ink/[0.05] transition-all duration-300 text-[15px]';

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section className="relative bg-white text-ink py-28 md:py-40 px-6 md:px-16 overflow-hidden">

      {/* Fond flouté — formes douces en arrière-plan */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] max-w-[600px] aspect-square rounded-full bg-amber-100/40 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[50vw] max-w-[700px] aspect-square rounded-full bg-orange-50 blur-[140px]" />
        <div className="absolute top-[20%] right-[15%] w-[25vw] max-w-[350px] aspect-square rounded-full bg-neutral-100 blur-[100px]" />

        {/* Mot géant flouté en arrière-plan */}
        <div
          className="absolute -top-[8%] right-[-6%] leading-none font-display font-bold whitespace-nowrap blur-[6px] opacity-[0.05] text-ink"
          style={{ fontSize: 'clamp(140px, 22vw, 380px)' }}
        >
          Contact
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
          className="mb-8 text-[11px] uppercase tracking-[0.35em] text-graphite/70 font-mono"
        >
          04 — Contact
        </motion.p>

        {/* Carte flottante en verre dépoli clair */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="relative rounded-[2rem] md:rounded-[2.5rem] border border-ink/10 bg-white/60 backdrop-blur-2xl shadow-[0_8px_60px_rgba(0,0,0,0.08)] p-8 sm:p-12 md:p-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">

            {/* Colonne de gauche : titre + infos */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-14">
              <div>
                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.05] tracking-tight text-ink mb-6">
                  Commençons votre projet
                </h3>
                <p className="text-sm text-graphite leading-relaxed max-w-xs">
                  Un projet architectural ou d'aménagement d'intérieur en tête ? Parlons-en.
                </p>
              </div>

              <div className="space-y-7 pt-7 border-t border-ink/10">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-graphite/50 font-mono mb-2">Bureau</p>
                  <p className="text-sm sm:text-base text-ink leading-relaxed">
                    Rue Ibn Aicha, n71 Imm b, André Edith, 5ème étage, Appt 5-3<br />
                    Guéliz, Marrakech 40000
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-graphite/50 font-mono mb-2">Contact direct</p>
                  <p className="text-sm sm:text-base text-ink font-mono">contact@rolandarchitect.com</p>
                  <p className="text-sm sm:text-base text-ink font-mono">+212 5 25 89 60 63</p>
                </div>
              </div>
            </div>

            {/* Colonne de droite : formulaire */}
            <div className="lg:col-span-8">
              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="py-16 flex flex-col items-center justify-center text-center h-full"
                >
                  <div className="w-14 h-14 rounded-full bg-ink text-white flex items-center justify-center text-xl mb-6">
                    ✓
                  </div>
                  <h4 className="font-display text-2xl sm:text-3xl mb-4 text-ink">Message envoyé</h4>
                  <p className="text-sm text-graphite max-w-md">
                    Merci pour votre message. Notre équipe d'architectes vous recontactera dans les plus brefs délais.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fieldVariants}>
                      <Field label="Nom complet *">
                        <input type="text" required placeholder="Jean Dupont" className={inputClasses} />
                      </Field>
                    </motion.div>
                    <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fieldVariants}>
                      <Field label="Email *">
                        <input type="email" required placeholder="jean@exemple.com" className={inputClasses} />
                      </Field>
                    </motion.div>
                  </div>

                  <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fieldVariants}>
                    <Field label="Type de projet">
                      <select className={`${inputClasses} appearance-none cursor-pointer`}>
                        <option>Architecture d'intérieur</option>
                        <option>Rénovation résidentielle</option>
                        <option>Espace commercial / Bureaux</option>
                        <option>Autre projet</option>
                      </select>
                    </Field>
                  </motion.div>

                  <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fieldVariants}>
                    <Field label="Message *">
                      <textarea
                        rows={4}
                        required
                        placeholder="Décrivez votre vision, vos attentes ou les grandes lignes de votre projet..."
                        className={`${inputClasses} resize-none`}
                      ></textarea>
                    </Field>
                  </motion.div>

                  <motion.div custom={4} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fieldVariants} className="pt-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="group w-full sm:w-auto inline-flex items-center justify-center gap-4 py-4 px-10 rounded-xl bg-ink text-white font-medium tracking-wide hover:bg-graphite transition-colors duration-300 text-xs uppercase font-mono"
                    >
                      Envoyer la demande
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </motion.button>
                  </motion.div>
                </form>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}