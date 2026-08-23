import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ytEmbed, type Playable } from '../lib/api-bridge';

interface VideoModalProps {
  video: Playable | null;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const embed = video ? ytEmbed(video.youtube_url) : null;

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
        >
          <motion.div
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="paper-card w-full max-w-3xl overflow-hidden p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b-2 border-ink/10 bg-paper-deep/60 px-4 py-3 sm:px-5">
              <h4 className="truncate font-editorial text-base font-bold text-ink sm:text-lg">{video.title}</h4>
              <button
                onClick={onClose}
                aria-label="Close player"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white/80 text-ink/70 hover:text-sindoor"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            {embed ? (
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={embed}
                  title={video.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-ink px-6 text-center">
                <p className="font-bangla text-amber-100">এই ভিডিওটি ইউটিউবে দেখতে নিচের বোতামে চাপুন</p>
                <a
                  href={video.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-sindoor px-6 py-3 font-semibold text-paper-soft transition-colors hover:bg-sindoor-deep"
                >
                  ইউটিউবে খুলুন
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
