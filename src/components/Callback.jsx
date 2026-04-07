import { useEffect } from 'react';
import { authService } from '../services/authService';

const Callback = () => {
  useEffect(() => {
    const handleCallback = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      if (!code) {
        window.location.replace('/?error=missing_auth_code');
        return;
      }

      try {
        const ok = await authService.completeSignIn(code, state);
        window.location.replace(ok ? '/?auth=success' : '/?error=auth_failed');
      } catch {
        window.location.replace('/?error=auth_error');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian text-white">
      <p className="text-sm tracking-[0.3em] opacity-60">Completing sign in...</p>
    </div>
  );
};

export default Callback;
