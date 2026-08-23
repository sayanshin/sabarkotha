import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Moon, Play, Plus, Youtube } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { useAdmin } from '../context/AdminContext';
import { api, type NewsItem, type UpdateVideo } from '../lib/api';
import { ytThumb, youtubeId } from '../lib/youtube';

interface StoryProps {
  onPlay?: (video: UpdateVideo) => void;
  onManage?: () => void;
}

export default function Story({ onPlay, onManage }: StoryProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  const [stories, setStories] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    async function loadStories() {
      try {
        const data = await api.getNews();
        const filtered = (data || []).filter((item) => item.story_url);
        setStories(filtered);
      } catch (err) {
        console.error('Error loading stories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  return (
    <section id="story" ref={ref} className="relative scroll-mt-24 overflow-hidden bg-ink py-24 text-paper-soft">
      {/* Background Image Layer */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none opacity-40">
        <img
          src="/assets/asset2.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-radial-vignette" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <SectionHeading
          kicker="Midnight Stories"
          title="মধ্যরাতের রহস্য"
          sub="আমাদের গল্পকথন চ্যানেল — টুর্ডি-বাতির আলোয় গা ছমছমে গ্রাম বাংলার রহস্যগল্প, প্রতি রাতে"
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            [0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-paper-soft/10 bg-paper/5 backdrop-blur-md p-4">
                <div className="aspect-video bg-paper-soft/10 rounded-xl" />
                <div className="mt-4 h-4 w-3/4 rounded bg-paper-soft/10" />
              </div>
            ))}

          {!loading &&
            stories.map((item, i) => {
              const url = item.story_url || '';
              const thumb = item.thumbnail_url || ytThumb(url);

              const handleItemClick = () => {
                if (youtubeId(url) && onPlay) {
                  onPlay({
                    id: (Number(item.id) || item.id) as any,
                    title: item.dscription || 'মধ্যরাতের রহস্য গল্প',
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
                <div
                  key={item.id}
                  onClick={handleItemClick}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-paper-soft/15 bg-paper/10 backdrop-blur-md p-4 transition-all hover:border-sindoor/60 hover:bg-paper/20 shadow-xl"
                >
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-black/50">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={item.dscription || 'Story'}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#c4442a,#7c1409)]">
                        <Youtube className="h-12 w-12 text-paper-soft/80" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/10">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sindoor text-white shadow-xl transition-transform group-hover:scale-110">
                        <Play className="ml-1 h-7 w-7 fill-white" />
                      </span>
                    </div>
                  </div>

                  <h4 className="mt-4 font-editorial text-lg font-bold text-paper-soft transition-colors group-hover:text-sindoor">
                    {item.dscription || 'মধ্যরাতের রহস্য গল্প'}
                  </h4>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-paper-soft/70">
                    <Youtube className="h-3.5 w-3.5 text-sindoor" />
                    ইন-অ্যাপ প্লেয়ারে দেখুন
                  </p>
                </div>
              );
            })}

          {!loading && stories.length === 0 && (
            <div className="col-span-full rounded-2xl border border-paper-soft/10 bg-paper/5 backdrop-blur-md p-12 text-center">
              <Moon className="mx-auto h-12 w-12 text-paper-soft/40" />
              <h4 className="mt-4 font-editorial text-2xl font-bold text-paper-soft">রাত বিরেতে গল্প শোনার ঠিকানা</h4>
              <p className="mt-2 text-sm text-paper-soft/60">
                Midnight tales from the Bengali countryside — subscribe and listen every night.
              </p>
            </div>
          )}

          {isAdmin && onManage && (
            <button
              onClick={onManage}
              className="group flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-paper-soft/30 bg-paper/5 backdrop-blur-md text-paper-soft transition-colors hover:border-sindoor hover:bg-paper/10"
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
