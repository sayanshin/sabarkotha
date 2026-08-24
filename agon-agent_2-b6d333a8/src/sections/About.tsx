import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Facebook, Globe, Instagram, Link2, Mail, MessageCircle, Moon, Youtube } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import AlponaDivider from '../components/AlponaDivider';
import { useData } from '../context/DataContext';
import { toBanglaDigits } from '../lib/bn';

function linkIcon(url: string, kind: string): ReactNode {
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return <Youtube className="h-5 w-5" />;
  if (u.includes('facebook.com')) return <Facebook className="h-5 w-5" />;
  if (u.includes('instagram.com')) return <Instagram className="h-5 w-5" />;
  if (u.startsWith('mailto:')) return <Mail className="h-5 w-5" />;
  if (u.includes('wa.me') || u.includes('whatsapp')) return <MessageCircle className="h-5 w-5" />;
  if (kind === 'story') return <Moon className="h-5 w-5" />;
  return <Globe className="h-5 w-5" />;
}

const BRAND_MARKS = [
  {
    src: '/assets/asset3.png',
    title: 'অফিসিয়াল লোগো',
    caption: 'SK News — সবার কথা · ব্র্যান্ড মার্ক',
  },
  {
    src: '/assets/asset5.png',
    title: 'আলপনা ক্রেস্ট',
    caption: 'সবার কথা সিল — সোনালি আলপনা প্রতীক',
  },
  {
    src: '/06-Story-Haunted-Village.png',
    title: 'গল্পকথন আর্ট',
    caption: 'মধ্যরাতের রহস্য — কালি-কাগজের চ্যানেল শিল্প',
  },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const { links: fetchedLinks } = useData() || {};
  const youtubeLink = {
    id: 'yt-channel',
    label: 'Sabar Kotha TV',
    url: 'https://www.youtube.com/@sabarkotha75',
    kind: 'SK News — সবার কথা'
  };
  const links = [youtubeLink, ...(fetchedLinks || [])];

  const youtubeLink = {
    id: 'yt-channel',
    label: 'মধ্যরাতের রহস্য',
    url: 'https://www.youtube.com/@Sonali-R75',
    kind: 'ভৌতিক গল্প, রহস্যময় ঘটনা, অলৌকিক কাহিনি'
  };
  const links = [youtubeLink, ...(fetchedLinks || [])];

  const year = toBanglaDigits(new Date().getFullYear());

  return (
    <section id="about" ref={ref} className="relative scroll-mt-24 overflow-hidden">
      {/* golden alpona crest wallpaper */}
      <motion.div style={{ y: bgY }} aria-hidden="true" className="absolute inset-x-0 top-0 h-[400px]">
        <img src="/assets/asset5.png" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-paper to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-b from-transparent to-paper" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-24 sm:pt-32">
        <div className="paper-ribbon">
          <SectionHeading
            kicker="About"
            title="আমাদের সম্পর্কে"
            sub="সবার কথা — কালি আর জলরঙে বাঁধাই করা একটি বাংলা সংবাদ-জগৎ"
          />
        </div>

        {/* official brand marks — the uploaded assets, displayed exactly as provided */}
        <div className="mt-14 grid gap-7 sm:grid-cols-3">
          {BRAND_MARKS.map((mark, i) => (
            <motion.figure
              key={mark.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className={`paper-card overflow-hidden p-3 ${i === 1 ? 'sm:-translate-y-3' : ''}`}
            >
              <div className="overflow-hidden rounded-xl border-2 border-ink/15">
                <img src={mark.src} alt={mark.title} loading="lazy" decoding="async" className="block aspect-[4/3] w-full object-cover" />
              </div>
              <figcaption className="px-2 pb-2 pt-3.5 text-center">
                <p className="font-editorial text-lg font-bold text-ink">{mark.title}</p>
                <p className="mt-1 font-bangla text-xs leading-relaxed text-ink-soft">{mark.caption}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* official links */}
        <div className="mt-16">
          <div className="flex items-center justify-center gap-3">
            <Link2 className="h-4 w-4 text-sindoor" />
            <h3 className="font-editorial text-2xl font-bold text-ink sm:text-3xl">অফিসিয়াল লিংকসমূহ</h3>
          </div>
          <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
            {links.map((l, i) => (
              <motion.a
                key={l.id}
                href={l.url}
                target={l.url.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: (i % 2) * 0.08, duration: 0.45 }}
                className="group flex items-center gap-4 rounded-2xl border-2 border-ink/15 bg-paper-soft px-5 py-4 shadow-paper transition-all hover:-translate-y-1 hover:border-sindoor"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sindoor/30 bg-sindoor/10 text-sindoor transition-colors group-hover:bg-sindoor group-hover:text-paper-soft">
                  {linkIcon(l.url, l.kind)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bangla text-base font-bold text-ink">{l.label}</span>
                  <span className="block text-xs font-medium uppercase tracking-wider text-ink-soft">
                    {l.kind === 'story' ? 'গল্পের চ্যানেল' : l.kind === 'social' ? 'সোশ্যাল' : l.kind === 'contact' ? 'যোগাযোগ' : 'অফিসিয়াল'}
                  </span>
                </span>
                <Link2 className="h-4 w-4 shrink-0 text-ink/30 transition-colors group-hover:text-sindoor" />
              </motion.a>
            ))}
            {links.length === 0 && (
              <p className="col-span-full rounded-2xl border-2 border-dashed border-ink/20 bg-paper-soft/80 px-6 py-8 text-center font-bangla text-sm text-ink-soft">
                লিংক তালিকা শীঘ্রই আসছে।
              </p>
            )}
          </div>
        </div>
      </div>

      {/* alpona band rolls the page into the dark footer */}
      <AlponaDivider from="rgba(246,238,218,0)" to="rgba(43,20,8,1)" />

      <footer className="relative z-10 bg-[#2b1408] px-4 pb-10 pt-4 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="mx-auto block h-14 w-14 overflow-hidden rounded-full border-2 border-haldi shadow-lg">
            <img src="/assets/asset3.png" alt="Sabar Kotha logo" className="h-full w-full object-cover" />
          </span>
          <p className="mt-4 font-editorial text-2xl font-bold text-amber-50">সবার কথা</p>
          <p className="mt-1 font-bangla text-sm text-amber-100/70">সবার কথা, সবার আগে, সবার কাছে</p>
          <div className="mx-auto mt-6 h-px max-w-xs bg-amber-100/15" />
          <p className="mt-5 text-xs leading-relaxed text-amber-100/55">
            © {year} Sabar Kotha — সবার কথা · Crafted with ink &amp; watercolor in Bengal
          </p>
          <p className="mt-1.5 font-bangla text-xs text-amber-100/45">কলমে-কালিতে আঁকা, মনে-মনেতে লেখা</p>
        </div>
      </footer>
    </section>
  );
}
