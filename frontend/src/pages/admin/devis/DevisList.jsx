import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { downloadBlob, fetchPdf, listDevis, listTypes } from '../../../services/devis';
import { devisFileName, formatDate, formatMoney } from './formatters';

/* ---------- petites briques ---------- */
const Icon = ({ d, className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const ICONS = {
  plus: 'M12 5v14M5 12h14',
  search: 'M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 14.75a2.75 2.75 0 100-5.5 2.75 2.75 0 000 5.5z',
  edit: 'M4 20h4l10.5-10.5a2.1 2.1 0 00-3-3L5 17v3zM13.5 6.5l3 3',
  download: 'M12 4v11m0 0l-4-4m4 4l4-4M5 20h14',
  doc: 'M9 12h6M9 16h6M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z',
  coins: 'M12 6c4.4 0 8-1.1 8-2.5S16.4 1 12 1 4 2.1 4 3.5 7.6 6 12 6zM4 3.5v5C4 9.9 7.6 11 12 11s8-1.1 8-2.5v-5M4 8.5v5c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-5M4 13.5v5C4 19.9 7.6 21 12 21s8-1.1 8-2.5v-5',
  calendar: 'M8 3v3m8-3v3M4 9h16M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z',
};

const TYPE_TONES = {
  'bab-taghzout': { dot: 'bg-[#C9A96E]', ring: 'ring-[#C9A96E]/20' },
  'riad-kasba': { dot: 'bg-teal-500', ring: 'ring-teal-500/15' },
};
const toneFor = (type) => TYPE_TONES[type] || { dot: 'bg-slate-400', ring: 'ring-slate-400/15' };

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '–';
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

function StatusPill({ status }) {
  const ok = status === 'genere';
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        ok ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-slate-100 text-slate-600 ring-slate-500/20'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      {ok ? 'Généré' : 'Brouillon'}
    </span>
  );
}

// Bouton icône (tableau, grand écran)
function IconAction({ label, onClick, to, children, primary = false, disabled = false }) {
  const cls = `grid h-9 w-9 place-items-center rounded-xl border transition-all duration-200 cursor-pointer
    ${primary
      ? 'border-[#C9A96E] bg-white text-[#8A6A3B] shadow-sm hover:bg-[#C9A96E] hover:text-[#1a1510] hover:shadow-md hover:shadow-[#C9A96E]/30'
      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-[#8A6A3B] hover:shadow-sm'}
    disabled:pointer-events-none disabled:opacity-40`;
  if (to) {
    return (
      <Link to={to} aria-label={label} title={label} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

// Bouton avec texte (cartes, mobile)
function CardAction({ label, onClick, to, icon, primary = false, disabled = false, loading = false }) {
  const cls = `flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors cursor-pointer
    ${primary
      ? 'border-[#C9A96E] bg-white text-[#8A6A3B] hover:bg-[#C9A96E] hover:text-[#1a1510]'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}
    disabled:pointer-events-none disabled:opacity-40`;
  const content = (
    <>
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Icon d={icon} />
      )}
      {label}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {content}
    </button>
  );
}

function StatCard({ icon, label, value, hint, dark = false, className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 ${
        dark
          ? 'bg-black text-white shadow-xl shadow-black/20 ring-1 ring-white/10'
          : 'border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]'
      } ${className}`}
    >
      {dark && <div aria-hidden className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#C9A96E]/30 blur-3xl" />}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-sm font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
          <p className={`mt-2 truncate text-2xl font-semibold leading-none tracking-tight tabular-nums sm:text-[28px] ${dark ? 'text-white' : 'text-slate-900'}`}>
            {value}
          </p>
          {hint && <p className={`mt-2 text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{hint}</p>}
        </div>
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
            dark ? 'bg-white/[0.08] text-[#E6CFA0] ring-1 ring-white/10' : 'bg-[#C9A96E]/15 text-[#8A6A3B]'
          }`}
        >
          <Icon d={icon} className="h-[18px] w-[18px]" />
        </span>
      </div>
    </div>
  );
}

function EmptyState({ filtering }) {
  return (
    <div className="px-6 py-16 sm:py-20">
      <div className="mx-auto flex max-w-sm flex-col items-center text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-black text-[#E6CFA0] shadow-xl shadow-black/20">
          <Icon d={ICONS.doc} className="h-6 w-6" />
        </span>
        <p className="mt-4 text-base font-semibold text-slate-900">{filtering ? 'Aucun résultat' : 'Aucun devis pour le moment'}</p>
        <p className="mt-1 text-sm text-slate-500">
          {filtering
            ? 'Essayez une autre référence, un autre client ou réinitialisez les filtres.'
            : 'Créez votre premier devis, il apparaîtra ici.'}
        </p>
        {!filtering && (
          <Link
            to="/admin/devis/nouveau"
            className="mt-5 rounded-xl bg-[#C9A96E] px-5 py-2.5 text-sm font-semibold text-[#1a1510] shadow-lg shadow-[#C9A96E]/25 transition hover:bg-[#B8975A]"
          >
            Créer un devis
          </Link>
        )}
      </div>
    </div>
  );
}

/* ---------- pagination ---------- */
const PAGE_SIZES = [10, 25, 50];

// Numéros de pages à afficher, avec des « … » quand il y en a beaucoup : 1 … 4 5 6 … 12
function pageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(`gap-${i}`);
    out.push(p);
  });
  return out;
}

function Pagination({ total, page, pageSize, onPage, onPageSize }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const navBtn =
    'grid h-9 min-w-9 place-items-center rounded-lg border px-2 text-sm font-medium transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-40';

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
        <span>
          {from}–{to} sur {total} devis
        </span>
        <label className="flex items-center gap-2">
          Par page
          <select
            value={pageSize}
            onChange={(e) => onPageSize(Number(e.target.value))}
            className="h-8 cursor-pointer rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-[#C9A96E]/70 focus:ring-4 focus:ring-[#C9A96E]/15"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <nav aria-label="Pagination" className="flex items-center justify-between gap-1.5 lg:justify-end">
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          aria-label="Page précédente"
          className={`${navBtn} border-slate-200 bg-white text-slate-600 hover:bg-slate-50`}
        >
          <Icon d="M15 19l-7-7 7-7" />
        </button>

        {/* petits écrans : simple indicateur */}
        <span className="px-2 text-sm tabular-nums text-slate-600 sm:hidden">
          Page {page} / {totalPages}
        </span>

        {/* écrans plus larges : numéros de pages */}
        <div className="hidden items-center gap-1.5 sm:flex">
          {pageWindow(page, totalPages).map((p) =>
            typeof p === 'string' ? (
              <span key={p} className="px-1 text-slate-400">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPage(p)}
                aria-current={p === page ? 'page' : undefined}
                className={`${navBtn} tabular-nums ${
                  p === page
                    ? 'border-black bg-black text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          aria-label="Page suivante"
          className={`${navBtn} border-slate-200 bg-white text-slate-600 hover:bg-slate-50`}
        >
          <Icon d="M9 5l7 7-7 7" />
        </button>
      </nav>
    </div>
  );
}

/* ---------- page ---------- */
export default function DevisList() {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [result, setResult] = useState({ key: null, items: [], error: '' });
  const [downloadingId, setDownloadingId] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    listTypes().then(setTypes).catch(() => setTypes([]));
  }, []);

  // Recherche avec un léger délai pour ne pas interroger le serveur à chaque frappe
  const queryKey = `${search}|${typeFilter}`;
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const items = await listDevis({ q: search, type: typeFilter });
        if (!cancelled) setResult({ key: queryKey, items, error: '' });
      } catch (err) {
        if (!cancelled) setResult({ key: queryKey, items: [], error: err.message });
      }
    }, search ? 300 : 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, typeFilter, queryKey]);

  const loading = result.key !== queryKey;
  const { items, error } = result;

  // Pagination (côté navigateur) : on revient à la page 1 quand la recherche ou le filtre change
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, pageSize]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = items.filter((d) => {
      const date = new Date(d.devis_date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    const total = items.reduce((sum, d) => sum + Number(d.total_amount || 0), 0);
    return { count: items.length, thisMonth, total };
  }, [items]);

  const handleDownload = async (devis) => {
    setActionError('');
    setDownloadingId(devis.id);
    try {
    downloadBlob(await fetchPdf(devis.id), devisFileName(devis));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const filtering = Boolean(search || typeFilter);

  return (
    <div className="relative isolate min-h-full bg-[#F4F5F8]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 overflow-hidden">
        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-[#C9A96E]/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pb-12 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-10">
        {/* en-tête */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <h1 className="text-2xl font-semibold leading-none tracking-tight text-slate-900 sm:text-[30px]">Devis</h1>
            <p className="mt-2 text-sm text-slate-500">Retrouvez, modifiez et téléchargez tous vos devis en un coup d’œil.</p>
          </div>
          <Link
            to="/admin/devis/nouveau"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 ring-1 ring-white/10 transition-all duration-200 hover:bg-[#C9A96E] hover:text-[#1a1510] hover:shadow-[#C9A96E]/30 sm:w-auto"
          >
            <Icon d={ICONS.plus} className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            Nouveau devis
          </Link>
        </header>

        {/* statistiques */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3">
          <StatCard
            icon={ICONS.doc}
            label={filtering ? 'Devis trouvés' : 'Devis enregistrés'}
            value={loading ? '…' : stats.count}
            hint="Tous statuts confondus"
          />
          <StatCard icon={ICONS.calendar} label="Ce mois-ci" value={loading ? '…' : stats.thisMonth} hint="Créés durant le mois en cours" />
          <StatCard
            dark
            className="sm:col-span-2 lg:col-span-1"
            icon={ICONS.coins}
            label="Montant cumulé"
            value={loading ? '…' : formatMoney(stats.total)}
            hint="Somme des montants HT"
          />
        </section>

        {/* liste */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.04]">
          {/* barre d'outils */}
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:px-5">
            <div className="relative w-full sm:w-[22rem]">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon d={ICONS.search} />
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par référence, client ou projet…"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#C9A96E]/70 focus:bg-white focus:ring-4 focus:ring-[#C9A96E]/15"
              />
            </div>
            {types.length > 1 && (
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-11 w-full cursor-pointer truncate rounded-xl border border-slate-200 bg-slate-50/60 px-4 text-sm text-slate-700 outline-none transition focus:border-[#C9A96E]/70 focus:bg-white focus:ring-4 focus:ring-[#C9A96E]/15 sm:w-auto sm:max-w-[22rem]"
              >
                <option value="">Tous les types</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            )}
            {filtering && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setTypeFilter('');
                }}
                className="h-11 cursor-pointer rounded-xl px-4 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {(error || actionError) && (
            <div className="mx-4 mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 sm:mx-5">
              {error || actionError}
            </div>
          )}

          {loading ? (
            <>
              {/* chargement : cartes (mobile) */}
              <div className="space-y-3 p-4 xl:hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-3 rounded-2xl border border-slate-100 p-4">
                    <div className="h-4 w-1/3 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-3.5 w-1/2 animate-pulse rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
              {/* chargement : tableau (grand écran) */}
              <div className="hidden xl:block">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-6 border-t border-slate-100 px-6 py-5 first:border-t-0">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <div key={j} className="h-3.5 flex-1 animate-pulse rounded-full bg-slate-100" />
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : items.length === 0 ? (
            <EmptyState filtering={filtering} />
          ) : (
            <>
              {/* cartes : mobile et tablette */}
              <ul className="space-y-3 p-4 sm:p-5 xl:hidden">
                {pagedItems.map((devis) => {
                  const tone = toneFor(devis.type);
                  return (
                    <li
                      key={devis.id}
                      onClick={() => navigate(`/admin/devis/${devis.id}`)}
                      className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[0.03] transition-colors hover:border-[#C9A96E]/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-800">
                          {devis.reference}
                        </span>
                        <StatusPill status={devis.status} />
                      </div>

                      <p className="mt-3 text-base font-semibold leading-snug text-slate-900">{devis.project_name || 'Projet sans nom'}</p>

                      <div className="mt-2 flex items-start gap-2.5">
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ring-4 ${tone.dot} ${tone.ring}`} />
                        <span className="text-[13px] leading-snug text-slate-500">{devis.type_label}</span>
                      </div>

                      <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
                        <div className="min-w-0">
                          {devis.client_name ? (
                            <span className="inline-flex max-w-full items-center gap-2">
                              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-black text-[10px] font-semibold text-white">
                                {initials(devis.client_name)}
                              </span>
                              <span className="truncate text-sm text-slate-700">{devis.client_name}</span>
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">Client non renseigné</span>
                          )}
                          <p className="mt-1 text-xs tabular-nums text-slate-400">{formatDate(devis.devis_date)}</p>
                        </div>
                        <p className="shrink-0 text-base font-semibold tabular-nums text-slate-900">{formatMoney(devis.total_amount)}</p>
                      </div>

                      <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <CardAction label="Voir" to={`/admin/devis/${devis.id}`} icon={ICONS.eye} />
                        <CardAction label="Modifier" to={`/admin/devis/${devis.id}/modifier`} icon={ICONS.edit} />
                        <CardAction
                          label="PDF"
                          primary
                          icon={ICONS.download}
                          loading={downloadingId === devis.id}
                          disabled={!devis.pdf_path || downloadingId === devis.id}
                          onClick={() => handleDownload(devis)}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* tableau : grand écran */}
              <div className="hidden overflow-x-auto xl:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold text-slate-500">
                      <th className="px-6 py-3.5">Référence</th>
                      <th className="px-4 py-3.5">Type de devis</th>
                      <th className="px-4 py-3.5">Projet</th>
                      <th className="px-4 py-3.5">Client</th>
                      <th className="px-4 py-3.5">Date</th>
                      <th className="px-4 py-3.5 text-right">Montant</th>
                      <th className="px-4 py-3.5">Statut</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {pagedItems.map((devis) => {
                      const tone = toneFor(devis.type);
                      return (
                        <tr
                          key={devis.id}
                          onClick={() => navigate(`/admin/devis/${devis.id}`)}
                          className="group cursor-pointer border-t border-slate-100 transition-colors duration-150 hover:bg-slate-50/80"
                        >
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-800">
                              {devis.reference}
                            </span>
                          </td>
                          <td className="max-w-[18rem] px-4 py-4">
                            <div className="flex items-start gap-2.5">
                              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ring-4 ${tone.dot} ${tone.ring}`} />
                              <span className="line-clamp-2 text-[13px] leading-snug text-slate-600">{devis.type_label}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 font-semibold text-slate-900">{devis.project_name || '—'}</td>
                          <td className="px-4 py-4">
                            {devis.client_name ? (
                              <span className="inline-flex items-center gap-2.5">
                                <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-[11px] font-semibold text-white ring-2 ring-slate-100">
                                  {initials(devis.client_name)}
                                </span>
                                <span className="max-w-[10rem] truncate text-slate-700">{devis.client_name}</span>
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 tabular-nums text-slate-500">{formatDate(devis.devis_date)}</td>
                          <td className="whitespace-nowrap px-4 py-4 text-right font-semibold tabular-nums text-slate-900">
                            {formatMoney(devis.total_amount)}
                          </td>
                          <td className="px-4 py-4">
                            <StatusPill status={devis.status} />
                          </td>
                          <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <IconAction label="Voir" to={`/admin/devis/${devis.id}`}>
                                <Icon d={ICONS.eye} />
                              </IconAction>
                              <IconAction label="Modifier" to={`/admin/devis/${devis.id}/modifier`}>
                                <Icon d={ICONS.edit} />
                              </IconAction>
                              <IconAction
                                label="Télécharger le PDF"
                                primary
                                disabled={!devis.pdf_path || downloadingId === devis.id}
                                onClick={() => handleDownload(devis)}
                              >
                                {downloadingId === devis.id ? (
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                  <Icon d={ICONS.download} />
                                )}
                              </IconAction>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Pagination total={items.length} page={currentPage} pageSize={pageSize} onPage={setPage} onPageSize={setPageSize} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}