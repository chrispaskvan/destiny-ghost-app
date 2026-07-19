import { useState, useCallback, useEffect } from 'react';
import { userService } from '../services/userService';

export function useProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [etag, setEtag] = useState(null);
  const [draft, setDraft] = useState([]);
  // idle | saving | saved | stale | error
  const [saveState, setSaveState] = useState('idle');

  const load = useCallback(async () => {
    // Dev-only escape hatch mirroring /register?preview: render the page with
    // representative data and no session (e.g. for compliance screenshots).
    // Statically eliminated from production builds.
    if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('preview')) {
      const previewUser = {
        displayName: 'Guardian',
        dateRegistered: '2026-01-25T00:00:00Z',
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john.doe@example.com',
        phoneNumber: '+16305550147',
        notifications: [
          { type: 'Xur', enabled: true },
          { type: 'Banshee-44', enabled: true },
          { type: 'Lord Saladin', enabled: false },
          { type: 'Orders', enabled: false },
        ],
      };
      setUser(previewUser);
      setDraft(previewUser.notifications.map((notification) => notification.enabled));
      setIsLoading(false);
      return;
    }
    const profile = await userService.getProfile();
    if (!profile) {
      window.location.replace('/');
      return;
    }
    if (!profile.user.dateRegistered) {
      window.location.replace('/register');
      return;
    }
    setUser(profile.user);
    setEtag(profile.etag);
    setDraft((profile.user.notifications || []).map((notification) => notification.enabled));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load().catch((err) => {
      console.error('Profile load error:', err);
      window.location.replace('/');
    });
  }, [load]);

  useEffect(() => {
    if (saveState !== 'saved') return;
    const timer = setTimeout(() => setSaveState('idle'), 3000);
    return () => clearTimeout(timer);
  }, [saveState]);

  const toggle = useCallback((index) => {
    setSaveState('idle');
    setDraft((prev) => prev.map((enabled, i) => (i === index ? !enabled : enabled)));
  }, []);

  const isDirty = !!user && draft.some(
    (enabled, index) => enabled !== user.notifications?.[index]?.enabled
  );

  const buildOps = (notifications) => draft
    .map((enabled, index) => ({ enabled, index }))
    .filter(({ enabled, index }) => enabled !== notifications[index]?.enabled)
    .map(({ enabled, index }) => ({
      op: 'replace',
      path: `/notifications/${index}/enabled`,
      value: enabled,
    }));

  const save = useCallback(async () => {
    if (!user) return;
    const ops = buildOps(user.notifications);
    if (!ops.length) return;

    setSaveState('saving');
    try {
      let result = await userService.updateProfile(ops, etag);

      // The ETag changes on any rewrite of the user document (e.g. token
      // refreshes), so a stale response usually isn't a conflicting edit.
      // Rebase the draft on a fresh profile and retry once.
      if (result.stale) {
        const fresh = await userService.getProfile();
        if (!fresh) {
          window.location.replace('/');
          return;
        }
        // Retry with locals only — load() below re-syncs user, etag, and
        // draft together, so component state never desyncs mid-save.
        const freshOps = buildOps(fresh.user.notifications || []);
        result = freshOps.length
          ? await userService.updateProfile(freshOps, fresh.etag)
          : { ok: true };
      }

      if (result.ok) {
        await load();
        setSaveState('saved');
      } else if (result.stale) {
        await load();
        setSaveState('stale');
      } else {
        setSaveState('error');
      }
    } catch (err) {
      console.error('Profile save error:', err);
      setSaveState('error');
    }
  }, [user, draft, etag, load]);

  return { isLoading, user, draft, isDirty, saveState, toggle, save };
}
