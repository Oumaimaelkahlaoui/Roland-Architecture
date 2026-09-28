const { describeFields, validateFields, todayIso } = require('../../common/fields');
const { formatNumber, formatFixed, formatDateFr, numberToFrenchWords } = require('../../common/format');
const { compute } = require('./calculations');
const layout = require('./layout');

// Intitulé tiré de la couverture (p.1)
const label = 'Devis d’honoraires — Réaménagement d’une maison existante en maison d’hôtes 2 étoiles';

const groups = [
  { key: 'general', label: 'Informations générales' },
  { key: 'mission', label: 'Mission' },
  { key: 'honoraires', label: 'Honoraires' },
  { key: 'echeancier', label: 'Échéancier de paiement (architecte)' },
  { key: 'client', label: 'Client' },
];

// Les valeurs par défaut reprennent exactement le texte du PDF source.
const fields = [
  { key: 'date_devis', label: 'Date du devis', type: 'date', required: true, group: 'general',
    default: todayIso, help: 'Imprimée en bas de la couverture (JJ/MM/AAAA).' },
  { key: 'nom_projet', label: 'Nom du projet', type: 'text', required: true, group: 'general', maxLength: 60,
    default: 'Bab Taghzout', help: 'Utilisé dans la phrase « Pour ce projet de … » (p. 2).' },
  { key: 'cover_nature', label: 'Nature du projet (couverture)', type: 'text', required: true, group: 'general',
    maxLength: 140, default: 'RÉAMÉNAGEMENT D’UNE MAISON EXISTANTE EN MAISON D’HÔTES 2 ÉTOILES',
    help: 'Titre de la couverture (p. 1), en majuscules, sur 2 à 3 lignes. Un texte beaucoup plus long débordera visuellement.' },
  { key: 'cover_localisation', label: 'Localisation (couverture)', type: 'text', required: true, group: 'general',
    maxLength: 80, default: 'BAB TAGHZOUT - MÉDINA DE MARRAKECH',
    help: 'Sous-titre de la couverture (p. 1), en majuscules.' },
  { key: 'localisation_case', label: 'Localisation', type: 'text', required: true, group: 'general', maxLength: 60,
    default: 'Bab Taghzout - Marrakech', help: 'Case « LOCALISATION » (p. 3) — libellé différent de celui de la couverture.' },

  { key: 'mission', label: 'Mission', type: 'text', required: true, group: 'mission', maxLength: 100,
    default: 'Architecture + intérieur + autorisation + exécution + suivi' },
  { key: 'duree', label: 'Durée de conception', type: 'text', required: true, group: 'mission', maxLength: 40,
    default: 'Environ 3 mois' },
  { key: 'surface', label: 'Surface au sol', type: 'number', required: true, group: 'mission',
    exclusiveMin: 0, unit: 'm²' },
  { key: 'validite_jours', label: 'Validité de l’offre', type: 'integer', required: true, group: 'mission',
    default: 30, min: 1, max: 365, unit: 'jours',
    help: 'Reprise en lettres dans l’article 6 des conditions particulières (p. 8).' },

  { key: 'cout_m2', label: 'Coût prévisionnel de construction', type: 'number', required: true,
    group: 'honoraires', exclusiveMin: 0, unit: 'MAD HT / m²' },
  { key: 'taux_honoraires', label: 'Taux d’honoraires (architecte)', type: 'number', required: true,
    group: 'honoraires', default: 5, min: 0, max: 100, unit: '%' },
  { key: 'coef_surface', label: 'Coefficient de la surface au sol', type: 'number', required: true,
    group: 'honoraires', default: 2.6, exclusiveMin: 0,
    help: 'Multiplie la surface au sol dans le calcul de la surface de référence (p. 6). Le PDF source n’explique pas son origine.' },
  { key: 'coef_constante', label: 'Constante additive', type: 'number', required: true, group: 'honoraires',
    default: 10, min: 0, unit: 'm²',
    help: 'S’ajoute après multiplication par le coefficient ci-dessus (p. 6).' },
  { key: 'bet_stabilite', label: 'BET — Attestation de stabilité', type: 'number', required: true,
    group: 'honoraires', default: 2000, exclusiveMin: 0, unit: 'MAD HT' },
  { key: 'bet_securite', label: 'BET — Notice de sécurité', type: 'number', required: true, group: 'honoraires',
    default: 3000, exclusiveMin: 0, unit: 'MAD HT' },
  { key: 'bet_beton', label: 'BET — Étude et plans de béton armé', type: 'number', required: true,
    group: 'honoraires', default: 7000, exclusiveMin: 0, unit: 'MAD HT' },
  { key: 'bet_suivi', label: 'BET — Suivi des ouvrages structurels', type: 'number', required: true,
    group: 'honoraires', default: 3000, exclusiveMin: 0, unit: 'MAD HT' },
  { key: 'topographe', label: 'Honoraires du géomètre-topographe', type: 'number', required: true,
    group: 'honoraires', default: 3000, exclusiveMin: 0, unit: 'MAD HT' },

  { key: 'pct1', label: '1. À la signature du contrat', type: 'number', required: true, group: 'echeancier',
    default: 30, min: 0, max: 100, unit: '%' },
  { key: 'pct2', label: '2. À l’obtention des avis favorables', type: 'number', required: true,
    group: 'echeancier', default: 20, min: 0, max: 100, unit: '%' },
  { key: 'pct3', label: '3. Au démarrage du chantier et à la remise des principaux documents d’exécution',
    type: 'number', required: true, group: 'echeancier', default: 20, min: 0, max: 100, unit: '%' },
  { key: 'pct4', label: '4. À la fin du gros œuvre', type: 'number', required: true, group: 'echeancier',
    default: 20, min: 0, max: 100, unit: '%' },
  { key: 'pct5', label: '5. À la réception définitive et à l’obtention du document de conformité',
    type: 'number', required: true, group: 'echeancier', default: 10, min: 0, max: 100, unit: '%' },

  { key: 'client_name', label: 'Maîtres d’ouvrage', type: 'text', required: true, group: 'client', maxLength: 160,
    default: 'M. Damien Duval / Mme Emilie Chatelain' },
  { key: 'show_client', label: 'Afficher le client sur le PDF', type: 'boolean', group: 'client', default: true,
    help: 'Ajoute la ligne « Maîtres d’ouvrage : … » sous « OBJET DU DEVIS » (p. 3).' },
  { key: 'reference_fonciere', label: 'Référence foncière', type: 'text', required: true, group: 'client',
    maxLength: 60, default: 'TF n° 04/85950', help: 'Toujours imprimée (p. 3), à la différence du client.' },
];

