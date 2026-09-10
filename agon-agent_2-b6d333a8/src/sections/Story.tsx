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
    <section id="story" ref={ref} className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      {/* Background Image - Fully Sharp & Visible */}
      <motion.div style={{ y: bgY }} className="absolute inset-0" aria-hidden="true">
        <img
          src="/06-Story-Haunted-Village.png"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        {/* Subtle top/bottom edge gradients for smooth section transitions */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-paper to-transparent opacity-80" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper to-transparent opacity-80" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        {/* Text Header with Contrast Backplate & Shadow */}
        <div className="relative mx-auto max-w-2xl text-center">
          {/* Subtle radial haze behind text to keep artwork fully visible around it */}
          <div className="absolute inset-0 -z-10 rounded-full bg-black/40 blur-2xl" />
          
          <div className="[&_h2]:!text-amber-50 [&_h2]:drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] [&_p]:!text-zinc-200 [&_p]:drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [&_span]:!text-red-500 [&_span]:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">
            <SectionHeading kicker="Story" title="বিশেষ গল্প ও পর্ব" sub="দৈনন্দিন খবরের পেছনের আসল ঘটনা" />
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <p className="col-span-full text-center font-bangla text-amber-100 drop-shadow">লোড হচ্ছে...</p>}

          {!loading &&
            episodes.map((item: any, i) => {
              const videoUrl = item.youtube_url || item.url || '';
              const thumb = item.thumbnail_url || (videoUrl ? ytThumb(videoUrl) : '');
              const desc = item.description || item.dscription || '';

              return (
                <div
                  key={item.id || i}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/85 backdrop-blur-md shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-red-900/60 hover:shadow-red-950/40"
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
                  <div className="relative aspect-video bg-black overflow-hidden">
                    {thumb ? (
                      <img 
                        src={thumb} 
                        alt={item.title} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600">
                        <Film className="h-12 w-12" />
                      </div>
                    )}
                    <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-700/90 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-1 h-6 w-6 fill-white" />
                    </span>
                  </div>

                  {/* Dark Bottom Section for Horror Aesthetic & High Text Contrast */}
                  <div className="p-4 bg-zinc-900/90 border-t border-zinc-800/80">
                    <h3 className="font-editorial text-lg font-bold text-zinc-100 group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h3>
                    {desc && <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{desc}</p>}
                  </div>
                </div>
              );
            })}

          {!loading && episodes.length === 0 && (
            <p className="col-span-full text-center font-bangla text-amber-100 drop-shadow">
              কোনো গল্প যোগ করা হয়নি। অ্যাডমিন প্যানেল থেকে নতুন পর্ব যোগ করুন।
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
