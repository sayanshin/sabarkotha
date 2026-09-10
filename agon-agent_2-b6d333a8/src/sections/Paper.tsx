import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BookOpen, Download } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { api, type PaperLink } from '../lib/api';

export default function Paper() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const [papers, setPapers] = useState<PaperLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPapers() {
      try {
        const data = await api.papers.list();
        setPapers(data);
      } catch (err) {
        console.error('Error fetching papers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPapers();
  }, []);

  return (
    <section id="paper" ref={ref} className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      {/* Background Image Container - Fully Visible with Parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0" aria-hidden="true">
        <img
          src="/assets/asset8.png"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        {/* Soft edge gradients for smooth section transitions */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-paper to-transparent opacity-80" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper to-transparent opacity-80" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        {/* Title Header with subtle backdrop blur for sharp text contrast */}
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="absolute inset-0 -z-10 rounded-full bg-paper/60 blur-2xl" />
          <SectionHeading kicker="Paper" title="ই-পত্রিকা" sub="পড়ুন আজকের ডিজিটাল সংস্করণ" />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <p className="col-span-full text-center font-bangla text-ink-soft">লোড হচ্ছে...</p>}

          {!loading &&
            papers.map((p: any) => {
              const displayDate = p.publish_date || p.date || p.created_at || 'ডিজিটাল পত্রিকা';
              const displayDesc = p.description || p.dscription || '';
              const fileUrl = p.pdf_url || p.paper_url || p.url || '#';

              return (
                <div
                  key={p.id}
                  className="paper-card flex flex-col justify-between p-6 shadow-xl backdrop-blur-md bg-paper/90 transition-transform hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center gap-3 text-sindoor">
                      <BookOpen className="h-6 w-6" />
                      <span className="text-xs font-bold uppercase tracking-wider">{displayDate}</span>
                    </div>
                    <h3 className="mt-3 font-editorial text-xl font-bold text-ink">{p.title}</h3>
                    {displayDesc && <p className="mt-2 text-sm text-ink-soft">{displayDesc}</p>}
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sindoor px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-sindoor-dark"
                    >
                      <Download className="h-4 w-4" /> পড়ুন / ডাউনলোড
                    </a>
                  </div>
                </div>
              );
            })}

          {!loading && papers.length === 0 && (
            <p className="col-span-full text-center font-bangla text-ink-soft">
              কোনো ই-পত্রিকা যোগ করা হয়নি। অ্যাডমিন প্যানেল থেকে যোগ করুন।
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
