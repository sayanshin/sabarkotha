import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Pencil, Play, Plus, Trash2, Youtube } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { useAdmin } from '../context/AdminContext';
import { useData } from '../context/DataContext';
import { api, type UpdateVideo } from '../lib/api';
import { ytThumb, youtubeId } from '../lib/youtube';

interface UpdatesProps {
  onPlay: (video: UpdateVideo) => void;
  onManage: () => void;
}

export default function Updates({ onPlay, onManage }: UpdatesProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const { videos, loading, refreshVideos } = useData();
  const { isAdmin } = useAdmin();

  const removeVideo = async (v: UpdateVideo) => {
    if (!window.confirm(`মুছে ফেলবেন: “${v.title}”?`)) return;
    try {
      await api.updates.remove(v.id);
      await refreshVideos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'মোছা যায়নি');
    }
  };

  return (
    <section id="updates" ref={ref} className="relative scroll-mt-24 overflow-hidden">
      {/* hand-drawn Durga Puja backdrop */}
      <motion.div style={{ y: bgY }} className="absolute inset-x-0 top-0 h-[620px]" aria-hidden="true">
        <img
          src="/assets/asset1.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-paper to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-b from-transparent via-paper/70 to-paper" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-24 sm:pt-32">
        {/* heading matted on paper so the puja artwork never harms readability */}
        <div className="paper-ribbon">
          <SectionHeading
            kicker="Updates"
            title="আজকের বড় খবর"
            sub="পুজো মণ্ডপের সিঁদুর থেকে পাড়ার চায়ের দোকান — প্রতিদিনের নির্বাচিত ভিডিও সংবাদ"
          />
        </div>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            [0, 1, 2].map((i) => (
              <div key={i} className="paper-card animate-pulse overflow-hidden p-0">
                <div className="aspect-video bg-ink/10" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 rounded bg-ink/10" />
                  <div className="h-3 w-1/3 rounded bg-ink/10" />
                </div>
              </div>
            ))}

          {!loading &&
            videos.map((v, i) => {
              const thumb = ytThumb(v.youtube_url);
              return (
                <motion.article
                  key={v.id}
                  initial={{ opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.55 }}
                  className={`group relative cursor-pointer ${i % 2 === 0 ? 'sm:-rotate-[0.6deg]' : 'sm:rotate-[0.7deg]'} transition-transform hover:rotate-0`}
                  onClick={() => onPlay(v)}
                >
                  <div className="paper-card overflow-hidden p-0">
                    <div className="relative aspect-video overflow-hidden bg-ink">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={v.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#c4442a,#7c1409)]">
                          <Youtube className="h-16 w-16 text-paper-soft/90" strokeWidth={1.4} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                      <span className="absolute left-3 top-3 rounded-full border border-ink/10 bg-paper-soft/95 px-3 py-1 text-xs font-bold text-ink shadow">
                        {v.category}
                      </span>
                      {v.featured && (
                        <span className="absolute right-3 top-3 rounded-full bg-haldi px-3 py-1 text-xs font-bold text-ink shadow">
                          ★ ফিচার্ড
                        </span>
                      )}
                      <span className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/40 bg-sindoor/90 text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
                        <Play className="ml-1 h-7 w-7 fill-white" />
                      </span>
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="font-editorial text-lg font-bold leading-snug text-ink transition-colors group-hover:text-sindoor">
                        {v.title}
                      </h3>
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                        <Youtube className="h-3.5 w-3.5 text-sindoor" />
                        {youtubeId(v.youtube_url) ? 'ইন-অ্যাপ প্লেয়ারে দেখুন' : 'ইউটিউবে দেখুন'}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="absolute right-2.5 top-[42%] z-10 flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onManage()}
                        aria-label="Edit in editor desk"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/20 bg-paper-soft/95 text-ink shadow hover:text-gold"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeVideo(v)}
                        aria-label="Delete video"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/20 bg-paper-soft/95 text-ink shadow hover:text-sindoor"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </motion.article>
              );
            })}

          {!loading && videos.length === 0 && (
            <p className="col-span-full rounded-2xl border-2 border-dashed border-ink/20 bg-paper-soft/80 px-6 py-10 text-center font-bangla text-ink-soft">
              এখনও কোনো ভিডিও যোগ হয়নি — সম্পাদক সোনার কলম ছুঁড়ে দাঁড়িয়ে আছেন।
            </p>
          )}

          {isAdmin && (
            <button
              onClick={onManage}
              className="group flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[18px] border-[3px] border-dashed border-sindoor/45 bg-sindoor/5 text-sindoor transition-colors hover:bg-sindoor/10"
            >
              <Plus className="h-9 w-9 transition-transform group-hover:rotate-90" />
              <span className="font-bangla text-base font-bold">নতুন ইউটিউব ভিডিও যোগ করুন</span>
              <span className="text-xs opacity-70">সম্পাদকের ডেস্ক খুলবে</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
