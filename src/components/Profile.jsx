import { useProfile } from '../hooks/useProfile';
import GhostLogo from './GhostLogo';

const detailClass = 'flex min-w-0 flex-col gap-1';
const labelClass = 'text-[10px] uppercase tracking-[0.3em] text-white/40';
const valueClass = 'break-words text-sm tracking-wider text-white/80';

const Detail = ({ label, value }) => (
  <div className={detailClass}>
    <span className={labelClass}>{label}</span>
    <span className={valueClass}>{value || '—'}</span>
  </div>
);

const Toggle = ({ label, enabled, onToggle }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    onClick={onToggle}
    className="group flex w-full items-center justify-between border-b border-white/10 py-4 transition-colors hover:border-white/30"
  >
    <span className="text-sm tracking-[0.2em] text-white/70 transition-colors group-hover:text-white">
      {label}
    </span>
    <span
      className={`relative h-5 w-10 border transition-colors duration-300 ${
        enabled ? 'border-white/60' : 'border-white/20'
      }`}
    >
      <span
        className={`absolute top-1/2 size-3 -translate-y-1/2 transition-all duration-300 ${
          enabled ? 'left-[22px] bg-white/80' : 'left-1 bg-white/20'
        }`}
      />
    </span>
  </button>
);

const saveMessages = {
  saved: 'SAVED',
  stale: 'PROFILE CHANGED ELSEWHERE — RELOADED, TRY AGAIN',
  error: 'SAVE FAILED — TRY AGAIN',
};

const Profile = () => {
  const { isLoading, user, draft, isDirty, saveState, toggle, save } = useProfile();

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

      <main className="relative z-10 flex flex-grow flex-col items-center px-4 pb-16 pt-8">
        {isLoading ? (
          <div className="flex flex-grow items-center">
            <p className="text-sm tracking-[0.3em] text-white/40">···</p>
          </div>
        ) : (
          <div className="flex w-full max-w-sm flex-col gap-12">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-sm font-bold tracking-[0.25em] text-white/90">
                {user.displayName?.toUpperCase() || 'GUARDIAN'}
              </h1>
              {user.dateRegistered && (
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                  Registered {new Date(user.dateRegistered).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <Detail label="First Name" value={user.firstName} />
              <Detail label="Last Name" value={user.lastName} />
              <Detail label="Email" value={user.emailAddress} />
              <Detail label="Phone" value={user.phoneNumber} />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className={labelClass}>Subscriptions</h2>
              <div className="flex flex-col">
                {(user.notifications || []).map((notification, index) => (
                  <Toggle
                    key={notification.type}
                    label={notification.type.toUpperCase()}
                    enabled={draft[index]}
                    onToggle={() => toggle(index)}
                  />
                ))}
                {!user.notifications?.length && (
                  <p className="py-4 text-xs tracking-wider text-white/30">No subscriptions available.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={save}
                disabled={!isDirty || saveState === 'saving'}
                className="group relative flex h-16 w-full items-center justify-center border border-white/20 bg-transparent transition-all duration-300 enabled:hover:border-white/40 disabled:opacity-30"
              >
                <span className="text-sm font-bold tracking-[0.25em] text-white/70 transition-all duration-300 group-enabled:group-hover:text-white">
                  {saveState === 'saving' ? '···' : 'SAVE'}
                </span>
              </button>
              {saveMessages[saveState] && (
                <p
                  className={`text-[10px] tracking-[0.3em] ${
                    saveState === 'saved' ? 'text-white/40' : 'text-red-400/80'
                  }`}
                  role="status"
                >
                  {saveMessages[saveState]}
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
