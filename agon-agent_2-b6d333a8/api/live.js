import { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { youtubeEmbedUrl } from '../lib/youtube';

interface LiveConfig {
  isLive?: boolean;
  title?: string;
  youtube_url?: string;
}

export default function Live() {
  const [liveData, setLiveData] = useState<LiveConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLive() {
      try {
        const res = await fetch('/data.json');
        const json = await res.json();
        if (json.live) {
          setLiveData(json.live);
        }
      } catch (err) {
        console.error('Error fetching live data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLive();
  }, []);

  const embedUrl = liveData?.youtube_url ? youtubeEmbedUrl(liveData.youtube_url) : '';
  const isCurrentlyLive = Boolean(liveData?.isLive && embedUrl);

  return (
    <section id="live" className="relative bg-paper-dark py-20 text-paper-soft">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          kicker="Live Broadcast"
          title="সরাসরি সম্প্রচার"
          sub="পাড়ায় বসে সরাসরি খবর ও বিশেষ অনুষ্ঠান"
          light
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="space-y-4 lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-sindoor/40 bg-sindoor/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sindoor">
              <span className={`h-2 w-2 rounded-full ${isCurrentlyLive ? 'animate-ping bg-sindoor' : 'bg-gray-400'}`} />
              {isCurrentlyLive ? 'এখন লাইভ' : 'অফলাইন'}
            </div>

            <h3 className="font-editorial text-2xl font-bold text-paper-soft sm:text-3xl">
              {isCurrentlyLive ? liveData?.title || 'আজকের লাইভ সম্প্রচার' : 'এখন সম্প্রচার বন্ধ'}
            </h3>

            <p className="font-bangla text-paper-soft/70">
              প্রতিদিন ভোরের সংবাদ সকাল ৭টায়, প্রধান সংবাদ সন্ধ্যা ৬টায়। লাইভ শুরু হলেই এই পাতায় সরাসরি দেখা যাবে।
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-paper-soft/10 bg-ink shadow-2xl">
              {loading ? (
                <div className="flex h-full w-full items-center justify-center font-bangla text-paper-soft/60">
                  লোড হচ্ছে...
                </div>
              ) : isCurrentlyLive ? (
                <iframe
                  src={`${embedUrl}?autoplay=1`}
                  title={liveData?.title || 'Live Stream'}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                  <Radio className="h-12 w-12 text-paper-soft/40" />
                  <p className="mt-4 font-bangla text-lg font-semibold text-paper-soft/80">
                    পরবর্তী লাইভ সিডিউল শীঘ্রই
                  </p>
                  <p className="mt-1 text-xs text-paper-soft/50">
                    The broadcast room is quiet — the dhak will sound again soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
