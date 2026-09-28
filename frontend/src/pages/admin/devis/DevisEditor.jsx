import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createDevis, downloadBlob, fetchPdf, getDevis, getTypeSchema, previewDevis, previewPdf, updateDevis,
} from '../../../services/devis';
import DynamicForm from './DynamicForm';
import RecapSections from './RecapSections';
import { initialValues, toPayload } from './formValues';
import { Banner, PageHeader, PdfViewer, Spinner, buttonPrimary, buttonSecondary } from './ui';

const STEPS = [
  { key: 'form', label: '1. Informations' },
  { key: 'recap', label: '2. Récapitulatif' },
  { key: 'preview', label: '3. Aperçu' },
];

function Stepper({ current }) {
  const index = STEPS.findIndex((step) => step.key === current);
  return (
    <ol className="flex gap-2 text-[11px] font-bold uppercase tracking-wider">
      {STEPS.map((step, i) => (
        <li
          key={step.key}
          className={`px-3 py-1.5 rounded-full border ${
            i === index ? '   bg-sky-600 border-sky-600 text-white' : i < index ? '   bg-sky-50 border-sky-200 text-sky-700' : 'bg-white border-slate-200 text-slate-400'
          }`}
        >
          {step.label}
        </li>
      ))}
    </ol>
  );
}

// Création (/admin/devis/nouveau/:type) et modification (/admin/devis/:id/modifier) d'un devis :
// formulaire → récapitulatif (calculs) → aperçu PDF → enregistrement
export default function DevisEditor() {
  const { type: typeParam, id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [schema, setSchema] = useState(null);
  const [reference, setReference] = useState('');
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState('form');
  const [recap, setRecap] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [busy, setBusy] = useState('');
  const [banner, setBanner] = useState('');
  const [loadError, setLoadError] = useState('');

  const pdfKey = useRef('');
  const pdfUrlRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (editing) {
          const devis = await getDevis(id);
          const loaded = await getTypeSchema(devis.type);
          if (cancelled) return;
          setSchema(loaded);
          setReference(devis.reference);
          setValues(initialValues(loaded.fields, devis.data));
        } else {
          const loaded = await getTypeSchema(typeParam);
          if (cancelled) return;
          setSchema(loaded);
          setValues(initialValues(loaded.fields));
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [editing, id, typeParam]);

  useEffect(() => {
    pdfUrlRef.current = pdfUrl;
  }, [pdfUrl]);
  useEffect(() => () => {
    if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
  }, []);

  const scrollTop = () => document.getElementById('devis-scroll-top')?.scrollIntoView({ behavior: 'smooth' });

  const handleChange = (key, value) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  // Erreurs de validation du serveur : affichées sous les champs concernés
  const showError = (err) => {
    if (err.errors && err.errors.length > 0) {
      const byField = {};
      err.errors.forEach((e) => { if (!byField[e.key]) byField[e.key] = e.message; });
      setErrors(byField);
      setStep('form');
      setBanner('Certains champs doivent être corrigés (en rouge ci-dessous).');
      setTimeout(() => document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    } else {
      setBanner(err.message);
    }
  };

  const goRecap = async () => {
    setBusy('recap');
    setBanner('');
    try {
      const result = await previewDevis(schema.id, toPayload(schema.fields, values));
      setRecap(result);
      setErrors({});
      setStep('recap');
      scrollTop();
    } catch (err) {
      showError(err);
    } finally {
      setBusy('');
    }
  };

  const goPreview = async () => {
    const payload = toPayload(schema.fields, values);
    const key = JSON.stringify(payload);
    if (pdfUrl && pdfKey.current === key) {
      setStep('preview');
      return;
    }
    setBusy('pdf');
    setBanner('');
    try {
      const blob = await previewPdf(schema.id, payload);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      pdfKey.current = key;
      setPdfUrl(URL.createObjectURL(blob));
      setStep('preview');
      scrollTop();
    } catch (err) {
      showError(err);
    } finally {
      setBusy('');
    }
  };

  const save = async (download) => {
    setBusy('save');
    setBanner('');
    try {
      const payload = toPayload(schema.fields, values);
      const devis = editing ? await updateDevis(id, payload) : await createDevis(schema.id, payload);
      if (download) downloadBlob(await fetchPdf(devis.id), `Devis_${devis.reference}.pdf`);
      navigate(`/admin/devis/${devis.id}`);
    } catch (err) {
      showError(err);
    } finally {
      setBusy('');
    }
  };

  const backTo = editing ? `/admin/devis/${id}` : '/admin/devis/nouveau';

  if (loadError) {
    return (
      <>
        <PageHeader title={editing ? 'Modifier le devis' : 'Nouveau devis'} />
        <div className="p-10 space-y-4">
          <Banner>{loadError}</Banner>
          <Link to="/admin/devis" className={buttonSecondary}>← Retour aux devis</Link>
        </div>
      </>
    );
  }

  if (!schema) {
    return (
      <>
        <PageHeader title={editing ? 'Modifier le devis' : 'Nouveau devis'} />
        <p className="p-10 text-xs text-slate-400">Chargement…</p>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={editing ? `Modifier le devis ${reference}` : 'Nouveau devis'}
        subtitle={schema.label}
        actions={<Link to={backTo} className={buttonSecondary}>Annuler</Link>}
      />

      <div className="p-10 space-y-6 max-w-5xl">
        <span id="devis-scroll-top" />
        <Stepper current={step} />
        <Banner>{banner}</Banner>

        {step === 'form' && (
          <>
            <DynamicForm groups={schema.groups} fields={schema.fields} values={values} errors={errors} onChange={handleChange} />
            <div className="flex justify-end">
              <button onClick={goRecap} disabled={busy !== ''} className={buttonPrimary}>
                {busy === 'recap' ? <Spinner label="Calcul…" /> : 'Continuer →'}
              </button>
            </div>
          </>
        )}

        {step === 'recap' && recap && (
          <>
            {recap.warnings.length > 0 && <Banner tone="warning">{recap.warnings.join(' ')}</Banner>}
            <RecapSections schema={schema} values={recap.values} recap={recap.recap} />
            <div className="flex justify-between">
              <button onClick={() => setStep('form')} disabled={busy !== ''} className={buttonSecondary}>← Modifier les informations</button>
              <button onClick={goPreview} disabled={busy !== ''} className={buttonPrimary}>
                {busy === 'pdf' ? <Spinner label="Génération de l’aperçu…" /> : 'Voir l’aperçu du devis →'}
              </button>
            </div>
          </>
        )}

        {step === 'preview' && (
          <>
            <div className="h-[72vh]">
              <PdfViewer url={pdfUrl} />
            </div>
            <div className="flex flex-wrap justify-between gap-3">
              <button onClick={() => setStep('recap')} disabled={busy !== ''} className={buttonSecondary}>← Retour au récapitulatif</button>
              <div className="flex gap-3">
                <button onClick={() => save(false)} disabled={busy !== ''} className={buttonSecondary}>
                  {busy === 'save' ? <Spinner label="Enregistrement…" /> : 'Enregistrer'}
                </button>
                <button onClick={() => save(true)} disabled={busy !== ''} className={buttonPrimary}>
                  {busy === 'save' ? <Spinner label="Enregistrement…" /> : 'Enregistrer et télécharger le PDF'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}