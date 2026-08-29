import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { type UpdateVideo } from '../lib/api';
import { youtubeId, ytThumb } from '../lib/youtube';

interface StoryEpisode {
  id: number | string;
  title: string;
  youtube_url: string;
  thumbnail_url?: string;
}

interface StoryProps {
  onPlay: (video: UpdateVideo) => void;
}

export default function Story({ onPlay }: StoryProps) {
  const [episodes, setEpisodes] = useState<StoryEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        const res = await fetch('/data.json');
        const json = await res.json();
        setEpisodes(json.story || []);
      } catch (err) {
        console.error('Error fetching story episodes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  return (
    <section id="story" className="relative overflow-hidden bg-paper-dark py-24 text-paper-soft">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          kicker="Audio Stories"
          title="গল্পের আসর"
          sub="রহস্য, রোমাঞ্চ ও ভীতি — অলৌকিক অভিজ্ঞতার অডিও ড্রামা"
          light
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            [0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-paper-soft/5 p-4">
                <div className="aspect-video rounded-xl bg-paper-soft/10" />
                <div className="mt-4 h-5 w-3/4 rounded bg-paper-soft/10" />
              </div>
            ))}

          {!loading &&
            episodes.map((item, i) => {
              const url = item.youtube_url || '';
              const thumb = item.thumbnail_url || ytThumb(url);

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-paper-soft/10 bg-paper-soft/5 p-4 transition-colors hover:border-sindoor/40 hover:bg-paper-soft/10"
                  onClick={() =>
                    youtubeId(url) &&
                    onPlay({
                      id: Number(item.id) || (item.id as any),
                      title: item.title,
                      youtube_url: url,
                      category: 'গল্প',
                      featured: false,
                      sort_order: i,
                      created_at: '',
                    })
                  }
                >
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-ink">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-paper-soft/10">
                        <Sparkles className="h-10 w-10 text-sindoor" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                    <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-sindoor text-white shadow-lg transition-transform group-hover:scale-110">
                      <Play className="ml-1 h-6 w-6 fill-white" />
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-editorial text-lg font-bold leading-snug text-paper-soft transition-colors group-hover:text-sindoor">
                      {item.title}
                    </h3>
                  </div>
                </motion.article>
              );
            })}
        </div>
      </div>
    </section>
  );
}
