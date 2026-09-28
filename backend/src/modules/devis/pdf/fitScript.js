// Ce code s'exécute DANS le navigateur (Puppeteer), pas dans Node.
// Chaque ligne du PDF source est posée à sa position exacte ; ce script règle
// ensuite l'espacement pour que la ligne ait exactement la largeur d'origine
// (justification comme dans InDesign), quelle que soit la police chargée.
async function fitPage() {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svg = document.querySelector('svg');
  const lengthOf = (el) => el.getComputedTextLength();

  const squeeze = (el, width) => {
    el.setAttribute('textLength', String(width));
    el.setAttribute('lengthAdjust', 'spacingAndGlyphs');
  };

  try {
    await Promise.all(Array.from(document.fonts).map((face) => face.load().catch(() => null)));
    await document.fonts.ready;

    // Retour à la ligne des textes centrés (cases noires)
    svg.querySelectorAll('text[data-wrap]').forEach((el) => {
      const maxw = parseFloat(el.dataset.wrapW);
      const lineHeight = parseFloat(el.dataset.wrapLh);
      const cx = el.getAttribute('x');
      const words = el.textContent.split(/\s+/).filter(Boolean);
      const probe = el.cloneNode(false);
      probe.removeAttribute('data-wrap');
      svg.appendChild(probe);

      const lines = [];
      let current = '';
      words.forEach((word) => {
        const candidate = current ? `${current} ${word}` : word;
        probe.textContent = candidate;
        if (current && lengthOf(probe) > maxw) {
          lines.push(current);
          current = word;
        } else {
          current = candidate;
        }
      });
      if (current) lines.push(current);
      svg.removeChild(probe);

      el.textContent = '';
      lines.forEach((line, index) => {
        const tspan = document.createElementNS(SVG_NS, 'tspan');
        tspan.setAttribute('x', cx);
        if (index > 0) tspan.setAttribute('dy', String(lineHeight));
        tspan.textContent = line;
        el.appendChild(tspan);
      });
    });

    svg.querySelectorAll('text[data-fit]:not([data-wrap])').forEach((el) => {
      const mode = el.dataset.fit;
      const size = parseFloat(el.getAttribute('font-size'));

      if (mode === 'max' || mode === 'center') {
        // Largeur naturelle ; on ne comprime que si le texte dépasse la largeur disponible
        const maxw = parseFloat(el.dataset.maxw);
        if (lengthOf(el) > maxw) squeeze(el, maxw);
        return;
      }

      // mode "exact" : la ligne doit faire exactement sa largeur d'origine
      const target = parseFloat(el.dataset.w);
      const text = el.textContent;
      const spaces = (text.match(/ /g) || []).length;
      let delta = target - lengthOf(el);

      // Police de remplacement nettement plus large : on comprime les lettres
      // (plutôt que d'écraser les espaces).
      if (delta < -0.02 * target) {
        squeeze(el, target);
        return;
      }
      if (Math.abs(delta) > 0.05 && spaces > 0) {
        const wordSpacing = Math.max(-0.2 * size, Math.min(1.5 * size, delta / spaces));
        el.setAttribute('word-spacing', String(wordSpacing));
        delta = target - lengthOf(el);
      }
      if (Math.abs(delta) > 0.05 && text.length > 1) {
        const letterSpacing = Math.max(-0.05 * size, Math.min(0.6 * size, delta / text.length));
        el.setAttribute('letter-spacing', String(letterSpacing));
        delta = target - lengthOf(el);
      }
      if (Math.abs(delta) > 0.3) squeeze(el, target);
    });
  } catch (err) {
    document.body.dataset.error = String(err && err.message ? err.message : err);
  }
  document.body.dataset.ready = '1';
}

module.exports = `(${fitPage.toString()})();`;