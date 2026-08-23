import { useEffect, useState } from 'react';
import { Radio, Play, Plus } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { useAdmin } from '../context/AdminContext';
import { api, type NewsItem, type UpdateVideo } from '../lib/api';
import { ytThumb, youtubeId } from '../lib/youtube';

interface LiveProps {
  onPlay?: (video: UpdateVideo) => void;
  onManage?: () => void;
}

export default function Live({ onPlay, onManage }: LiveProps) {
  const [liveItem, setLiveItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    async function loadLive() {
      try {
        const data = await api.getNews();
        const found = (data || []).find((item) => item.live_url);
        setLiveItem(found || null);
      } catch (err) {
        console.error('Error loading live broadcast:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLive();
  }, []);

  const activeUrl = liveItem?.live_url || '';
  const isOnline = Boolean(activeUrl);
  const thumb = liveItem?.thumbnail_url || (activeUrl ? ytThumb(activeUrl) : '');

  const handlePlay = () => {
    if (!activeUrl) return;
    if (youtubeId(activeUrl) && onPlay) {
      onPlay({
        id: (Number(liveItem?.id) || liveItem?.id) as any,
        title: liveItem?.dscription || 'সবার কথা লাইভ',
        youtube_url: activeUrl,
        category: 'লাইভ',
        featured: true,
        sort_order: 0,
        created_at: liveItem?.created_at || '',
      });
    } else {
      window.open(activeUrl, '_blank');
    }
  };

  return (
    <section id="live" className="relative scroll-mt-24 bg-alta-red py-24 text-paper-soft bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/asset9.png')" }}>
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading kicker="Live" title="লাইভ সম্প্রচার" sub="সরাসরি যুক্ত থাকুন সবার কথা-র সাথে" />

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="space-y-6 lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-paper-soft/30 bg-paper-soft/10 px-4 py-1.5 text-sm font-semibold text-paper-soft">
              <Radio className={`h-4 w-4 ${isOnline ? 'animate-pulse text-red-400' : ''}`} />
              {isOnline ? 'সরাসরি সম্প্রচারিত' : 'অফলাইন'}
            </div>

            <h3 className="font-editorial text-3xl font-bold sm:text-4xl">
              {liveItem?.dscription || (isOnline ? 'এখন সরাসরি সম্প্রচার চলছে' : 'এখন সম্প্রচার বন্ধ')}
            </h3>

            <p className="text-paper-soft/80">
              প্রতিদিন ভোরের সংবাদ সকাল ৭টায়, প্রধান সংবাদ সন্ধ্যা ৬টায়। লাইভ শুরু হলেই এই পাতায় সরাসরি দেখা যাবে।
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {isOnline && (
                <button
                  onClick={handlePlay}
                  className="inline-flex items-center gap-2 rounded-xl bg-paper-soft px-6 py-3 font-bold text-alta-red shadow-lg transition-transform hover:scale-105"
                >
                  <Play className="h-5 w-5 fill-alta-red" />
                  লাইভ সম্প্রচার দেখুন
                </button>
              )}

              {isAdmin && onManage && (
                <button
                  onClick={onManage}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-paper-soft/40 bg-paper-soft/10 px-5 py-3 font-bold text-paper-soft hover:bg-paper-soft/20"
                >
                  <Plus className="h-5 w-5" />
                  লাইভ নিয়ন্ত্রণ করুন
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div
              onClick={handlePlay}
              className={`group relative aspect-video overflow-hidden rounded-2xl border-2 border-paper-soft/20 bg-ink shadow-2xl ${
                isOnline ? 'cursor-pointer' : ''
              }`}
            >
              {thumb ? (
                <img
                  src={thumb}
                  alt="Live Stream"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <Radio className="h-16 w-16 text-paper-soft/40" />
                  <h4 className="mt-4 font-editorial text-2xl font-bold text-paper-soft">পরবর্তী লাইভ সিডিউল শীঘ্রই</h4>
                  <p className="mt-2 text-sm text-paper-soft/60">
                    The broadcast room is quiet — the dhak will sound again soon.
                  </p>
                </div>
              )}

              {isOnline && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity group-hover:bg-black/20">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sindoor text-white shadow-xl">
                    <Play className="ml-1 h-8 w-8 fill-white" />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
