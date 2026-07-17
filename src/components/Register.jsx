import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import GhostLogo from './GhostLogo';

const inputClass =
  'w-full border-b border-white/20 bg-transparent py-2 text-sm text-white outline-none transition-colors duration-300 placeholder:text-white/20 focus:border-white/60';

const labelClass = 'text-[10px] uppercase tracking-[0.3em] text-white/40';

const Field = ({ label, ...props }) => (
  <label className="flex flex-col gap-2">
    <span className={labelClass}>{label}</span>
    <input className={inputClass} {...props} />
  </label>
);

const Register = () => {
  // loading | form | sending | sent | code | joining | failed
  const [status, setStatus] = useState('loading');
  const [emailToken, setEmailToken] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phoneNumber: '', emailAddress: '' });
  const [consent, setConsent] = useState(false);
  const [smsCode, setSmsCode] = useState('');

  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      // Dev-only escape hatch to render the page without the registration
      // guards (e.g. for capturing compliance screenshots). Statically
      // eliminated from production builds.
      if (import.meta.env.DEV && params.has('preview')) {
        setEmailToken(token);
        setStatus(token ? 'code' : 'form');
        return;
      }
      try {
        const profile = await userService.getProfile();
        if (!profile) {
          window.location.replace('/');
          return;
        }
        if (profile.user.dateRegistered) {
          window.location.replace('/profile');
          return;
        }
      } catch (err) {
        console.error('Register init error:', err);
        window.location.replace('/');
        return;
      }
      setEmailToken(token);
      setStatus(token ? 'code' : 'form');
    };
    init();
  }, []);

  const setField = (name) => (event) => setForm((prev) => ({ ...prev, [name]: event.target.value }));

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError(null);
    setStatus('sending');
    try {
      await userService.signUp(form);
      setStatus('sent');
    } catch (err) {
      console.error('Sign up error:', err);
      setError('Something went wrong. Check your details and try again.');
      setStatus('form');
    }
  };

  const handleJoin = async (event) => {
    event.preventDefault();
    setError(null);
    setStatus('joining');
    try {
      const ok = await userService.join({ emailToken, smsCode: smsCode.trim() });
      if (ok) {
        window.location.replace('/profile');
        return;
      }
      setStatus('failed');
    } catch (err) {
      console.error('Join error:', err);
      setStatus('failed');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-obsidian bg-[radial-gradient(circle_at_center,_#1a1a1a,_#000000)] text-white selection:bg-white/80 selection:text-black">
      <div className="bg-noise mix-blend-overlay" />

      <header className="relative z-10 flex w-full items-center justify-between px-6 py-6 md:px-8 md:py-8">
        <a href="/" className="group flex size-12 items-center justify-center rounded-full transition-colors hover:bg-transparent active:scale-95">
          <GhostLogo className="text-white opacity-80 transition-opacity group-hover:opacity-100" />
        </a>
        <a href="/about" className="text-xs font-medium tracking-[0.3em] text-white opacity-60 transition-opacity duration-300 hover:opacity-100">
          ABOUT
        </a>
      </header>

      <main className="relative z-10 flex flex-grow flex-col items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          {status === 'loading' && (
            <p className="text-center text-sm tracking-[0.3em] text-white/40">···</p>
          )}

          {(status === 'form' || status === 'sending') && (
            <form onSubmit={handleSignUp} className="flex flex-col gap-8">
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-sm font-bold tracking-[0.25em] text-white/90">JOIN</h1>
                <p className="text-xs leading-relaxed tracking-wider text-white/40">
                  Register to receive vendor notifications. A code is sent to your phone and a link to your email.
                </p>
              </div>

              {error && (
                <p className="text-xs tracking-widest text-red-400/80">{error}</p>
              )}

              <div className="flex flex-col gap-6">
                <Field label="First Name" type="text" value={form.firstName} onChange={setField('firstName')} autoComplete="given-name" required />
                <Field label="Last Name" type="text" value={form.lastName} onChange={setField('lastName')} autoComplete="family-name" required />
                <Field label="Phone Number" type="tel" value={form.phoneNumber} onChange={setField('phoneNumber')} autoComplete="tel" placeholder="+1 555 555 5555" required />
                <Field label="Email Address" type="email" value={form.emailAddress} onChange={setField('emailAddress')} autoComplete="email" required />
              </div>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  required
                  className="mt-0.5 size-4 shrink-0 accent-white"
                />
                <span className="text-[11px] leading-relaxed tracking-wider text-white/40">
                  I agree to receive SMS text notifications from Destiny Ghost at the phone
                  number provided. Message frequency varies. Message and data rates may apply.
                  Reply STOP to unsubscribe or HELP for help. See our{' '}
                  <a href="/terms" className="underline underline-offset-2 hover:text-white/70">Terms</a> and{' '}
                  <a href="/privacy" className="underline underline-offset-2 hover:text-white/70">Privacy Policy</a>.
                </span>
              </label>

              <button
                type="submit"
                disabled={status === 'sending' || !consent}
                className="group relative flex h-16 w-full items-center justify-center border border-white/20 bg-transparent transition-all duration-300 hover:border-white/40 disabled:opacity-30"
              >
                <span className="text-sm font-bold tracking-[0.25em] text-white/70 transition-all duration-300 group-hover:text-white">
                  {status === 'sending' ? '···' : 'SIGN UP'}
                </span>
              </button>
            </form>
          )}

          {status === 'sent' && (
            <div className="flex flex-col gap-4 text-center">
              <h1 className="text-sm font-bold tracking-[0.25em] text-white/90">CHECK YOUR MESSAGES</h1>
              <p className="text-xs leading-relaxed tracking-wider text-white/40">
                A verification code was sent to your phone and a link to your email. Open the emailed link and enter the code there. Both expire in 5 minutes.
              </p>
            </div>
          )}

          {(status === 'code' || status === 'joining') && (
            <form onSubmit={handleJoin} className="flex flex-col gap-8">
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-sm font-bold tracking-[0.25em] text-white/90">VERIFY</h1>
                <p className="text-xs leading-relaxed tracking-wider text-white/40">
                  Enter the code sent to your phone to complete registration.
                </p>
              </div>

              <Field
                label="Verification Code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={smsCode}
                onChange={(event) => setSmsCode(event.target.value)}
                required
              />

              <button
                type="submit"
                disabled={status === 'joining'}
                className="group relative flex h-16 w-full items-center justify-center border border-white/20 bg-transparent transition-all duration-300 hover:border-white/40 disabled:opacity-30"
              >
                <span className="text-sm font-bold tracking-[0.25em] text-white/70 transition-all duration-300 group-hover:text-white">
                  {status === 'joining' ? '···' : 'CONFIRM'}
                </span>
              </button>
            </form>
          )}

          {status === 'failed' && (
            <div className="flex flex-col gap-4 text-center">
              <h1 className="text-sm font-bold tracking-[0.25em] text-white/90">VERIFICATION FAILED</h1>
              <p className="text-xs leading-relaxed tracking-wider text-white/40">
                The code was invalid or expired. Start over to receive a new code and link.
              </p>
              <a href="/register" className="text-xs font-medium tracking-[0.3em] text-white/70 underline underline-offset-4 transition-colors hover:text-white">
                START OVER
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Register;
