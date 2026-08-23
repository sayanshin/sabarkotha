import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Play, Plus, Youtube } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { useAdmin } from '../context/AdminContext';
import { api, type NewsItem, type UpdateVideo } from '../lib/api';
import { ytThumb, youtubeId } from '../lib/youtube';

interface UpdatesProps {
  onPlay: (video: UpdateVideo) => void;
  onManage: () => void;
}

interface FlattenedNewsCard {
  id: string;
  url: string;
  title: string;
  typeLabel: string;
  customThumb: string | null;
  created_at: string;
}

export default function Updates({ onPlay, onManage }: UpdatesProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const [cards, setCards] = useState<FlattenedNewsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    async function loadNews() {
      try {
        const data: NewsItem[] = await api.getNews();
        
        const list: FlattenedNewsCard[] = [];
        (data || []).forEach((item) => {
          // Fallback safely if dscription or thumbnail_url is NULL
          const desc = item.dscription || 'সবার কথা নতুন আপডেট';
          const createdAt = item.created_at || '';
          const customThumb = item.thumbnail_url || null;

          if (item.news_url) {
            list.push({ id: `${item.id}-news`, url: item.news_url, title: desc, typeLabel: 'সংবাদ', customThumb, created_at: createdAt });
          }
          if (item.live_url) {
            list.push({ id: `${item.id}-live`, url: item.live_url, title: desc, typeLabel: 'লাইভ', customThumb, created_at: createdAt });
          }
          if (item.story_url) {
            list.push({ id: `${item.id}-story`, url: item.story_url, title: desc, typeLabel: 'শর্টস / স্টোরি', customThumb, created_at: createdAt });
          }
          if (item.channel_url) {
            list.push({ id: `${item.id}-channel`, url: item.channel_url, title: desc, typeLabel: 'চ্যানেল', customThumb, created_at: createdAt });
          }
        });

        setCards(list);
      } catch (err) {
        console.error('Error loading news:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  return (
    <section id="updates" ref={ref} className="relative scroll-mt-24 overflow-hidden">
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
            cards.map((card, i) => {
              const thumb = card.customThumb || ytThumb(card.url);

              const handleItemClick = () => {
                if (youtubeId(card.url)) {
                  onPlay({
                    id: card.id as any,
                    title: card.title,
                    youtube_url: card.url,
                    category: card.typeLabel,
                    featured: false,
                    sort_order: i,
                    created_at: card.created_at,
                  });
                } else {
                  window.open(card.url, '_blank');
                }
              };

              return (
                <motion.article
                  key={card.id}
                  initial={{ opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.55 }}
                  className={`group relative cursor-pointer ${
                    i % 2 === 0 ? 'sm:-rotate-[0.6deg]' : 'sm:rotate-[0.7deg]'
                  } transition-transform hover:rotate-0`}
                  onClick={handleItemClick}
                >
                  <div className="paper-card overflow-hidden p-0">
                    <div className="relative aspect-video overflow-hidden bg-ink">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={card.title}
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

                      <span className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/40 bg-sindoor/90 text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
                        {youtubeId(card.url) ? (
                          <Play className="ml-1 h-7 w-7 fill-white" />
                        ) : (
                          <ExternalLink className="h-7 w-7 stroke-white" />
                        )}
                      </span>
                    </div>

                    <div className="p-4 sm:p-5">
                      <div className="mb-2 inline-block rounded-full bg-sindoor/10 px-2.5 py-0.5 text-xs font-semibold text-sindoor">
                        {card.typeLabel}
                      </div>
                      <h3 className="font-editorial text-lg font-bold leading-snug text-ink transition-colors group-hover:text-sindoor">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                        <Youtube className="h-3.5 w-3.5 text-sindoor" />
                        {youtubeId(card.url) ? 'ইন-অ্যাপ প্লেয়ারে দেখুন' : 'ইউটিউবে সরাসরি দেখুন'}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}

          {!loading && cards.length === 0 && (
            <p className="col-span-full rounded-2xl border-2 border-dashed border-ink/20 bg-paper-soft/80 px-6 py-10 text-center font-bangla text-ink-soft">
              এখনও কোনো খবর আপডেট যোগ হয়নি — সরাসরি Supabase থেকে ডেটা আসছে।
            </p>
          )}

          {isAdmin && (
            <button
              onClick={onManage}
              className="group flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[18px] border-[3px] border-dashed border-sindoor/45 bg-sindoor/5 text-sindoor transition-colors hover:bg-sindoor/10"
            >
              <Plus className="h-9 w-9 transition-transform group-hover:rotate-90" />
              <span className="font-bangla text-base font-bold">নতুন খবর যোগ করুন</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
