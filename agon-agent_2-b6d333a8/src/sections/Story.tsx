import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Film, Play } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { api, type StoryEpisode, type UpdateVideo } from '../lib/api';
import { ytThumb } from '../lib/youtube';

interface StoryProps {
  onPlay?: (video: UpdateVideo) => void;
}

export default function Story({ onPlay }: StoryProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const [episodes, setEpisodes] = useState<StoryEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEpisodes() {
      try {
        const data = await api.episodes.list();
        setEpisodes(data);
      } catch (err) {
        console.error('Error fetching story episodes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEpisodes();
  }, []);

  return (
    <section id="story" ref={ref} className="relative scroll-mt-24 overflow-hidden bg-slate-950 py-24 sm:py-32">
      {/* Background Image Container with Dark Horror Vibe */}
      <motion.div style={{ y: bgY }} className="absolute inset-0" aria-hidden="true">
        <img
          src="/06-Story-Haunted-Village.png"
          alt=""
          className="h-full w-full object-cover object-center opacity-80 contrast-125 brightness-75"
        />
        {/* Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-black/30 backdrop-contrast-125" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        {/* White / Light text styling for dark background contrast */}
        <div className="[&_h2]:!text-amber-50 [&_p]:!text-zinc-300 [&_span]:!text-red-500">
          <SectionHeading kicker="Story" title="বিশেষ গল্প ও পর্ব" sub="দৈনন্দিন খবরের পেছনের আসল ঘটনা" />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <p className="col-span-full text-center font-bangla text-zinc-300">লোড হচ্ছে...</p>}

          {!loading &&
            episodes.map((item: any, i) => {
              const videoUrl = item.youtube_url || item.url || '';
              const thumb = item.thumbnail_url || (videoUrl ? ytThumb(videoUrl) : '');
              const desc = item.description || item.dscription || '';

              return (
                <div
                  key={item.id || i}
                  className="paper-card cursor-pointer overflow-hidden p-0 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-red-950/50"
                  onClick={() =>
                    onPlay?.({
                      id: (Number(item.id) || item.id) as any,
                      title: item.title || 'বিশেষ গল্প',
                      youtube_url: videoUrl,
                      category: 'গল্প',
                      featured: false,
                      sort_order: i,
                      created_at: item.created_at || '',
                    })
                  }
                >
                  <div className="relative aspect-video bg-black">
                    {thumb ? (
                      <img src={thumb} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-500">
                        <Film className="h-12 w-12" />
                      </div>
                    )}
                    <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-700/90 text-white shadow-lg transition-transform hover:scale-110">
                      <Play className="ml-1 h-6 w-6 fill-white" />
                    </span>
                  </div>

                  <div className="p-4 bg-zinc-900/90">
                    <h3 className="font-editorial text-lg font-bold text-zinc-100">{item.title}</h3>
                    {desc && <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{desc}</p>}
                  </div>
                </div>
              );
            })}

          {!loading && episodes.length === 0 && (
            <p className="col-span-full text-center font-bangla text-zinc-300">
              কোনো গল্প যোগ করা হয়নি। অ্যাডমিন প্যানেল থেকে নতুন পর্ব যোগ করুন।
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
