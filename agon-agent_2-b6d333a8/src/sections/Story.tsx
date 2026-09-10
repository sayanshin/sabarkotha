import { useEffect, useState } from 'react';
import { Film, Play } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { api, type StoryEpisode, type UpdateVideo } from '../lib/api';
import { ytThumb } from '../lib/youtube';

interface StoryProps {
  onPlay?: (video: UpdateVideo) => void;
}

export default function Story({ onPlay }: StoryProps) {
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
    <section id="story" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading kicker="Story" title="বিশেষ গল্প ও পর্ব" sub="দৈনন্দিন খবরের পেছনের আসল ঘটনা" />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <p className="col-span-full text-center font-bangla text-ink-soft">লোড হচ্ছে...</p>}

          {!loading &&
            episodes.map((item: any, i) => {
              const videoUrl = item.youtube_url || item.url || '';
              const thumb = item.thumbnail_url || (videoUrl ? ytThumb(videoUrl) : '');
              const desc = item.description || item.dscription || '';

              return (
                <div
                  key={item.id || i}
                  className="paper-card cursor-pointer overflow-hidden p-0 transition-transform hover:-translate-y-1"
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
                  <div className="relative aspect-video bg-ink">
                    {thumb ? (
                      <img src={thumb} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-paper-soft">
                        <Film className="h-12 w-12" />
                      </div>
                    )}
                    <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-sindoor/90 text-white shadow-lg">
                      <Play className="ml-1 h-6 w-6 fill-white" />
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-editorial text-lg font-bold text-ink">{item.title}</h3>
                    {desc && <p className="mt-1 line-clamp-2 text-xs text-ink-soft">{desc}</p>}
                  </div>
                </div>
              );
            })}

          {!loading && episodes.length === 0 && (
            <p className="col-span-full text-center font-bangla text-ink-soft">
              কোনো গল্প যোগ করা হয়নি। অ্যাডমিন প্যানেল থেকে নতুন পর্ব যোগ করুন।
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
