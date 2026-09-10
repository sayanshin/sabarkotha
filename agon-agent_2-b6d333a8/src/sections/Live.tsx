import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Radio } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { api, type LiveBroadcast } from '../lib/api';
import { ytEmbed } from '../lib/youtube';

export default function Live() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const [liveData, setLiveData] = useState<LiveBroadcast | null>(null);

  useEffect(() => {
    async function loadLive() {
      try {
        const data = await api.live.get();
        setLiveData(data);
      } catch (err) {
        console.error('Error loading live data:', err);
      }
    }
    loadLive();
  }, []);

  const embed = liveData?.youtube_url ? ytEmbed(liveData.youtube_url) : null;

  return (
    <section id="live" ref={ref} className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <motion.div style={{ y: bgY }} className="absolute inset-0" aria-hidden="true">
        <img src="/assets/asset9.png" alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-paper to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-5xl px-4">
        <SectionHeading kicker="Live" title="সরাসরি সম্প্রচার" sub="সব সময়ের সেরা খবর, সরাসরি আপনার পর্দায়" />

        <div className="mt-12 overflow-hidden rounded-2xl border-4 border-sindoor/30 bg-ink shadow-2xl">
          {liveData?.is_live && embed ? (
            <div className="aspect-video w-full">
              <iframe
                src={embed}
                title={liveData.title || 'Live Stream'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          ) : (
            <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center text-paper-soft">
              <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sindoor/20 text-sindoor">
                <Radio className="h-10 w-10 animate-pulse" />
              </div>
              <h3 className="font-editorial text-2xl font-bold">{liveData?.title || 'এই মুহূর্তে কোনো লাইভ নেই'}</h3>
              <p className="mt-2 text-sm text-paper-soft/70">
                {liveData?.description || 'পরবর্তী সরাসরি সম্প্রচারের জন্য সাথে থাকুন।'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
