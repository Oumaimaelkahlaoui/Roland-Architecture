// Client de l'API /api/devis (le token JWT est celui stocké à la connexion : localStorage "token")
const BASE = '/api/devis';

export class ApiError extends Error {
  constructor(message, { status = 0, errors = [] } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Session expirée ou token invalide : retour à la page de connexion
function handleAuthFailure(status) {
  if (status === 401 || status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  }
}

async function request(path, { method = 'GET', body, blob = false } = {}) {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers: { ...authHeaders(), ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Impossible de joindre le serveur.');
  }

  if (!response.ok) {
    handleAuthFailure(response.status);
    const payload = await response.json().catch(() => ({}));
    throw new ApiError(payload.message || 'Une erreur est survenue.', {
      status: response.status,
      errors: payload.errors || [],
    });
  }

  if (blob) return response.blob();
  const payload = await response.json();
  return payload.data;
}

export const listTypes = () => request('/types');
export const getTypeSchema = (typeId) => request(`/types/${encodeURIComponent(typeId)}`);

export function listDevis({ q = '', type = '' } = {}) {
  const params = new URLSearchParams();
  if (q.trim()) params.set('q', q.trim());
  if (type) params.set('type', type);
  const query = params.toString();
  return request(query ? `/?${query}` : '/');
}

export const getDevis = (id) => request(`/${id}`);

// Récapitulatif : validation + calculs (sans PDF)
export const previewDevis = (type, data) => request('/preview', { method: 'POST', body: { type, data } });
// Aperçu : PDF complet (blob), rien n'est enregistré
export const previewPdf = (type, data) => request('/preview/pdf', { method: 'POST', body: { type, data }, blob: true });

export const createDevis = (type, data) => request('/', { method: 'POST', body: { type, data } });
export const updateDevis = (id, data) => request(`/${id}`, { method: 'PUT', body: { data } });
export const regenerateDevis = (id) => request(`/${id}/regenerate`, { method: 'POST' });
export const fetchPdf = (id) => request(`/${id}/pdf`, { blob: true });

export function downloadBlob(blob, fileName) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}