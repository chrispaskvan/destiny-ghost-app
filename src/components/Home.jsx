import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import GhostLogo from './GhostLogo';

const Home = () => {
  const { isLoading, isAuthenticated, isRegistered, user, bungieSignInUrl, signOut, error, clearError, authSuccess, clearAuthSuccess } = useAuth();
  const [worldVersion, setWorldVersion] = useState(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isRegistered) {
      window.location.assign('/register');
    }
  }, [isLoading, isAuthenticated, isRegistered]);

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setWorldVersion(data?.destiny2?.world ?? null))
      .catch(() => {});
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-obsidian bg-[radial-gradient(circle_at_center,_#1a1a1a,_#000000)] text-white selection:bg-white/80 selection:text-black">
      <div className="bg-noise mix-blend-overlay" />

      {error && (
        <div className="relative z-10 flex items-center justify-between border-b border-red-500/20 bg-red-500/10 px-6 py-3 text-xs tracking-widest text-red-400/80">
          <span>{error}</span>
          <button onClick={clearError} className="ml-4 opacity-60 hover:opacity-100" aria-label="Dismiss">✕</button>
        </div>
      )}

      {authSuccess && (
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-3 text-xs tracking-widest text-white/60">
          <span>AUTHENTICATED</span>
          <button onClick={clearAuthSuccess} className="ml-4 opacity-60 hover:opacity-100" aria-label="Dismiss">✕</button>
        </div>
      )}

      <header className="relative z-10 flex w-full items-center justify-between px-6 py-6 md:px-8 md:py-8">
        <a href="/" className="group flex size-12 items-center justify-center rounded-full transition-colors hover:bg-transparent active:scale-95">
          <GhostLogo className="text-white opacity-80 transition-opacity group-hover:opacity-100" />
        </a>
        <nav className="flex items-center gap-6 md:gap-8">
          {isAuthenticated && (
            <a href="/profile" className="text-xs font-medium tracking-[0.3em] text-white opacity-60 transition-opacity duration-300 hover:opacity-100">
              PROFILE
            </a>
          )}
          <a href="/about" className="text-xs font-medium tracking-[0.3em] text-white opacity-60 transition-opacity duration-300 hover:opacity-100">
            ABOUT
          </a>
        </nav>
      </header>

      <main className="relative z-10 flex flex-grow flex-col items-center justify-center gap-8 px-4">
        {isAuthenticated && user && (
          <p className="text-xs tracking-[0.3em] text-white/40 uppercase">
            {user.displayName || user.name || 'Guardian'}
          </p>
        )}

        {isAuthenticated ? (
          <button
            onClick={signOut}
            disabled={isLoading}
            className="group relative flex h-20 min-w-[200px] items-center justify-center rounded-none border border-white/20 bg-transparent px-10 transition-all duration-300 hover:border-white/40 disabled:opacity-30"
          >
            <span className="relative z-10 text-sm font-bold tracking-[0.25em] text-white/70 transition-all duration-300 group-hover:text-white">
              {isLoading ? '···' : 'SIGN OUT'}
            </span>
          </button>
        ) : bungieSignInUrl ? (
          <a
            href={bungieSignInUrl}
            className="group relative flex h-20 min-w-[200px] items-center justify-center rounded-none border border-white/20 bg-transparent px-10 transition-all duration-300 hover:border-white/40"
          >
            <span className="relative z-10 text-sm font-bold tracking-[0.25em] text-white/70 transition-all duration-300 group-hover:text-white">
              GUARDIAN
            </span>
          </a>
        ) : (
          <button
            disabled
            className="relative flex h-20 min-w-[200px] items-center justify-center rounded-none border border-white/20 bg-transparent px-10 opacity-30"
          >
            <span className="text-sm font-bold tracking-[0.25em] text-white/70">
              {isLoading ? '···' : 'GUARDIAN'}
            </span>
          </button>
        )}
      </main>

      <footer className="relative z-10 flex w-full items-center justify-center pb-8 pt-4">
        <div className={`flex items-center gap-2 transition-opacity duration-500 ${worldVersion ? 'opacity-30' : 'opacity-0'}`}>
          <span className="h-px w-8 bg-white" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-white">{worldVersion || ''}</p>
          <span className="h-px w-8 bg-white" />
        </div>
      </footer>

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.01] blur-3xl" />
    </div>
  );
};

export default Home;
