import { useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';

// Coque du tableau de bord : barre latérale noire (tiroir sur mobile) + contenu
const NAV = [
  {
    to: '/admin/devis',
    label: 'Devis',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
];

function readUser() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = user.name || user.nom || user.username || user.email || 'Administrateur';
    return { name, email: user.email || '' };
  } catch {
    return { name: 'Administrateur', email: '' };
  }
}

function initials(name) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'A';
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Échap ferme le menu sur mobile
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!localStorage.getItem('token')) {
    return <Navigate to="/admin/login" replace />;
  }

  const user = readUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F5F8] font-sans text-slate-900 antialiased">
      {/* fond sombre derrière le menu (mobile) */}
      {open && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 transform flex-col justify-between overflow-hidden bg-black px-4 py-6 text-slate-400 transition-transform duration-300 ease-out lg:static lg:w-64 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div aria-hidden className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-[#C9A96E]/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-px bg-white/10" />

        <div className="relative">
          {/* marque */}
          <div className="mb-9 flex items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] p-2 ring-1 ring-white/10">
                <img src="/logo/logo-mark-dark.png" alt="Logo" className="h-full w-full object-contain opacity-95 invert" />
              </div>
              <div className="leading-tight">
                <h2 className="text-[13px] font-semibold tracking-wide text-white">Roland Architecture</h2>
                <span className="text-xs text-slate-500">Espace administrateur</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white lg:hidden"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <p className="mb-2 px-3 text-xs font-medium text-slate-600">Gestion</p>
          <nav className="space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/[0.07] text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute -left-4 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#C9A96E]" />}
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-lg ring-1 transition-colors ${
                        isActive
                          ? 'bg-[#C9A96E]/15 text-[#E6CFA0] ring-[#C9A96E]/40'
                          : 'bg-white/[0.04] text-slate-500 ring-white/10 group-hover:text-slate-300'
                      }`}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </span>
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* profil + déconnexion */}
        <div className="relative space-y-3">
          <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#C9A96E] to-[#8A6A3B] text-xs font-semibold text-[#1a1510]">
              {initials(user.name)}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              {user.email && user.email !== user.name && <p className="truncate text-xs text-slate-500">{user.email}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04] ring-1 ring-white/10 transition-colors group-hover:bg-rose-500/15 group-hover:ring-rose-400/30">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </span>
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* barre du haut (mobile et tablette) */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-black px-4 lg:hidden">
          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl text-slate-300 ring-1 ring-white/10 hover:bg-white/[0.06] hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </button>
          <span className="truncate text-sm font-semibold tracking-wide text-white">Roland Architecture</span>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#C9A96E] to-[#8A6A3B] text-xs font-semibold text-[#1a1510]">
            {initials(user.name)}
          </span>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}