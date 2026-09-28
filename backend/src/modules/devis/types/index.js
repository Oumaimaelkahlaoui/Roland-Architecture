// Registre des types de devis.
// Chaque type expose : id, label, fields, validate, compute, buildTokens, layout...
// Étape 2 : Riad Kasba. Étape 4 : Maison d'hôtes Bab Taghzout.
const rawTypes = [require("./riad-kasba"), require("./bab-taghzout")];

const types = Object.fromEntries(rawTypes.map((type) => [type.id, type]));

function listTypes() {
  return Object.values(types).map(({ id, label }) => ({ id, label }));
}

function getType(id) {
  return types[id] || null;
}

module.exports = { listTypes, getType };