import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Menu, Settings, User, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'updates', label: 'Updates' },
  { id: 'live', label: 'Live' },
  { id: 'paper', label: 'Paper' },
  { id: 'story', label: 'Story' },
  { id: 'about', label: 'About' },
];

interface NavbarProps {
  onAuth: () => void;
  onAdmin: () => void;
}

export default function Navbar({ onAuth, onAdmin }: NavbarProps) {
  const [active, setActive] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin } = useAdmin();
  const { user } = useAuth();
  const { live } = useData();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const goTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4">
        <nav
          aria-label="Main navigation"
          className="pointer-events-auto flex items-center gap-1 rounded-full border border-ink/15 bg-paper-soft/90 px-2 py-1.5 shadow-paper backdrop-blur-md"
        >
          <button
            onClick={() => goTo('home')}
            aria-label="Sabar Kotha — home"
            className="mr-1 block h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-sindoor bg-sindoor"
          >
            <img src="/assets/asset3.png" alt="Sabar Kotha logo" className="h-full w-full object-cover" />
          </button>

          <div className="hidden items-center md:flex">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => goTo(s.id)}
                className={`relative rounded-full px-3.5 py-1.5 text-sm font-semibold tracking-wide transition-colors ${
                  active === s.id ? 'text-sindoor' : 'text-ink/70 hover:text-ink'
                }`}
              >
                {s.label}
                {s.id === 'live' && live?.is_live && (
                  <span className="absolute right-1.5 top-1.5 block h-1.5 w-1.5 rounded-full bg-sindoor">
                    <span className="live-dot absolute inset-0 rounded-full bg-sindoor" />
                  </span>
                )}
                {active === s.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-x-2 -bottom-0.5 h-[3px] rounded-full bg-sindoor"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </div>

          <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-ink/15 md:block" />

          <button
            onClick={onAuth}
            aria-label={user ? 'Account' : 'Sign in'}
            title={user ? user.email || 'Account' : 'Sign in / Join the journey'}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white/70 text-ink/80 transition-colors hover:border-sindoor hover:text-sindoor"
          >
            <User className="h-4 w-4" strokeWidth={2.2} />
            {user && <span className="absolute -right-0.5 -top-0.5 block h-2.5 w-2.5 rounded-full border-2 border-paper-soft bg-leaf" />}
          </button>

          {isAdmin && (
            <button
              onClick={onAdmin}
              aria-label="Open editor desk"
              title="সম্পাদকের ডেস্ক (Admin panel)"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-sindoor/40 bg-sindoor text-paper-soft transition-colors hover:bg-sindoor-deep"
            >
              <Settings className="h-4 w-4" strokeWidth={2.2} />
            </button>
          )}

          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white/70 text-ink md:hidden"
          >
            <Menu className="h-4.5 w-4.5" strokeWidth={2.2} />
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex flex-col bg-[#2b1408]/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-40">
              <img src="/assets/asset4.png" alt="" className="h-full w-full object-cover object-top" />
            </div>
            <div className="relative z-10 flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="block h-11 w-11 overflow-hidden rounded-full border-2 border-haldi">
                  <img src="/assets/asset3.png" alt="Sabar Kotha logo" className="h-full w-full object-cover" />
                </span>
                <span className="font-editorial text-xl font-bold text-amber-50">সবার কথা</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-100/30 text-amber-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative z-10 flex flex-1 flex-col justify-center gap-1 px-10">
              {SECTIONS.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.3 }}
                  onClick={() => goTo(s.id)}
                  className={`group flex items-baseline gap-4 border-b border-amber-100/10 py-4 text-left ${
                    active === s.id ? 'text-haldi' : 'text-amber-50'
                  }`}
                >
                  <span className="font-editorial text-3xl font-bold sm:text-4xl">{s.label}</span>
                  {s.id === 'live' && live?.is_live && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="live-dot absolute inline-flex h-full w-full rounded-full bg-sindoor" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-300" />
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
            <div className="relative z-10 px-10 pb-10">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onAuth();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-haldi/70 bg-haldi/10 px-5 py-3.5 font-bangla text-lg font-semibold text-amber-50"
              >
                {user ? <User className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                {user ? 'আমার অ্যাকাউন্ট' : 'যাত্রায় যোগ দিন / সাইন ইন'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
