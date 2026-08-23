import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Bell, ExternalLink, Pencil, Radio } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { useAdmin } from '../context/AdminContext';
import { useData } from '../context/DataContext';
import { ytEmbed } from '../lib/youtube';

interface LiveProps {
  onManage: () => void;
}

export default function Live({ onManage }: LiveProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const sealY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const { live, loading } = useData();
  const { isAdmin } = useAdmin();
  const embed = live ? ytEmbed(live.youtube_url) : null;

  return (
    <section id="live" ref={ref} className="section-red relative scroll-mt-24 overflow-hidden">
      {/* alpona seal watermark — purely decorative, positioned away from text,超低 opacity */}
      <motion.div style={{ y: sealY }} aria-hidden="true" className="pointer-events-none absolute -right-16 top-8 w-[420px] opacity-[0.13] blur-[0.6px] sm:right-4 sm:w-[520px]">
        <img src="/assets/asset6.png" alt="" loading="lazy" decoding="async" className="h-auto w-full rounded-full mix-blend-luminosity" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:py-28">
        <SectionHeading
          dark
          kicker="Live"
          title="সরাসরি সম্প্রচার"
          sub="লাল আলপনার নিচে বসে শুনুন বাংলার নাড়ি — যখন লাইভ চালু থাকে, খবর চলে আসে সবার আগে"
        />

        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-[1fr_1.35fr]">
          {/* status column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="paper-card flex flex-col justify-center p-7 sm:p-9"
          >
            <div className="flex items-center gap-3">
              {loading ? (
                <span className="h-4 w-24 animate-pulse rounded bg-ink/10" />
              ) : live?.is_live ? (
                <span className="flex items-center gap-2 rounded-full bg-sindoor px-4 py-1.5 text-sm font-bold tracking-widest text-paper-soft shadow">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="live-dot absolute h-full w-full rounded-full bg-white" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-white" />
                  </span>
                  LIVE · সরাসরি
                </span>
              ) : (
                <span className="flex items-center gap-2 rounded-full border-2 border-ink/25 bg-ink/5 px-4 py-1.5 text-sm font-bold tracking-widest text-ink/60">
                  <Radio className="h-4 w-4" />
                  অফলাইন
                </span>
              )}
            </div>

            <h3 className="mt-5 font-editorial text-2xl font-bold leading-snug text-ink sm:text-3xl">
              {live?.is_live ? live.title || 'লাইভ সম্প্রচার চলছে' : 'এখন সম্প্রচার বন্ধ'}
            </h3>
            <p className="mt-3 font-bangla leading-relaxed text-ink-soft">
              {live?.description ||
                'প্রতিদিন ভোরের সংবাদ সকাল ৭টায়, প্রধান সংবাদ সন্ধ্যা ৬টায়। লাইভ শুরু হলেই এই পাতায় সরাসরি দেখা যাবে।'}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {!live?.is_live && (
                <span className="flex items-center gap-2 rounded-xl border border-haldi/50 bg-haldi/10 px-4 py-2 text-sm font-semibold text-gold">
                  <Bell className="h-4 w-4" />
                  পৃষ্ঠাটি রেখে দিন — লাইভ এখানেই খুলবে
                </span>
              )}
              {isAdmin && (
                <button onClick={onManage} className="btn-ghost flex items-center gap-2 px-4 py-2 text-sm">
                  <Pencil className="h-4 w-4" />
                  লাইভ নিয়ন্ত্রণ করুন
                </button>
              )}
            </div>
          </motion.div>

          {/* player column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="paper-card overflow-hidden p-2.5 sm:p-3"
          >
            {embed && live?.is_live ? (
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                <iframe
                  src={embed}
                  title={live.title || 'সরাসরি সম্প্রচার'}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : live?.is_live && live.youtube_url ? (
              <a
                href={live.youtube_url}
                target="_blank"
                rel="noreferrer"
                className="group flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-xl bg-[radial-gradient(circle_at_50%_30%,#c4442a,#5e0d05)] text-paper-soft"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/50 bg-white/15 transition-transform group-hover:scale-110">
                  <Radio className="h-9 w-9" />
                </span>
                <span className="flex items-center gap-2 font-bangla text-lg font-bold">
                  লাইভ দেখুন ইউটিউবে <ExternalLink className="h-5 w-5" />
                </span>
              </a>
            ) : (
              <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-ink text-center">
                <img src="/assets/asset9.png" alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
                <Radio className="relative z-10 h-12 w-12 text-haldi" strokeWidth={1.6} />
                <p className="relative z-10 px-6 font-editorial text-xl font-bold text-amber-50 sm:text-2xl">পরবর্তী লাইভ শিডিউল শীঘ্রই</p>
                <p className="relative z-10 px-6 font-bangla text-sm text-amber-100/75">The broadcast room is quiet — the dhak will sound again soon.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
