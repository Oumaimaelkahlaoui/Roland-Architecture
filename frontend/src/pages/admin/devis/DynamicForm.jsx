// Formulaire piloté par le schéma d'un type de devis (groupes + champs fournis par l'API).
// Aucun champ n'est écrit en dur ici : chaque type de devis décrit les siens.

const inputBase =
  'w-full h-11 px-3.5 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4 focus:ring-[#C9A96E]/15 focus:border-[#C9A96E]/70';

function Field({ field, value, error, onChange }) {
  const id = `field-${field.key}`;
  const wide = field.label.length > 42 || (field.type === 'text' && (field.maxLength || 0) >= 80);

  if (field.type === 'boolean') {
    return (
      <div className="md:col-span-2" data-error={error ? 'true' : undefined}>
        <label htmlFor={id} className="flex cursor-pointer items-center gap-3">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(field.key, e.target.checked)}
            className="h-4 w-4 accent-[#C9A96E]"
          />
          <span className="text-sm font-medium text-slate-700">{field.label}</span>
        </label>
        {field.help && <p className="ml-7 mt-1 text-xs text-slate-400">{field.help}</p>}
        {error && <p className="ml-7 mt-1 text-xs font-medium text-rose-600">{error}</p>}
      </div>
    );
  }

  const isNumber = field.type === 'number' || field.type === 'integer';
  const input = (
    <input
      id={id}
      type={field.type === 'date' ? 'date' : 'text'}
      inputMode={field.type === 'integer' ? 'numeric' : field.type === 'number' ? 'decimal' : undefined}
      value={value}
      placeholder={field.placeholder || ''}
      maxLength={field.maxLength || undefined}
      onChange={(e) => onChange(field.key, e.target.value)}
      className={`${inputBase} ${error ? 'border-rose-400' : 'border-slate-200'} ${field.unit ? 'pr-24' : ''}`}
    />
  );

  return (
    <div className={wide ? 'md:col-span-2' : ''} data-error={error ? 'true' : undefined}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {field.label}
        {field.required && <span className="text-[#8A6A3B]"> *</span>}
      </label>
      {field.unit && isNumber ? (
        <div className="relative">
          {input}
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            {field.unit}
          </span>
        </div>
      ) : (
        input
      )}
      {field.help && <p className="mt-1 text-xs text-slate-400">{field.help}</p>}
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}

export default function DynamicForm({ groups, fields, values, errors, onChange }) {
  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const groupFields = fields.filter((field) => field.group === group.key);
        if (groupFields.length === 0) return null;
        return (
          <section
            key={group.key}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]"
          >
            <h3 className="border-b border-slate-100 bg-slate-50/60 px-6 py-4 text-sm font-semibold text-slate-900">{group.label}</h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-6 md:grid-cols-2">
              {groupFields.map((field) => (
                <Field key={field.key} field={field} value={values[field.key]} error={errors[field.key]} onChange={onChange} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}