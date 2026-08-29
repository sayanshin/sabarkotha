import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Tv } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { type LiveStream } from '../lib/api';
import { youtubeEmbedUrl } from '../lib/youtube';

interface LiveProps {
  onPlay: (video: { id: number; title: string; youtube_url: string; category: string; featured: boolean; sort_order: number; created_at: string }) => void;
}

export default function Live({ onPlay }: LiveProps) {
  const [stream, setStream] = useState<LiveStream | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLiveStream() {
      try {
        const res = await fetch('/data.json');
        const json = await res.json();
        
        // Read live data object from static data.json safely
        if (json && json.live) {
          setStream({
            is_live: Boolean(json.live.isLive ?? json.live.is_live),
            title: json.live.title || 'লাইভ সম্প্রচার',
            youtube_url: json.live.youtube_url || json.live.youtubeUrl || '',
          });
        }
      } catch (err) {
        console.error('Error loading live stream data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveStream();
  }, []);

  const embedUrl = stream?.youtube_url ? youtubeEmbedUrl(stream.youtube_url) : null;

  return (
    <section id="live" className="relative min-h-[calc(100vh-5rem)] scroll-mt-24 overflow-hidden py-24">
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/asset2.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center filter brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/60 to-paper/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="paper-ribbon">
          <SectionHeading
            kicker="Live Streaming"
            title="সরাসরি সম্প্রচার"
            sub="কলকাতা ও জেলার খবর — মুহূর্তের খবর মুহূর্তে"
          />
        </div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-12">
          {/* Status Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper-soft/90 px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                {stream?.is_live ? (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sindoor opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-sindoor" />
                  </>
                ) : (
                  <span className="h-3 w-3 rounded-full bg-ink/40" />
                )}
              </span>
              <span className="font-bangla text-xs font-bold tracking-wide text-ink">
                {stream?.is_live ? 'সরাসরি সম্পুচার চলছে' : 'অফলাইন'}
              </span>
            </div>

            <h2 className="font-editorial mt-6 text-3xl font-bold leading-tight text-ink sm:text-4xl">
              {stream?.is_live ? stream.title : 'এখন সম্প্রচার বন্ধ'}
            </h2>

            <p className="mt-4 font-bangla text-sm leading-relaxed text-ink-soft sm:text-base">
              {stream?.is_live
                ? 'সরাসরি খবর ও সরাসরি আলোচনা দেখতে ডানপাশের ভিডিও উইন্ডোতে নজর রাখুন।'
                : 'প্রতিদিন ভোরের সংবাদ সকাল ৭টায়, প্রধান সংবাদ সন্ধ্যা ৬টায়। লাইভ শুরু হলেই এই পাতায় সরাসরি দেখা যাবে।'}
            </p>

            {stream?.is_live && (
              <button
                onClick={() =>
                  onPlay({
                    id: Date.now(),
                    title: stream.title,
                    youtube_url: stream.youtube_url,
                    category: 'লাইভ',
                    featured: true,
                    sort_order: 0,
                    created_at: new Date().toISOString(),
                  })
                }
                className="mt-6 flex items-center gap-2 rounded-xl bg-sindoor px-6 py-3 font-bangla text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Tv className="h-4 w-4" />
                ফুলস্ক্রিন প্লেয়ারে দেখুন
              </button>
            )}
          </motion.div>

          {/* Video / Placeholder Box */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="paper-card overflow-hidden p-2 shadow-2xl sm:p-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-ink">
                {loading ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-sindoor border-t-transparent" />
                  </div>
                ) : stream?.is_live && embedUrl ? (
                  <iframe
                    src={`${embedUrl}?autoplay=1&mute=0`}
                    title={stream.title}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-center p-6 text-paper-soft">
                    <Radio className="h-16 w-16 text-paper-soft/40 animate-pulse" />
                    <h3 className="font-editorial mt-4 text-xl font-bold">পরবর্তী লাইভ শিডিউল শীঘ্রই</h3>
                    <p className="mt-1 text-xs text-paper-soft/60">
                      The broadcast room is quiet — the dhak will sound again soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
