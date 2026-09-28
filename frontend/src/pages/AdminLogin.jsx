import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
const API_URL = import.meta.env.VITE_API_URL || '';

const response = await fetch(`${API_URL}/api/auth/login`, {    
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Identifiants incorrects.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/admin/dashboard');
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FAF8F5] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-hidden">
      
      {/* COLONNE DE GAUCHE : Photo d'architecture design et lumineuse */}
      <div className="hidden lg:flex lg:w-3/5 relative items-end p-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop" 
            alt="Architecture Design Studio" 
            className="w-full h-full object-cover object-center scale-105 animate-[pulse_10s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-neutral-900/20 to-transparent"></div>
        </div>

        {/* Contenu superposé à gauche */}
        <div className="relative z-10 max-w-xl text-white animate-[fadeInLeft_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <div className="inline-block border border-white/30 px-3.5 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-white/90 mb-6 rounded-full bg-white/10 backdrop-blur-md">
            Administration Studio
          </div>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight font-display mb-4 leading-tight">
            L'architecture de précision.
          </h1>
          <p className="text-sm text-white/80 font-mono leading-relaxed max-w-md">
            Accédez à votre espace de gestion sécurisé pour piloter vos projets et vos contenus d'exception.
          </p>
        </div>
      </div>

      {/* COLONNE DE DROITE : Formulaire sur fond clair/crème lumineux */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 sm:p-12 bg-[#FAF8F5] relative z-10">
        <div className="w-full max-w-[380px] animate-[fadeInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          
          {/* LOGO & EN-TÊTE CENTRÉS */}
          <div className="text-center mb-10">
            {/* Logo centré grâce à mx-auto */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl  border border-neutral-200 mb-6 shadow-sm overflow-hidden p-2 mx-auto">
              <img src="/logo/logo-mark-dark.png" alt="Logo" className="w-full h-full object-contain" />
            </div>

            <h2 className="text-2xl font-light tracking-tight text-neutral-900 font-display mb-2">
              Bon retour, Bienvenue
            </h2>
            <p className="text-xs text-neutral-500 font-mono">
              Connectez-vous pour accéder au dashboard
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-mono text-center tracking-wide">
              {errorMsg}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2">
                Identifiant
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </span>
                <input 
                  type="email" 
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@studio.com"
                  className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 pl-11 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-all font-mono shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 1.125h10.5a2.25 2.25 0 012.25 2.25v6.75a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-6.75a2.25 2.25 0 012.25-2.25z" />
                  </svg>
                </span>
                <input 
                  type="password" 
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 pl-11 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-all font-mono shadow-sm"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-neutral-900 text-white py-4 rounded-xl text-xs font-mono uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-50 font-medium"
            >
              <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
              Roland Architecture Studio
            </p>
          </div>

        </div>
      </div>

      {/* Animations CSS fluides */}
      <style>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

    </div>
  );
}