function validate(input) {
  const result = validateFields(fields, input);
  const { values, errors } = result;

  const pctKeys = ['pct1', 'pct2', 'pct3', 'pct4', 'pct5'];
  if (pctKeys.every((key) => typeof values[key] === 'number')) {
    const total = pctKeys.reduce((sum, key) => sum + values[key], 0);
    if (Math.abs(total - 100) > 0.001) {
      errors.push({ key: 'pct1', message: `Les pourcentages de l’échéancier doivent totaliser 100 % (actuellement ${formatNumber(total)} %).` });
    }
  }
  if (values.show_client && !values.client_name) {
    errors.push({ key: 'client_name', message: 'Renseignez le client pour l’afficher sur le PDF.' });
  }

  return { ok: errors.length === 0, values, errors };
}

// Valeurs imprimées dans le PDF, formatées comme dans le document source
function buildTokens(values, calc) {
  const tokens = {
    date: formatDateFr(values.date_devis),
    nom_projet: values.nom_projet,
    cover_nature: values.cover_nature.toLocaleUpperCase('fr'),
    cover_localisation: values.cover_localisation.toLocaleUpperCase('fr'),
    mission: values.mission,
    duree: values.duree,
    surface: formatNumber(values.surface),
    localisation_case: values.localisation_case,
    validite: String(values.validite_jours),
    validite_lettres: numberToFrenchWords(values.validite_jours),
    jours: values.validite_jours > 1 ? 'jours' : 'jour',
    cout_m2: formatNumber(values.cout_m2),
    taux: formatNumber(values.taux_honoraires),
    coef_surface: formatFixed(values.coef_surface, 2),
    coef_constante: formatNumber(values.coef_constante),
    surface_ref: formatFixed(calc.surface_ref, 2),
    travaux: formatNumber(calc.travaux),
    honoraires: formatNumber(calc.honoraires),
    bet_stabilite: formatNumber(values.bet_stabilite),
    bet_securite: formatNumber(values.bet_securite),
    bet_beton: formatNumber(values.bet_beton),
    bet_suivi: formatNumber(values.bet_suivi),
    bet_total: formatNumber(calc.bet_total),
    bet_premiere_tranche: formatNumber(calc.bet_premiere_tranche),
    topographe: formatNumber(values.topographe),
    total_general: formatNumber(calc.total_general),
    client: values.client_name || '',
    reference_fonciere: values.reference_fonciere,
  };
  calc.pourcentages.forEach((pct, index) => {
    tokens[`pct${index + 1}`] = formatNumber(pct);
    tokens[`ech${index + 1}`] = formatNumber(calc.echeances[index]);
  });
  return tokens;
}

