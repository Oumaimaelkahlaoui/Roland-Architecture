import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useScrolled from '../../hooks/useScrolled';

const STUDIO_NAME = 'STUDIO NAME';

const NAV_LINKS = [
  { label: 'Projects', href: '/projects' },
  { label: 'Studio', href: '/studio' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

/**
 * Composant de flip propre sans doublon visuel
 */
function FlipLabel({ label }) {
  return (
    <span className="inline-flex overflow-hidden" aria-hidden="true">
      {label.split("").map((ch, i) => (
        <span
          key={i}
          className="inline-block h-[1em] overflow-hidden leading-[1]"
        >
          <span 
            className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[1em]"
            style={{ transitionDelay: `${i * 20}ms` }}
          >
            <span className="block h-[1em] leading-[1]">{ch === " " ? "\u00A0" : ch}</span>
            <span className="block h-[1em] leading-[1]">{ch === " " ? "\u00A0" : ch}</span>
          </span>
        </span>
      ))}
    </span>
  );
}

function NavLink({ href, children, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="group relative inline-flex items-center gap-2.5 text-[14px] uppercase tracking-[0.18em] text-paper/85 transition-colors hover:text-paper"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70 transition-opacity group-hover:opacity-100" />
      <span className="relative inline-flex">
        <FlipLabel label={children} />
      </span>
    </a>
  );
}

export default function Navbar() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-out ${
          scrolled
            ? 'border-b border-paper/10 bg-ink/90 py-4 backdrop-blur-sm'
            : 'border-b border-transparent bg-transparent py-7'
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-10 lg:px-16">
          {/* Logo mark agrandi */}
          <a href="/" className="flex items-center gap-3">
            <img
              src="/logo/logo-mark.png"
              alt={STUDIO_NAME}
              className="h-12 w-auto md:h-14 transition-transform duration-300 hover:scale-105"
            />
          </a>

          {/* Desktop nav avec liens agrandis et espacés */}
          <nav className="hidden items-center gap-12 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[6px] md:hidden cursor-pointer"
          >
            <motion.span
              animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }}
              className="h-px w-6 bg-paper"
            />
            <motion.span
              animate={{ rotate: open ? -45 : 0, y: open ? -4 : 0 }}
              className="h-px w-6 bg-paper"
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-ink"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                className="font-display text-4xl italic text-paper"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}