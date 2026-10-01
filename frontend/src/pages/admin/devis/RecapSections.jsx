import { formatFieldValue } from './formatters';

// Récapitulatif d'un devis : calculs fournis par le type de devis, puis informations saisies (par groupe)
export default function RecapSections({ schema, values, recap = [] }) {
  const inputGroups = schema.groups
    .map((group) => ({ group, fields: schema.fields.filter((field) => field.group === group.key) }))
    .filter(({ fields }) => fields.length > 0);

  return (
    <div className="space-y-6">
      {recap.map((section) => (
        <section
          key={section.title}
          className="relative overflow-hidden rounded-2xl bg-black text-white shadow-xl shadow-black/15 ring-1 ring-white/10"
        >
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#C9A96E]/25 blur-3xl" />
          <h3 className="relative border-b border-white/10 px-6 py-4 text-sm font-semibold text-white">{section.title}</h3>
          <dl className="relative divide-y divide-white/10">
            {section.rows.map((row) => (
              <div key={row.label} className="flex justify-between gap-6 px-6 py-3 text-sm">
                <dt className="text-slate-400">
                  {row.label}
                  {row.note && <span className="mt-0.5 block text-xs text-slate-500">{row.note}</span>}
                </dt>
                <dd className={`text-right tabular-nums ${row.strong ? 'text-base font-bold text-[#E6CFA0]' : 'font-medium text-slate-100'}`}>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      {inputGroups.map(({ group, fields }) => (
        <section
          key={group.key}
          className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]"
        >
          <h3 className="border-b border-slate-100 bg-slate-50/60 px-6 py-4 text-sm font-semibold text-slate-900">{group.label}</h3>
          <dl className="divide-y divide-slate-100">
            {fields.map((field) => (
              <div key={field.key} className="flex justify-between gap-6 px-6 py-3 text-sm">
                <dt className="text-slate-500">{field.label}</dt>
                <dd className="text-right font-medium text-slate-900">{formatFieldValue(field, values[field.key])}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}