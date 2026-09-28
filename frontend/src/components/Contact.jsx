import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formStatus, setFormStatus] = useState({ submitted: false, error: false });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Architecture & Conception',
    budget: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitted: true, error: false });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-[#f9f8f6] min-h-screen">

      {/* Bandeau noir plein cadre, collé à la navbar */}
      <div className="w-full bg-black pt-36 md:pt-44 pb-16 px-6 md:px-16 border-b border-white/15">
        <div className="max-w-[1600px] mx-auto">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-[11px] uppercase tracking-[0.35em] text-white/50 font-mono"
          >
            04 — Contact & Collaboration
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight max-w-4xl text-white"
          >
            Donnons vie à votre vision architecturale
          </motion.h1>
        </div>
      </div>

      <section className="bg-[#f9f8f6] text-[#1c1a18] py-20 md:py-28 px-6 md:px-16 relative overflow-hidden">

      {/* Halos lumineux doux pour le fond clair */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-[#f0ece4] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#ede6dc] rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Informations de contact (Colonne de gauche) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 space-y-12"
          >
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-normal mb-4 text-[#1c1a18]">
                Discutons de votre projet d'exception
              </h3>
              <p className="text-sm sm:text-base text-[#1c1a18]/70 leading-relaxed">
                Que vous ayez un terrain, un projet de rénovation d'envergure ou une vision globale à concevoir au Maroc ou à l'international, notre équipe est à votre écoute.
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-[#1c1a18]/15">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#1c1a18]/40 block mb-1">Bureau Principal</span>
                <p className="text-base text-[#1c1a18]/90 font-mono">Rue Ibn Aicha, n71 Imm b, André Edith, 5ème étage, Appt 5-3</p>
                <p className="text-base text-[#1c1a18]/90 font-mono">Guéliz, Marrakech 40000</p>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#1c1a18]/40 block mb-1">Contact Direct</span>
                <a href="mailto:contact@rolandarchitect.com" className="text-base text-[#1c1a18]/90 font-mono hover:text-[#1c1a18] transition-colors underline decoration-[#1c1a18]/30">
                  contact@rolandarchitect.com
                </a>
                <p className="text-base text-[#1c1a18]/90 font-mono mt-1">+212 5 25 89 60 63</p>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#1c1a18]/40 block mb-1">Horaires</span>
                <p className="text-sm text-[#1c1a18]/70 font-mono">Lundi — Vendredi : 09h00 - 18h00</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white/80 border border-[#1c1a18]/10 shadow-sm backdrop-blur-md">
              <span className="text-xs font-mono text-[#1c1a18]/40 uppercase tracking-wider block mb-2">Notre engagement</span>
              <p className="text-sm text-[#1c1a18]/80 italic">
                "Chaque projet commence par une écoute attentive. Nous vous recontactons sous 48 heures pour un premier échange approfondi."
              </p>
            </div>
          </motion.div>

          {/* Formulaire de contact (Colonne de droite) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-7 bg-white/90 border border-[#1c1a18]/15 rounded-3xl p-8 sm:p-12 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] relative"
          >
            {formStatus.submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-[#1c1a18] text-[#f9f8f6] rounded-full flex items-center justify-center mx-auto text-2xl font-mono">
                  ✓
                </div>
                <h3 className="font-display text-3xl font-normal text-[#1c1a18]">Message bien reçu</h3>
                <p className="text-sm text-[#1c1a18]/70 max-w-md mx-auto leading-relaxed">
                  Merci pour votre confiance. Notre équipe d'architectes étudiera votre demande avec la plus grande attention et reviendra vers vous très rapidement.
                </p>
                <button
                  onClick={() => setFormStatus({ submitted: false, error: false })}
                  className="mt-6 text-xs font-mono uppercase tracking-widest bg-[#1c1a18]/5 text-[#1c1a18] px-6 py-3 rounded-full hover:bg-[#1c1a18]/10 transition-colors"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#1c1a18]/60 mb-2">
                      Nom complet / Société *
                    </label>
                    <input 
                      type="text" 
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className="w-full bg-[#f9f8f6] border border-[#1c1a18]/15 rounded-xl px-4 py-3.5 text-sm text-[#1c1a18] placeholder-[#1c1a18]/30 focus:outline-none focus:border-[#1c1a18] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#1c1a18]/60 mb-2">
                      Adresse Email *
                    </label>
                    <input 
                      type="email" 
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      className="w-full bg-[#f9f8f6] border border-[#1c1a18]/15 rounded-xl px-4 py-3.5 text-sm text-[#1c1a18] placeholder-[#1c1a18]/30 focus:outline-none focus:border-[#1c1a18] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#1c1a18]/60 mb-2">
                      Type de prestation
                    </label>
                    <select 
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full bg-[#f9f8f6] border border-[#1c1a18]/15 rounded-xl px-4 py-3.5 text-sm text-[#1c1a18] focus:outline-none focus:border-[#1c1a18] transition-colors cursor-pointer"
                    >
                      <option value="Architecture & Conception" className="bg-[#f9f8f6]">Architecture & Conception</option>
                      <option value="Design d'Intérieur" className="bg-[#f9f8f6]">Design d'Intérieur</option>
                      <option value="Suivi de Chantier" className="bg-[#f9f8f6]">Suivi de Chantier & Pilotage</option>
                      <option value="Direction Artistique" className="bg-[#f9f8f6]">Direction Artistique & Conseil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#1c1a18]/60 mb-2">
                      Budget estimé (Optionnel)
                    </label>
                    <input 
                      type="text" 
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Ex: 2M - 5M MAD"
                      className="w-full bg-[#f9f8f6] border border-[#1c1a18]/15 rounded-xl px-4 py-3.5 text-sm text-[#1c1a18] placeholder-[#1c1a18]/30 focus:outline-none focus:border-[#1c1a18] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-[#1c1a18]/60 mb-2">
                    Parlez-nous de votre projet *
                  </label>
                  <textarea 
                    rows={5}
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Localisation, superficie, calendrier souhaité, aspirations esthétiques..."
                    className="w-full bg-[#f9f8f6] border border-[#1c1a18]/15 rounded-xl p-4 text-sm text-[#1c1a18] placeholder-[#1c1a18]/30 focus:outline-none focus:border-[#1c1a18] transition-colors resize-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#1c1a18]/40">
                    * Champs obligatoires
                  </span>
                  <button 
                    type="submit"
                    className="text-xs font-mono uppercase tracking-widest bg-[#1c1a18] text-[#f9f8f6] px-8 py-4 rounded-full hover:bg-[#332f2c] transition-colors duration-300 font-medium shadow-lg cursor-pointer"
                  >
                    Envoyer le message
                  </button>
                </div>
              </form>
            )}
          </motion.div>

        </div>

      </div>
      </section>
    </div>
  );
}