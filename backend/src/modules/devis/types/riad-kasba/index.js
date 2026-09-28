const { describeFields, validateFields, todayIso } = require('../../common/fields');
const { formatNumber, formatDateFr, numberToFrenchWords } = require('../../common/format');
const { compute } = require('./calculations');
const layout = require('./layout');

// Intitulé tiré de la couverture (p.1 « DEVIS RIAD KASBA ») et de la case MISSION (p.3)
const label = 'Devis — Riad (conception + autorisation + DCE + suivi, honoraires forfaitaires)';

const groups = [
  { key: 'general', label: 'Informations générales' },
  { key: 'mission', label: 'Mission' },
  { key: 'honoraires', label: 'Honoraires' },
  { key: 'echeancier', label: 'Échéancier de paiement' },
  { key: 'client', label: 'Client' },
];

// Les valeurs par défaut reprennent exactement le texte du PDF source.
const fields = [
  { key: 'date_devis', label: 'Date du devis', type: 'date', required: true, group: 'general',
    default: todayIso, help: 'Imprimée en bas de la couverture (JJ/MM/AAAA).' },
  { key: 'project_name', label: 'Nom du projet', type: 'text', required: true, group: 'general', maxLength: 60,
    placeholder: 'RIAD KASBA', help: 'Imprimé en majuscules sur la couverture après « DEVIS ».' },
  { key: 'project_type', label: 'Type de projet', type: 'text', required: true, group: 'general', maxLength: 40,
    default: 'Riad', help: 'Utilisé dans la phrase « Pour ce projet de … » (p. 3).' },
  { key: 'localisation', label: 'Localisation', type: 'text', required: true, group: 'general', maxLength: 60,
    placeholder: 'Méchouar - Kasbah' },

  { key: 'mission', label: 'Mission', type: 'text', required: true, group: 'mission', maxLength: 80,
    default: 'Conception + autorisation + DCE + suivi' },
  { key: 'duree', label: 'Durée de conception', type: 'text', required: true, group: 'mission', maxLength: 40,
    default: 'Environ 3 mois' },
  { key: 'surface', label: 'Surface totale d’étude', type: 'number', required: true, group: 'mission',
    exclusiveMin: 0, unit: 'm²' },
  { key: 'validite_jours', label: 'Validité de l’offre', type: 'integer', required: true, group: 'mission',
    default: 30, min: 1, max: 365, unit: 'jours',
    help: 'Reprise en lettres dans l’article 6 des conditions particulières (p. 7).' },

  { key: 'cout_m2', label: 'Coût prévisionnel de construction', type: 'number', required: true,
    group: 'honoraires', exclusiveMin: 0, unit: 'MAD HT / m²' },
  { key: 'taux_honoraires', label: 'Taux d’honoraires', type: 'number', required: true, group: 'honoraires',
    default: 5, min: 0, max: 100, unit: '%' },
  { key: 'forfait', label: 'Honoraires forfaitaires', type: 'number', required: true, group: 'honoraires',
    exclusiveMin: 0, unit: 'MAD HT',
    help: 'Montant saisi : le PDF source ne précise pas comment il est déduit du taux.' },

  { key: 'pct1', label: '1. À la signature du contrat', type: 'number', required: true, group: 'echeancier',
    default: 30, min: 0, max: 100, unit: '%' },
  { key: 'pct2', label: '2. À la présentation de la plaquette architecturale et des perspectives 3D',
    type: 'number', required: true, group: 'echeancier', default: 30, min: 0, max: 100, unit: '%' },
  { key: 'pct3', label: '3. À la présentation du DCE et du projet d’exécution', type: 'number', required: true,
    group: 'echeancier', default: 20, min: 0, max: 100, unit: '%' },
  { key: 'pct4', label: '4. Au démarrage du suivi architectural des travaux', type: 'number', required: true,
    group: 'echeancier', default: 15, min: 0, max: 100, unit: '%' },
  { key: 'pct5', label: '5. À la réception des travaux', type: 'number', required: true, group: 'echeancier',
    default: 5, min: 0, max: 100, unit: '%' },

  { key: 'client_name', label: 'Client (maître d’ouvrage)', type: 'text', group: 'client', maxLength: 120,
    help: 'Absent du PDF source. Enregistré dans l’historique ; imprimé seulement si la case ci-dessous est cochée.' },
  { key: 'show_client', label: 'Afficher le client sur le PDF', type: 'boolean', group: 'client', default: false,
    help: 'Ajoute la ligne « Maître d’ouvrage : … » sous « OBJET DU DEVIS » (p. 3).' },
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
    project_name_upper: values.project_name.toLocaleUpperCase('fr'),
    project_type: values.project_type,
    mission: values.mission,
    duree: values.duree,
    surface: formatNumber(values.surface),
    localisation: values.localisation,
    validite: String(values.validite_jours),
    validite_lettres: numberToFrenchWords(values.validite_jours),
    jours: values.validite_jours > 1 ? "jours" : "jour",
    cout_m2: formatNumber(values.cout_m2),
    taux: formatNumber(values.taux_honoraires),
    travaux: formatNumber(calc.travaux),
    honoraires_theoriques: formatNumber(calc.honoraires_theoriques),
    forfait: formatNumber(values.forfait),
    client: values.client_name || '',
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
      title: 'Estimation des travaux et des honoraires',
      rows: [
        { label: 'Surface × coût prévisionnel', value: `${formatNumber(values.surface)} m² × ${formatNumber(values.cout_m2)} MAD/m²` },
        { label: 'Montant estimatif des travaux', value: `${formatNumber(calc.travaux)} MAD HT` },
        { label: `Honoraires théoriques (au taux de ${formatNumber(values.taux_honoraires)} %)`, value: `${formatNumber(calc.honoraires_theoriques)} MAD HT` },
        {
          label: 'Honoraires forfaitaires retenus', value: `${formatNumber(values.forfait)} MAD HT`, strong: true,
          note: 'Montant réellement facturé (forfait préférentiel, non déduit du calcul théorique ci-dessus).',
        },
      ],
    },
    {
      title: 'Échéancier de paiement',
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
  id: 'riad-kasba',
  label,
  groups,
  fields,
  layout,
  validate,
  compute,
  buildTokens,
  buildFlags,
  buildRecap,
  totalAmount: (calc) => calc.forfait,
  projectName: (values) => values.project_name,
  clientName: (values) => values.client_name || null,
  devisDate: (values) => values.date_devis,
  describe() {
    return { id: 'riad-kasba', label, groups, fields: describeFields(fields) };
  },
};