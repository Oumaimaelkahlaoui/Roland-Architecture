// Petits éléments d'interface partagés par les pages Devis

export function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/80 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 lg:px-10 lg:py-5">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end sm:gap-3">{actions}</div>}
    </header>
  );
}

const STATUS = {
  genere: { label: 'Généré', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
  brouillon: { label: 'Brouillon', className: 'bg-slate-100 text-slate-600 ring-slate-500/20', dot: 'bg-slate-400' },
};

export function StatusBadge({ status }) {
  const known = STATUS[status] || { label: status, className: 'bg-slate-50 text-slate-600 ring-slate-300/40', dot: 'bg-slate-300' };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${known.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${known.dot}`} />
      {known.label}
    </span>
  );
}

export function Spinner({ label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      {label}
    </span>
  );
}

export function Banner({ children, tone = 'error' }) {
  if (!children) return null;
  const tones = {
    error: 'bg-rose-50 border-rose-200 text-rose-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  };
  return <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${tones[tone]}`}>{children}</div>;
}

// PDF affiché dans le navigateur à partir d'un blob (aperçu ou PDF enregistré)
export function PdfViewer({ url, emptyLabel = 'Aucun PDF à afficher.' }) {
  if (!url) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 text-center text-sm text-slate-400">
        {emptyLabel}
      </div>
    );
  }
  return <iframe src={url} title="Devis PDF" className="h-full w-full rounded-2xl border border-slate-200 bg-white shadow-sm" />;
}

export const buttonPrimary =
  'inline-flex items-center justify-center rounded-xl bg-[#C9A96E] px-4 py-2.5 text-sm font-semibold text-[#1a1510] shadow-sm shadow-[#C9A96E]/30 transition-colors hover:bg-[#B8975A] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';
export const buttonSecondary =
  'inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';