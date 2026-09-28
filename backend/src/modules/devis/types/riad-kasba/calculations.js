const { round2 } = require("../../common/format");

// Calculs du devis "Riad Kasba", repris tels qu'ils figurent dans le PDF source :
//   p.5  231 m² × 5 000 MAD/m² = 1 155 000 MAD HT          (travaux)
//   p.5  1 155 000 MAD × 5 % = 57 750 MAD HT                (honoraires théoriques)
//   p.5/6 honoraires forfaitaires : montant SAISI (50 000), il n'est pas déduit du calcul ci-dessus
//   p.6  échéance = honoraires forfaitaires × pourcentage   (15 000 / 15 000 / 10 000 / 7 500 / 2 500)
function compute(values) {
  const travaux = round2(values.surface * values.cout_m2);
  const honorairesTheoriques = round2((travaux * values.taux_honoraires) / 100);

  const pourcentages = [1, 2, 3, 4, 5].map((n) => values[`pct${n}`]);
  const echeances = pourcentages.map((pct) => round2((values.forfait * pct) / 100));

  const totalEcheances = round2(echeances.reduce((sum, amount) => sum + amount, 0));
  const warnings = [];
  if (Math.abs(totalEcheances - values.forfait) > 0.005) {
    warnings.push(
      `La somme des échéances (${totalEcheances}) diffère du forfait (${values.forfait}) à cause des arrondis.`
    );
  }

  return {
    travaux,
    honoraires_theoriques: honorairesTheoriques,
    forfait: values.forfait,
    pourcentages,
    echeances,
    total_echeances: totalEcheances,
    warnings,
  };
}

module.exports = { compute };