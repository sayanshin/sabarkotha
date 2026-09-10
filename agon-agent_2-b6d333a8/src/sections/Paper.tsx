import { useEffect, useState } from 'react';
import { BookOpen, ExternalLink, Download } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { api, type PaperLink } from '../lib/api';

export default function Paper() {
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
    <section id="paper" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading kicker="Paper" title="ই-পত্রিকা" sub="পড়ুন আজকের ডিজিটাল সংস্করণ" />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <p className="col-span-full text-center font-bangla text-ink-soft">লোড হচ্ছে...</p>}

          {!loading &&
            papers.map((p) => (
              <div key={p.id} className="paper-card flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-3 text-sindoor">
                    <BookOpen className="h-6 w-6" />
                    <span className="text-xs font-bold uppercase tracking-wider">{p.publish_date || 'ডিজিটাল পত্রিকা'}</span>
                  </div>
                  <h3 className="mt-3 font-editorial text-xl font-bold text-ink">{p.title}</h3>
                  {p.description && <p className="mt-2 text-sm text-ink-soft">{p.description}</p>}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <a
                    href={p.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sindoor px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-sindoor-dark"
                  >
                    <Download className="h-4 w-4" /> পড়ুন / ডাউনলোড
                  </a>
                </div>
              </div>
            ))}

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
