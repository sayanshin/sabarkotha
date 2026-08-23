import { useEffect, useState } from 'react';
import { Moon, Play, Youtube } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { api, type NewsItem, type UpdateVideo } from '../lib/api';
import { ytThumb, youtubeId } from '../lib/youtube';

interface StoryProps {
  onPlay?: (video: UpdateVideo) => void;
}

export default function Story({ onPlay }: StoryProps) {
  const [stories, setStories] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        const data = await api.getNews();
        // Filter items that have story_url
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
    <section id="story" className="relative scroll-mt-24 bg-ink py-24 text-paper-soft overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <SectionHeading
          kicker="Midnight Stories"
          title="মধ্যরাতের রহস্য"
          sub="আমাদের গল্পকথন চ্যানেল — টুর্ডি-বাতির আলোয় গা ছমছমে গ্রাম বাংলার রহস্যগল্প, প্রতি রাতে"
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            stories.map((item, i) => {
              const url = item.story_url || '';
              const thumb = item.thumbnail_url || ytThumb(url);

              const handleItemClick = () => {
                if (youtubeId(url) && onPlay) {
                  onPlay({
                    id: (Number(item.id) || item.id) as any,
                    title: item.dscription || 'মধ্যরাতের গল্প',
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
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-paper-soft/10 bg-paper/5 p-4 transition-all hover:border-paper-soft/30 hover:bg-paper/10"
                >
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-black/40">
                    {thumb ? (
                      <img src={thumb} alt={item.dscription || 'Story'} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Moon className="h-12 w-12 text-paper-soft/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sindoor text-white shadow-lg">
                        <Play className="ml-0.5 h-6 w-6 fill-white" />
                      </span>
                    </div>
                  </div>
                  <h4 className="mt-4 font-editorial text-lg font-bold text-paper-soft group-hover:text-sindoor">
                    {item.dscription || 'মধ্যরাতের রহস্য গল্প'}
                  </h4>
                </div>
              );
            })}

          {!loading && stories.length === 0 && (
            <div className="col-span-full rounded-2xl border border-paper-soft/10 bg-paper/5 p-12 text-center">
              <Moon className="mx-auto h-12 w-12 text-paper-soft/40" />
              <h4 className="mt-4 font-editorial text-2xl font-bold">রাত বিরেতে গল্প শোনার ঠিকানা</h4>
              <p className="mt-2 text-sm text-paper-soft/60">
                Midnight tales from the Bengali countryside — subscribe and listen every night.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
