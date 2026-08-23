import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Moon, Play, Youtube } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { useData } from '../context/DataContext';
import type { StoryEpisode } from '../lib/api';
import { ytThumb, youtubeId } from '../lib/youtube';

interface StoryProps {
  onPlay: (episode: StoryEpisode) => void;
}

export default function Story({ onPlay }: StoryProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  const { episodes, links, loading } = useData();

  const channelLink = links.find((l) => l.kind === 'story');

  return (
    <section id="story" ref={ref} className="relative scroll-mt-24 overflow-hidden bg-[#1b120b]">
      {/* ink-wash haunted village — the midnight mystery backdrop */}
      <motion.div style={{ y: bgY }} aria-hidden="true" className="absolute inset-0">
        <img src="/assets/asset7.png" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b120b]/85 via-[#1b120b]/55 to-[#1b120b]/90" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:py-28">
        <SectionHeading
          dark
          kicker="Story"
          title="মধ্যরাতের রহস্য"
          sub="আমাদের গল্পকথন চ্যানেল — টুবুড়ি-বাতির আলোয় গা ছমছমে গ্রাম বাংলার রহস্যগল্প, প্রতি রাতে"
        />

        {/* channel promo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-5 rounded-3xl border border-amber-100/20 bg-white/[0.06] px-7 py-8 text-center backdrop-blur-md sm:flex-row sm:text-left"
        >
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-haldi/60 bg-haldi/15 text-haldi">
            <Moon className="h-8 w-8" strokeWidth={1.8} />
          </span>
          <div className="flex-1">
            <h3 className="font-editorial text-2xl font-bold text-amber-50">রাত বিরেতে গল্প শোনার ঠিকানা</h3>
            <p className="mt-1.5 font-bangla text-sm leading-relaxed text-amber-100/80">
              Midnight tales from the Bengali countryside — subscribe and listen every night.
            </p>
          </div>
          {channelLink && (
            <a
              href={channelLink.url}
              target="_blank"
              rel="noreferrer"
              className="group flex shrink-0 items-center gap-2 rounded-2xl bg-haldi px-6 py-3.5 font-bangla text-base font-bold text-[#241503] shadow-lg shadow-black/40 transition-transform hover:scale-105"
            >
              <Youtube className="h-5 w-5" />
              চ্যানেলে যান
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          )}
        </motion.div>

        {/* episodes carousel */}
        <div className="mt-12">
          <div className="scrollbar-story flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 pr-2 pt-1">
            {loading &&
              [0, 1, 2].map((i) => (
                <div key={i} className="w-72 shrink-0 animate-pulse rounded-2xl border border-amber-100/15 bg-white/5 p-0">
                  <div className="aspect-video rounded-t-2xl bg-white/10" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-3/4 rounded bg-white/10" />
                    <div className="h-3 w-1/2 rounded bg-white/10" />
                  </div>
                </div>
              ))}

            {!loading &&
              episodes.map((ep, i) => {
                const thumb = ytThumb(ep.youtube_url);
                return (
                  <motion.article
                    key={ep.id}
                    initial={{ opacity: 0, x: 34 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    onClick={() => onPlay(ep)}
                    className="group w-72 shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl border border-amber-100/20 bg-[#241708]/90 shadow-lg shadow-black/40 backdrop-blur-sm transition-all hover:-translate-y-1.5 hover:border-haldi/50"
                  >
                    <div className="relative aspect-video overflow-hidden bg-black">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={ep.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <img
                          src="/assets/asset7.png"
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-100/50 bg-haldi/90 text-[#241503] shadow-xl transition-transform group-hover:scale-110">
                        <Play className="ml-0.5 h-6 w-6 fill-current" />
                      </span>
                      {ep.duration && (
                        <span className="absolute bottom-2 right-2 rounded bg-black/75 px-2 py-0.5 font-bangla text-xs font-semibold text-amber-50">
                          {ep.duration}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-haldi/80">মধ্যরাতের রহস্য</p>
                      <h3 className="mt-1.5 font-bangla text-base font-bold leading-snug text-amber-50">{ep.title}</h3>
                      {ep.description && <p className="mt-1.5 line-clamp-2 font-bangla text-xs leading-relaxed text-amber-100/65">{ep.description}</p>}
                      <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-amber-100/50">
                        <Youtube className="h-3 w-3" />
                        {youtubeId(ep.youtube_url) ? 'প্লেয়ারে শুনুন' : 'ইউটিউবে শুনুন'}
                      </p>
                    </div>
                  </motion.article>
                );
              })}

            {!loading && episodes.length === 0 && (
              <p className="w-full rounded-2xl border border-dashed border-amber-100/25 px-6 py-10 text-center font-bangla text-sm text-amber-100/70">
                প্রথম পর্ব রেকর্ড হচ্ছে — চোখ রাখুন মাঝরাতে।
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
