import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { downloadBlob, fetchPdf, getDevis, getTypeSchema, regenerateDevis } from '../../../services/devis';
import RecapSections from './RecapSections';
import { devisFileName, formatDate, formatMoney } from './formatters';
import { Banner, PageHeader, PdfViewer, Spinner, StatusBadge, buttonPrimary, buttonSecondary } from './ui';

// Voir un devis : PDF enregistré + informations + calculs ; télécharger, modifier, régénérer
export default function DevisDetail() {
  const { id } = useParams();
  const [devis, setDevis] = useState(null);
  const [schema, setSchema] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfError, setPdfError] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState('');
  const pdfUrlRef = useRef(null);

  // Charge (ou recharge) le PDF enregistré dans le visualiseur
  const loadPdf = async (targetId) => {
    setPdfError('');
    try {
      const blob = await fetchPdf(targetId);
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
      const url = URL.createObjectURL(blob);
      pdfUrlRef.current = url;
      setPdfUrl(url);
    } catch (err) {
      setPdfUrl(null);
      setPdfError(err.message);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const loaded = await getDevis(id);
        const loadedSchema = await getTypeSchema(loaded.type).catch(() => null);
        if (cancelled) return;
        setDevis(loaded);
        setSchema(loadedSchema);
        if (loaded.pdf_path) await loadPdf(loaded.id);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => () => {
    if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
  }, []);

  const handleDownload = async () => {
    setBusy('download');
    setError('');
    try {
      downloadBlob(await fetchPdf(devis.id), devisFileName(devis));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const handleRegenerate = async () => {
    setBusy('regenerate');
    setError('');
    setMessage('');
    try {
      const updated = await regenerateDevis(devis.id);
      setDevis(updated);
      await loadPdf(updated.id);
      setMessage('Le PDF a été régénéré à partir des données enregistrées.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  if (!devis) {
    return (
      <>
        <PageHeader title="Devis" />
        <div className="p-10 space-y-4">
          <Banner>{error}</Banner>
          {error ? <Link to="/admin/devis" className={buttonSecondary}>← Retour aux devis</Link> : <p className="text-xs text-slate-400">Chargement…</p>}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`Devis ${devis.reference}`}
        subtitle={devis.type_label}
        actions={
          <>
            <Link to="/admin/devis" className={buttonSecondary}>← Historique</Link>
            <Link to={`/admin/devis/${devis.id}/modifier`} className={buttonSecondary}>Modifier</Link>
            <button onClick={handleRegenerate} disabled={busy !== ''} className={buttonSecondary}>
              {busy === 'regenerate' ? <Spinner label="Régénération…" /> : 'Régénérer le PDF'}
            </button>
            <button onClick={handleDownload} disabled={busy !== '' || !devis.pdf_path} className={buttonPrimary}>
              {busy === 'download' ? <Spinner label="Téléchargement…" /> : 'Télécharger le PDF'}
            </button>
          </>
        }
      />

      <div className="p-10 space-y-4">
        <Banner>{error}</Banner>
        <Banner tone="success">{message}</Banner>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          <div className="h-[80vh] xl:sticky xl:top-4">
            <PdfViewer url={pdfUrl} emptyLabel={pdfError || 'Le PDF n’a pas encore été généré.'} />
          </div>

          <div className="space-y-6">
            <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
              <h3 className="px-6 py-4 border-b border-slate-100 text-sm font-bold text-slate-800">Devis enregistré</h3>
              <dl className="divide-y divide-slate-100 text-xs">
                <div className="px-6 py-3 flex justify-between gap-6"><dt className="text-slate-500">Statut</dt><dd><StatusBadge status={devis.status} /></dd></div>
                <div className="px-6 py-3 flex justify-between gap-6"><dt className="text-slate-500">Projet</dt><dd className="font-semibold text-slate-800">{devis.project_name || '—'}</dd></div>
                <div className="px-6 py-3 flex justify-between gap-6"><dt className="text-slate-500">Client</dt><dd className="font-semibold text-slate-800">{devis.client_name || '—'}</dd></div>
                <div className="px-6 py-3 flex justify-between gap-6"><dt className="text-slate-500">Date du devis</dt><dd className="font-semibold text-slate-800">{formatDate(devis.devis_date)}</dd></div>
                <div className="px-6 py-3 flex justify-between gap-6"><dt className="text-slate-500">Montant</dt><dd className="font-bold text-slate-900">{formatMoney(devis.total_amount)} HT</dd></div>
                <div className="px-6 py-3 flex justify-between gap-6"><dt className="text-slate-500">Créé le</dt><dd className="font-semibold text-slate-800">{new Date(devis.created_at).toLocaleString('fr-FR')}</dd></div>
                <div className="px-6 py-3 flex justify-between gap-6"><dt className="text-slate-500">Dernière modification</dt><dd className="font-semibold text-slate-800">{new Date(devis.updated_at).toLocaleString('fr-FR')}</dd></div>
              </dl>
            </section>

            {schema && devis.data && <RecapSections schema={schema} values={devis.data} recap={devis.recap} />}
          </div>
        </div>
      </div>
    </>
  );
}