function buildRecap(values, calc) {
  return [
    {
      title: 'Surface de référence',
      rows: [
        { label: 'Surface au sol × coefficient', value: `${formatNumber(values.surface)} m² × ${formatFixed(values.coef_surface, 2)}` },
        { label: 'Surface de référence ((surface × coefficient) + constante)', value: `${formatFixed(calc.surface_ref, 2)} m²`, strong: true },
      ],
    },
    {
      title: 'Estimation des travaux et honoraires',
      rows: [
        { label: 'Surface de référence × coût prévisionnel', value: `${formatFixed(calc.surface_ref, 2)} m² × ${formatNumber(values.cout_m2)} MAD/m²` },
        { label: 'Montant estimatif des travaux', value: `${formatNumber(calc.travaux)} MAD HT` },
        { label: `Honoraires architecte (au taux de ${formatNumber(values.taux_honoraires)} %)`, value: `${formatNumber(calc.honoraires)} MAD HT`, strong: true },
      ],
    },
    {
      title: 'Bureau d’études techniques (BET)',
      rows: [
        { label: 'Attestation de stabilité', value: `${formatNumber(values.bet_stabilite)} MAD HT` },
        { label: 'Notice de sécurité', value: `${formatNumber(values.bet_securite)} MAD HT` },
        { label: 'Étude et plans de béton armé', value: `${formatNumber(values.bet_beton)} MAD HT` },
        { label: 'Suivi des ouvrages structurels', value: `${formatNumber(values.bet_suivi)} MAD HT` },
        { label: 'Total BET', value: `${formatNumber(calc.bet_total)} MAD HT`, strong: true },
      ],
    },
    {
      title: 'Récapitulatif général',
      rows: [
        { label: 'Architecte', value: `${formatNumber(calc.honoraires)} MAD HT` },
        { label: 'Bureau d’études', value: `${formatNumber(calc.bet_total)} MAD HT` },
        { label: 'Topographe', value: `${formatNumber(values.topographe)} MAD HT` },
        { label: 'Total général', value: `${formatNumber(calc.total_general)} MAD HT`, strong: true },
      ],
    },
    {
      title: 'Échéancier de paiement (architecte)',
      rows: calc.echeances.map((montant, index) => ({
        label: `${index + 1}. ${formatNumber(calc.pourcentages[index])} %`,
        value: `${formatNumber(montant)} MAD HT`,
      })),
    },
  ];
}
function buildFlags(values) {
  return { show_client: Boolean(values.show_client && values.client_name) };
}

module.exports = {
  id: 'bab-taghzout',
  label,
  groups,
  fields,
  layout,
  validate,
  compute,
  buildTokens,
  buildFlags,
  buildRecap,
  totalAmount: (calc) => calc.total_general,
  projectName: (values) => values.nom_projet,
  clientName: (values) => values.client_name || null,
  devisDate: (values) => values.date_devis,
  describe() {
    return { id: 'bab-taghzout', label, groups, fields: describeFields(fields) };
  },
};