import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listTypes } from '../../../services/devis';
import { Banner, PageHeader, buttonSecondary } from './ui';

const TONES = {
  'bab-taghzout': 'bg-[#3644D9]',
  'riad-kasba': 'bg-teal-500',
};

// Nouveau devis → choix du type (intitulés professionnels, jamais de noms de fichiers)
export default function DevisNew() {
  const [types, setTypes] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listTypes().then(setTypes).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-full bg-[#F4F5F8]">
      <PageHeader
        title="Nouveau devis"
        subtitle="Choisissez le type de devis à créer."
        actions={<Link to="/admin/devis" className={buttonSecondary}>← Retour aux devis</Link>}
      />
      <div className="max-w-4xl space-y-4 p-10">
        <Banner>{error}</Banner>
        {!types && !error && <p className="text-sm text-slate-400">Chargement…</p>}
        {types && types.length === 0 && <p className="text-sm text-slate-400">Aucun type de devis disponible.</p>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {types &&
            types.map((type) => (
              <Link
                key={type.id}
                to={`/admin/devis/nouveau/${type.id}`}
                className="group relative flex min-h-[9rem] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/[0.03] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3644D9]/40 hover:shadow-lg hover:shadow-[#3644D9]/10"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${TONES[type.id] || 'bg-slate-400'}`} />
                <div>
                  <span className="block text-base font-semibold leading-snug text-slate-900">{type.label}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#3644D9]">
                    Créer ce devis
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}