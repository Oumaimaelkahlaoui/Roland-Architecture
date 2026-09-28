const { round2 } = require("../../common/format");

// Calculs du devis "Bab Taghzout", repris tels qu'ils figurent dans le PDF source (p.6, p.7) :
//   p.6  (116 m² × 2,60) + 10 m² = 311,60 m²                    (surface de référence)
//   p.6  311,60 m² × 4 000 MAD = 1 246 400 MAD HT                (travaux)
//   p.6  1 246 400 MAD × 5 % = 62 320 MAD HT                     (honoraires architecte)
//   p.6  2 000 + 3 000 + 7 000 + 3 000 = 15 000 MAD HT            (total BET)
//   p.6  62 320 + 15 000 + 3 000 = 80 320 MAD HT                  (total général)
//   p.7  échéance architecte = honoraires × pourcentage           (18 696 / 12 464 ×3 / 6 232)
//   p.7  12 000 MAD HT (stabilité + sécurité + béton armé) + 3 000 MAD HT (suivi) = 15 000 MAD HT
function compute(values) {
  const surfaceRef = round2(values.surface * values.coef_surface + values.coef_constante);
  const travaux = round2(surfaceRef * values.cout_m2);
  const honoraires = round2((travaux * values.taux_honoraires) / 100);

  const betTotal = round2(
    values.bet_stabilite + values.bet_securite + values.bet_beton + values.bet_suivi
  );
  const betPremiereTranche = round2(values.bet_stabilite + values.bet_securite + values.bet_beton);
  const totalGeneral = round2(honoraires + betTotal + values.topographe);

  const pourcentages = [1, 2, 3, 4, 5].map((n) => values[`pct${n}`]);
  const echeances = pourcentages.map((pct) => round2((honoraires * pct) / 100));
  const totalEcheances = round2(echeances.reduce((sum, amount) => sum + amount, 0));

  const warnings = [];
  if (Math.abs(totalEcheances - honoraires) > 0.005) {
    warnings.push(
      `La somme des échéances (${totalEcheances}) diffère des honoraires architecte (${honoraires}) à cause des arrondis.`
    );
  }

  return {
    surface_ref: surfaceRef,
    travaux,
    honoraires,
    bet_total: betTotal,
    bet_premiere_tranche: betPremiereTranche,
    bet_suivi: values.bet_suivi,
    topographe: values.topographe,
    total_general: totalGeneral,
    pourcentages,
    echeances,
    total_echeances: totalEcheances,
    warnings,
  };
}

module.exports = { compute };