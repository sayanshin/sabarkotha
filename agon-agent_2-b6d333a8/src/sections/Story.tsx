import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Moon, Play, Plus, Youtube } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

interface StoryItem {
  id: number | string;
  youtube_url?: string;
  url?: string;
  dscription?: string;
  description?: string;
  title?: string;
  thumbnail_url?: string;
  created_at?: string;
}

interface StoryProps {
  onPlay?: (video: {
    id: number;
    title: string;
    youtube_url: string;
    category: string;
    featured: boolean;
    sort_order: number;
    created_at: string;
  }) => void;
  onManage?: () => void;
}

function getYoutubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getYtThumb(url: string): string {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

export default function Story({ onPlay, onManage }: StoryProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        const res = await fetch('/data.json');
        const json = await res.json();
        
        const rawList: StoryItem[] = Array.isArray(json) 
          ? json 
          : (json.stories || json.story || []);

        const filtered = rawList.filter((item) => item.youtube_url || item.url);
        setStories(filtered);
      } catch (err) {
        console.error('Error loading static JSON stories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  return (
    <section id="story" ref={ref} className="relative scroll-mt-24 overflow-hidden bg-[#0a0808] py-24 text-white">
      {/* Background Image */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/06-Story-Haunted-Village.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center filter brightness-[0.4] contrast-125 opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0808]/90 via-transparent to-[#0a0808]" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="paper-ribbon">
          <SectionHeading
            kicker="MIDNIGHT STORIES"
            title="মধ্যরাতের রহস্য"
            sub="আমাদের গল্পকথন চ্যানেল — টুর্ডি-বাতির আলোয় গা ছমছমে গ্রাম বাংলার রহস্যগল্প, প্রতি রাতে"
          />
        </div>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            [0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-[#2a2421] bg-[#14100e]/80 p-0 shadow-lg">
                <div className="aspect-video bg-[#251d18]/60 rounded-t-2xl" />
                <div className="space-y-2 p-5">
                  <div className="h-4 w-3/4 rounded bg-[#251d18]/60" />
                  <div className="h-3 w-1/3 rounded bg-[#251d18]/60" />
                </div>
              </div>
            ))}

          {!loading &&
            stories.map((item, i) => {
              const url = item.youtube_url || item.url || '';
              const titleText = item.dscription || item.description || item.title || 'রহস্য গল্প';
              const thumb = item.thumbnail_url || getYtThumb(url);

              const handleItemClick = () => {
                const ytId = getYoutubeId(url);
                if (ytId && onPlay) {
                  onPlay({
                    id: (Number(item.id) || item.id) as any,
                    title: titleText,
                    youtube_url: url,
                    category: 'গল্প',
                    featured: false,
                    sort_order: i,
                    created_at: item.created_at || '',
                  });
                } else if (url) {
                  window.open(url, '_blank');
                }
              };

              return (
                <motion.article
                  key={item.id || i}
                  initial={{ opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.55 }}
                  className="group relative cursor-pointer"
                  onClick={handleItemClick}
                >
                  {/* Warm Deep Charcoal Card */}
                  <div className="overflow-hidden rounded-2xl border border-[#2e2622] bg-[#141110]/95 shadow-2xl transition-all duration-300 hover:border-[#c4442a]/60 hover:shadow-[#c4442a]/10 hover:shadow-2xl">
                    <div className="relative aspect-video overflow-hidden bg-black">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={titleText}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#c4442a,#121010)]">
                          <Youtube className="h-16 w-16 text-stone-400" strokeWidth={1.4} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141110] via-transparent to-transparent opacity-80" />

                      <span className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/30 bg-[#c4442a]/90 text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
                        <Play className="ml-1 h-7 w-7 fill-white" />
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="font-editorial text-lg font-bold leading-snug text-white transition-colors group-hover:text-[#c4442a]">
                        {titleText}
                      </h3>
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#dcd3c9]/80">
                        <Moon className="h-3.5 w-3.5 text-[#c4442a]" />
                        প্লেয়ারে শুনুন
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}

          {!loading && stories.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#2e2622] bg-[#141110]/80 p-10 text-center">
              <Moon className="h-12 w-12 text-[#dcd3c9]/40" />
              <h3 className="mt-4 font-bangla text-lg font-bold text-white">রাত বিরেতে গল্প শোনার ঠিকানা</h3>
              <p className="mt-1 font-bangla text-xs text-[#dcd3c9]/60">
                এখনও কোনো গল্প যোগ হয়নি — data.json ফাইলে "stories" অ্যারে যোগ করুন।
              </p>
            </div>
          )}

          {onManage && (
            <button
              onClick={onManage}
              className="group flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border-[3px] border-dashed border-[#c4442a]/40 bg-[#c4442a]/5 text-[#c4442a] transition-colors hover:bg-[#c4442a]/10 hover:text-white"
            >
              <Plus className="h-9 w-9 transition-transform group-hover:rotate-90" />
              <span className="font-bangla text-base font-bold">নতুন গল্প যোগ করুন</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
