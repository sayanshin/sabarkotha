import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { useData } from '../context/DataContext';
import { toBanglaDigits } from '../lib/bn';

export default function Paper() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const { papers, loading } = useData();

  const today = new Date().toLocaleDateString('bn-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section id="paper" ref={ref} className="relative scroll-mt-24 overflow-hidden">
      {/* Kolkata street — the tea-stall newsstand illustration */}
      <motion.div style={{ y: bgY }} aria-hidden="true" className="absolute inset-x-0 top-0 h-[440px]">
        <img src="/assets/asset8.png" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-paper to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-paper" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-28 sm:pt-36">
        {/* newspaper masthead — kept matted on paper for full readability */}
        <motion.header
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="masthead mx-auto max-w-3xl px-6 py-7 text-center sm:px-10"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.42em] text-sindoor sm:text-xs">Daily Paper · দৈনিক সংস্করণ</p>
          <h2 className="mt-3 font-editorial text-4xl font-black leading-tight text-ink sm:text-6xl">আজকের পত্রিকা</h2>
          <div className="mx-auto my-4 flex max-w-md items-center gap-3">
            <span className="h-px flex-1 bg-ink/30" />
            <CalendarDays className="h-4 w-4 text-sindoor" />
            <span className="font-bangla text-sm font-semibold text-ink-soft">{today}</span>
            <span className="h-px flex-1 bg-ink/30" />
          </div>
          <p className="font-bangla text-sm leading-relaxed text-ink-soft sm:text-base">
            সম্পাদক সোনার কলম হাতে,
প্রতিদিনের সত্যগুলো শব্দে সাজিয়ে চলেছেন...
          </p>
        </motion.header>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            [0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="newspaper-card animate-pulse p-6">
                <div className="h-3 w-1/4 rounded bg-ink/10" />
                <div className="mt-4 h-5 w-3/4 rounded bg-ink/10" />
                <div className="mt-3 h-3 w-full rounded bg-ink/10" />
                <div className="mt-2 h-3 w-2/3 rounded bg-ink/10" />
              </div>
            ))}

          {!loading &&
            papers.map((p, i) => (
              <motion.a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: (i % 3) * 0.09, duration: 0.5 }}
                className="newspaper-card group flex flex-col p-6 transition-transform duration-300 hover:-translate-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-editorial text-xs font-black tracking-[0.2em] text-sindoor">
                    সংবাদ {toBanglaDigits(String(papers.length - i).padStart(2, '0'))}
                  </span>
                  <span className="max-w-[55%] truncate rounded-sm border border-ink/25 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-ink/60">
                    {p.edition}
                  </span>
                </div>
                <span aria-hidden="true" className="mt-3 border-t-2 border-double border-ink/40" />
                <h3 className="mt-4 font-editorial text-xl font-bold leading-snug text-ink transition-colors group-hover:text-sindoor">
                  {p.title}
                </h3>
                {p.summary && <p className="mt-3 flex-1 font-bangla text-sm leading-relaxed text-ink-soft">{p.summary}</p>}
                <span className="mt-5 flex items-center gap-2 border-t border-ink/15 pt-3.5 text-sm font-bold text-sindoor">
                  সম্পূর্ণ খবর পড়ুন
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </motion.a>
            ))}

          {!loading && papers.length === 0 && (
            <p className="col-span-full rounded-2xl border-2 border-dashed border-ink/20 bg-paper-soft/80 px-6 py-10 text-center font-bangla text-ink-soft">
              সোনার কলম হাতে, লিখছি সত্য কথা,
একটু অপেক্ষা করো, মিটুক রাতের ব্যথা।
পাতায় পাতায় সাজছে আজ তোমারই সকাল,
শেষ দাগটা পড়লেই—খুলবে খবরের জাল।
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
