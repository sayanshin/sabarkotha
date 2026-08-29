import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Sparkles, Megaphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HomeProps {
  onJoin: () => void;
}

export default function Home({ onJoin }: HomeProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const fgY = useTransform(scrollYProgress, [0, 1], ['0%', '-16%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const { user } = useAuth();

  const marqueeContent = [
    'কম খরচে বিজ্ঞাপন দিন — Sabar Kotha TV-তে — যোগাযোগ → 9804002449 / 9474148706'
  ];

  return (
    <section id="home" ref={ref} className="relative scroll-mt-24 overflow-hidden">
      {/* hand-painted Bengali countryside — far parallax layer */}
      <motion.div style={{ y: bgY }} className="absolute inset-0" aria-hidden="true">
        <img
          src="/assets/asset2.png"
          alt=""
          loading="eager"
          decoding="async"
          className="h-full w-full scale-110 object-cover object-center"
        />
        {/* warm sky wash + readability veils */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-paper via-paper/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/10 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
      </motion.div>

      {/* mid parallax layer: sun disc + drifting clouds */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          style={{ y: bgY }}
          className="absolute right-[8%] top-[10%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(232,168,32,0.55),rgba(232,168,32,0)_70%)] blur-[2px] sm:h-56 sm:w-56"
        />
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      {/* content layer */}
      <motion.div
        style={{ y: fgY, opacity: fade }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-4 pb-36 pt-24 text-center sm:pt-28"
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="paper-chip"
        >
          <Sparkles className="h-3.5 w-3.5 text-haldi" />
          সম্প্রচারে · প্রতি দিন · গ্রাম থেকে শহর
        </motion.p>

        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: 34, rotate: -5, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, rotate: -2, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.9, type: 'spring', stiffness: 120, damping: 16 }}
          className="logo-frame mt-7"
        >
          <img
            src="/assets/asset3.png"
            alt="Sabar Kotha — official SK News logo"
            className="block h-auto w-full"
            loading="eager"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="title-ink mt-8 px-2 font-editorial text-[clamp(1.9rem,6vw,4rem)] font-bold leading-[1.25]"
        >
          সবার কথা, সবার আগে, সবার কাছে
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-4 max-w-xl px-2 font-bangla text-base leading-relaxed text-ink-soft sm:text-lg"
        >
          জলরঙের কাগজে আঁকা বাংলার খবরপত্র — গাঁয়ের মাঠ, পাড়ার আড্ডা আর শহরের রাস্তা থেকে
          <span className="mt-1 block text-sm sm:text-base">A hand-painted Bengali news world — from village fields to city streets.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          className="mt-9 flex flex-col items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.04, rotate: 0.5 }}
            whileTap={{ scale: 0.97 }}
            onClick={onJoin}
            className="btn-journey px-9 py-4"
          >
            <span className="block text-lg font-bold tracking-wide sm:text-xl">Be a part of our Journey</span>
            <span className="mt-0.5 block font-bangla text-sm font-medium opacity-90">আমাদের যাত্রার অংশ হোন ❀</span>
          </motion.button>
          {user && (
            <p className="rounded-full border border-leaf/30 bg-leaf/10 px-4 py-1.5 text-sm font-semibold text-leaf">
              স্বাগতম, {user.displayName || user.email}!
            </p>
          )}
          <button
            onClick={() => document.getElementById('updates')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-2 font-bangla text-sm font-semibold text-sindoor transition-colors hover:text-sindoor-deep"
          >
            আজকের বড় খবর দেখুন
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </button>
        </motion.div>
      </motion.div>

      {/* Advertisement Marquee Bar */}
      <div className="absolute inset-x-0 bottom-8 z-10 mx-auto max-w-4xl px-4">
        <div
          className="overflow-hidden rounded-full border border-ink/15 bg-paper-soft/85 py-2.5 shadow-paper backdrop-blur-sm"
          role="marquee"
          aria-label="Advertisement Banner"
        >
          <div className="flex items-center gap-3 px-4">
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-sindoor px-3 py-1 text-xs font-bold text-paper-soft">
              <Megaphone className="h-3.5 w-3.5" />
              📢 বিজ্ঞাপন দিন
            </span>
            <div className="marquee flex-1">
              <div className="marquee-track font-bangla text-sm font-semibold text-ink/90">
                {[0, 1].map((copy) => (
                  <span key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
                    {marqueeContent.map((entry, i) => (
                      <span key={`${copy}-${i}`} className="mx-5 whitespace-nowrap">
                        ❀ {entry}
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

