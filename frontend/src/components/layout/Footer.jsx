const STUDIO_NAME = 'Roland Architecture';

const NAV_LINKS = [
  { label: 'Projets', href: '/projects' },
  { label: 'Studio', href: '/studio' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <img src="/logo/logo-mark.png" alt={STUDIO_NAME} className="h-12 w-auto" />
            <p className="mt-6 max-w-[16rem] text-sm leading-relaxed text-paper/50">
              Architecture et design d'intérieur, à Marrakech.
            </p>
          </div>

          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-paper/40">
              Navigation
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                    <a
                    href={link.href}
                    className="text-sm text-paper/70 transition-colors hover:text-paper"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-paper/40">
              Contact
            </p>
            <ul className="space-y-3 text-sm text-paper/70">
              <li>
                <a href="mailto:contact@rolandarchitect.com" className="transition-colors hover:text-paper">
                  contact@rolandarchitect.com
                </a>
              </li>
              <li>
                <a href="tel:+212525896063" className="transition-colors hover:text-paper">
                  +212 5 25 89 60 63
                </a>
              </li>
              <li className="text-paper/50">Guéliz, Marrakech, Maroc</li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-paper/40">
              Suivre
            </p>

            <a           
              href="https://instagram.com/rolandarchitect"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-paper/70 transition-colors hover:text-paper"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-paper/10 pt-8 text-xs text-paper/30">
          <span>© {new Date().getFullYear()} {STUDIO_NAME}. Tous droits réservés.</span>
        </div>
      </div>
    </footer>
  );
}