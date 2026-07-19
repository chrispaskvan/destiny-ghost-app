import { useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [bungieSignInUrl, setBungieSignInUrl] = useState(null);

  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const authError = params.get('error');
      if (params.get('auth') || authError) {
        if (authError) setError(`Authentication failed: ${authError}`);
        else setAuthSuccess(true);
        window.history.replaceState(null, '', window.location.pathname);
      }
      try {
        const currentUser = await authService.getUser();
        setUser(currentUser);
        if (!currentUser) setBungieSignInUrl(await authService.getBungieSignInUrl());
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!authSuccess) return;
    const timer = setTimeout(() => setAuthSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [authSuccess]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
    setUser(null);
    window.location.href = '/';
  }, []);

  return {
    isLoading,
    error,
    authSuccess,
    isAuthenticated: !!user,
    isRegistered: !!user?.dateRegistered,
    user,
    bungieSignInUrl,
    signOut,
    clearError: useCallback(() => setError(null), []),
    clearAuthSuccess: useCallback(() => setAuthSuccess(false), []),
  };
}
