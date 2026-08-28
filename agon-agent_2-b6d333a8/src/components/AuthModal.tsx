import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Feather, Loader2, Lock, LogOut, Mail, User, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { api } from '../lib/api';
import { signInWithGoogle } from '../lib/googleAuth';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAdminSuccess: () => void;
}

type Tab = 'user' | 'admin';
type UserMode = 'signin' | 'signup' | 'journey' | 'done' | 'account';

export default function AuthModal({ open, onClose, onAdminSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>('user');
  const { user, signIn, signUp, signOut } = useAuth();
  const { login: adminLogin } = useAdmin();
  const { refreshMembers } = useData();

  // user flow state
  const [userMode, setUserMode] = useState<UserMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showPw, setShowPw] = useState(false);

  // admin flow state
  const [adminPw, setAdminPw] = useState('');
  const [adminBusy, setAdminBusy] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [showAdminPw, setShowAdminPw] = useState(false);

  useEffect(() => {
    if (open) {
      setError('');
      setNotice('');
      setAdminError('');
      if (user) {
        setUserMode('account');
        setEmail(user.email || '');
      } else if (userMode === 'account' || userMode === 'journey' || userMode === 'done') {
        setUserMode('signin');
      }
    }
  }, [open, user]);

  // Trap Escape key to close modal safely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleUserSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      if (userMode === 'signup') {
        if (name.trim().length < 2) {
          setError('আপনার নাম লিখুন — please enter your name');
          setBusy(false);
          return;
        }
        if (password.length < 6) {
          setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে — password must be 6+ characters');
          setBusy(false);
          return;
        }
        const res = await signUp(email.trim(), password, name.trim());
        if (res.error) {
          setError(res.error);
        } else if (res.autoSignedIn) {
          setUserMode('journey');
        } else {
          setNotice('অ্যাকাউন্ট তৈরি হয়েছে! এবার সাইন ইন করুন। Account created — please sign in.');
          setUserMode('signin');
        }
      } else {
        const err = await signIn(email.trim(), password);
        if (err) {
          setError(err);
        } else {
          setUserMode('journey');
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const handleJourneySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.members.join({ name: name.trim() || 'অজানা যাত্রী', email: email.trim(), message: message.trim() });
      await refreshMembers();
      setUserMode('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'যোগ দেওয়া যায়নি — please try again');
    } finally {
      setBusy(false);
    }
  };

  const handleAdminSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAdminBusy(true);
    setAdminError('');
    const err = await adminLogin(adminPw);
    setAdminBusy(false);
    if (err) {
      setAdminError(err);
    } else {
      setAdminPw('');
      onClose();
      onAdminSuccess();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Authentication"
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="paper-card relative w-full max-w-md overflow-hidden p-0 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* alpona cap — decorative header accent */}
            <div className="pointer-events-none relative h-16 overflow-hidden">
              <img src="/assets/asset4.png" alt="" className="h-full w-full object-cover object-top" />
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-paper-soft" />
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close authentication modal"
              className="absolute right-3 top-16 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white/80 text-ink/70 transition-colors hover:bg-white hover:text-sindoor focus:outline-none focus:ring-2 focus:ring-sindoor"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="px-6 pb-7 pt-2 sm:px-8">
              <div className="text-center">
                <span className="mx-auto block h-16 w-16 overflow-hidden rounded-2xl border-[3px] border-sindoor/70 shadow-paper">
                  <img src="/assets/asset3.png" alt="Sabar Kotha logo" className="h-full w-full object-cover" />
                </span>
                <h3 className="mt-3 font-editorial text-2xl font-bold text-ink">আমাদের যাত্রার অংশ হোন</h3>
                <p className="mt-1 font-bangla text-sm text-ink-soft">Be a part of the Sabar Kotha journey</p>
              </div>

              {/* Navigation Tabs */}
              <div className="mt-5 grid grid-cols-2 rounded-xl border-2 border-ink/15 bg-paper-deep/60 p-1" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === 'user'}
                  onClick={() => {
                    setTab('user');
                    setError('');
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-all ${
                    tab === 'user' ? 'bg-sindoor text-paper-soft shadow' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  <User className="h-4 w-4" /> ব্যবহারকারী
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === 'admin'}
                  onClick={() => {
                    setTab('admin');
                    setAdminError('');
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-all ${
                    tab === 'admin' ? 'bg-ink text-amber-100 shadow' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  <Lock className="h-4 w-4" /> প্রশাসক
                </button>
              </div>

              {tab === 'user' ? (
                <div className="mt-5">
                  {(userMode === 'signin' || userMode === 'signup') && (
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                      {userMode === 'signup' && (
                        <div>
                          <label htmlFor="auth-name" className="mb-1 block text-sm font-semibold text-ink">
                            নাম <span className="font-normal text-ink-soft">(Name)</span>
                          </label>
                          <input
                            id="auth-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="যেমন: ঋতুপর্ণা চট্টোপাধ্যায়"
                            className="field"
                            autoComplete="name"
                          />
                        </div>
                      )}
                      <div>
                        <label htmlFor="auth-email" className="mb-1 block text-sm font-semibold text-ink">
                          ইমেইল <span className="font-normal text-ink-soft">(Email)</span>
                        </label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                          <input
                            id="auth-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="apnar@email.com"
                            className="field pl-10"
                            autoComplete="email"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="auth-password" className="mb-1 block text-sm font-semibold text-ink">
                          পাসওয়ার্ড <span className="font-normal text-ink-soft">(Password)</span>
                        </label>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                          <input
                            id="auth-password"
                            type={showPw ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="field pl-10 pr-11"
                            autoComplete={userMode === 'signup' ? 'new-password' : 'current-password'}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            aria-label={showPw ? 'Hide password' : 'Show password'}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 transition-colors hover:text-ink"
                          >
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <p className="flex items-start gap-2 rounded-lg bg-sindoor/10 px-3 py-2 text-sm text-sindoor" role="alert">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
                        </p>
                      )}
                      {notice && (
                        <p className="flex items-start gap-2 rounded-lg bg-leaf/10 px-3 py-2 text-sm text-leaf" role="status">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {notice}
                        </p>
                      )}

                      <button type="submit" disabled={busy} className="btn-journey w-full py-3 text-base disabled:opacity-60">
                        {busy ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : userMode === 'signup' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'সাইন ইন করুন'}
                      </button>

                      <button
                        type="button"
                      onClick={() => signInWithGoogle()}
                        className="flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-ink/20 bg-white/80 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/50"
                      >
                        <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" aria-hidden="true">
                          <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.2 3.7-8.8z" />
                          <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-6-2.2-7-5.1l-3.9 3C3.1 21.3 7.2 24 12 24z" />
                          <path fill="#FBBC05" d="M5 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3l-3.9-3C.4 8.2 0 10 0 12s.4 3.8 1.1 5.3l3.9-3z" />
                          <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.2 0 3.1 2.7 1.1 6.7l3.9 3c1-2.9 3.8-5 7-5z" />
                        </svg>
                        Google দিয়ে সাইন ইন
                      </button>

                      <p className="text-center text-sm text-ink-soft">
                        {userMode === 'signup' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'নতুন এখানে?'}{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setUserMode(userMode === 'signup' ? 'signin' : 'signup');
                            setError('');
                            setNotice('');
                          }}
                          className="font-semibold text-sindoor underline-offset-2 hover:underline"
                        >
                          {userMode === 'signup' ? 'সাইন ইন করুন' : 'নতুন অ্যাকাউন্ট খুলুন'}
                        </button>
                      </p>
                    </form>
                  )}

                  {userMode === 'journey' && (
                    <form onSubmit={handleJourneySubmit} className="space-y-4">
                      <p className="rounded-xl border-2 border-dashed border-haldi/60 bg-haldi/10 px-4 py-3 text-center font-bangla text-sm text-ink">
                        স্বাগতম! আপনার নাম আমাদের <strong>“যাত্রী দেয়ালে”</strong> উঠে যাক —
                        <br />
                        <span className="text-ink-soft">Your name on our traveller's wall (optional)</span>
                      </p>
                      <div>
                        <label htmlFor="journey-name" className="mb-1 block text-sm font-semibold text-ink">নাম</label>
                        <input
                          id="journey-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="আপনার নাম"
                          className="field"
                        />
                      </div>
                      <div>
                        <label htmlFor="journey-msg" className="mb-1 block text-sm font-semibold text-ink">
                          এক লাইনে শুভেচ্ছা <span className="font-normal text-ink-soft">(ঐচ্ছিক)</span>
                        </label>
                        <textarea
                          id="journey-msg"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="যেমন: গ্রাম বাংলার খবর সবার আগে চাই!"
                          maxLength={300}
                          rows={2}
                          className="field resize-none"
                        />
                      </div>
                      {error && <p className="rounded-lg bg-sindoor/10 px-3 py-2 text-sm text-sindoor" role="alert">{error}</p>}
                      <button type="submit" disabled={busy} className="btn-journey w-full py-3 text-base disabled:opacity-60">
                        {busy ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'যাত্রায় নাম লেখান ❀'}
                      </button>
                      <button type="button" onClick={() => setUserMode('account')} className="w-full text-center text-sm text-ink-soft hover:text-ink">
                        এড়িয়ে যান →
                      </button>
                    </form>
                  )}

                  {userMode === 'done' && (
                    <div className="py-4 text-center">
                      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf/15 text-leaf">
                        <Feather className="h-8 w-8" />
                      </span>
                      <h4 className="mt-4 font-editorial text-2xl font-bold text-ink">যাত্রায় স্বাগতম!</h4>
                      <p className="mt-2 font-bangla text-sm leading-relaxed text-ink-soft">
                        আপনার নাম এখন সবার কথা-র যাত্রী দেয়ালে। প্রতিদিনের খবর, লাইভ আর গল্প — সবার আগে পাবেন।
                      </p>
                      <div className="mt-5 flex gap-3">
                        <button type="button" onClick={() => setUserMode('account')} className="btn-ghost flex-1 py-2.5 text-sm">অ্যাকাউন্ট</button>
                        <button type="button" onClick={onClose} className="btn-journey flex-1 py-2.5 text-sm">পত্রিকা পড়তে শুরু করুন</button>
                      </div>
                    </div>
                  )}

                  {userMode === 'account' && user && (
                    <div className="space-y-4 py-2">
                      <div className="rounded-xl border border-ink/15 bg-white/60 px-4 py-3.5">
                        <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">Signed in as</p>
                        <p className="mt-1 truncate font-semibold text-ink">{user.email}</p>
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setUserMode('journey')} className="btn-journey flex-1 py-2.5 text-sm">
                          যাত্রী দেয়ালে নাম লেখান
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await signOut();
                            onClose();
                          }}
                          className="btn-ghost flex items-center justify-center gap-2 px-5 py-2.5 text-sm"
                        >
                          <LogOut className="h-4 w-4" /> সাইন আউট
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleAdminSubmit} className="mt-5 space-y-4">
                  <p className="rounded-xl border border-ink/10 bg-white/50 px-4 py-3 text-center text-sm leading-relaxed text-ink-soft">
                    শুধুমাত্র অধিকৃত সম্পাদকদের জন্য।
                    <br />
                    <span className="text-xs">Authorized editors only — the password is verified securely on the server.</span>
                  </p>
                  <div>
                    <label htmlFor="admin-pw" className="mb-1 block text-sm font-semibold text-ink">
                      অ্যাডমিন পাসওয়ার্ড
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                      <input
                        id="admin-pw"
                        type={showAdminPw ? 'text' : 'password'}
                        required
                        value={adminPw}
                        onChange={(e) => setAdminPw(e.target.value)}
                        placeholder="••••••••••"
                        className="field pl-10 pr-11"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPw(!showAdminPw)}
                        aria-label={showAdminPw ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 transition-colors hover:text-ink"
                      >
                        {showAdminPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {adminError && (
                    <p className="flex items-start gap-2 rounded-lg bg-sindoor/10 px-3 py-2 text-sm text-sindoor" role="alert">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {adminError}
                    </p>
                  )}
                  <button type="submit" disabled={adminBusy} className="w-full rounded-xl border-2 border-ink bg-ink py-3 font-semibold text-amber-100 transition-colors hover:bg-black disabled:opacity-60">
                    {adminBusy ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'সম্পাদকের ডেস্কে প্রবেশ করুন'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
