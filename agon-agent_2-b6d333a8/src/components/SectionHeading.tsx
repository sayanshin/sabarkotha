import { Feather } from 'lucide-react';

interface SectionHeadingProps {
  kicker: string;
  title: string;
  sub?: string;
  dark?: boolean;
}

export default function SectionHeading({ kicker, title, sub, dark = false }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div
        className={`flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.4em] sm:text-xs ${
          dark ? 'text-amber-200/90' : 'text-sindoor'
        }`}
      >
        <span aria-hidden="true" className={`h-px w-8 sm:w-12 ${dark ? 'bg-amber-200/60' : 'bg-sindoor/50'}`} />
        <Feather className="h-3.5 w-3.5" strokeWidth={2.2} />
        <span>{kicker}</span>
        <Feather className="h-3.5 w-3.5 -scale-x-100" strokeWidth={2.2} />
        <span aria-hidden="true" className={`h-px w-8 sm:w-12 ${dark ? 'bg-amber-200/60' : 'bg-sindoor/50'}`} />
      </div>
      <h2
        className={`mt-4 font-editorial text-4xl font-bold leading-tight sm:text-5xl md:text-6xl ${
          dark ? 'text-amber-50' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      <svg viewBox="0 0 240 16" className={`mx-auto mt-4 h-4 w-56 ${dark ? 'text-haldi' : 'text-sindoor'}`} fill="none" aria-hidden="true">
        <path
          d="M4 10 C 50 3, 88 13, 128 7 S 205 4, 236 9"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle cx="120" cy="9" r="2.6" fill="currentColor" />
      </svg>
      {sub && (
        <p className={`mt-4 font-bangla text-base leading-relaxed sm:text-lg ${dark ? 'text-amber-100/85' : 'text-ink-soft'}`}>{sub}</p>
      )}
    </div>
  );
}
