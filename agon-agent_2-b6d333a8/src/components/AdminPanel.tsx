import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Link2,
  Loader2,
  LogOut,
  Moon,
  Newspaper,
  Pencil,
  Plus,
  Radio,
  Settings,
  Trash2,
  X,
  Youtube,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useData } from '../context/DataContext';
import {
  api,
  type LiveBroadcast,
  type PaperLink,
  type SiteLink,
  type StoryEpisode,
  type UpdateVideo,
} from '../lib/api';

export type AdminTab = 'updates' | 'live' | 'paper' | 'story' | 'links';

interface AdminPanelProps {
  open: boolean;
  tab: AdminTab;
  onClose: () => void;
  onTabChange: (tab: AdminTab) => void;
}

const TABS: { id: AdminTab; label: string; icon: ReactNode }[] = [
  { id: 'updates', label: 'আপডেট', icon: <Youtube className="h-4 w-4" /> },
  { id: 'live', label: 'লাইভ', icon: <Radio className="h-4 w-4" /> },
  { id: 'paper', label: 'পত্রিকা', icon: <Newspaper className="h-4 w-4" /> },
  { id: 'story', label: 'গল্প', icon: <Moon className="h-4 w-4" /> },
  { id: 'links', label: 'লিংক', icon: <Link2 className="h-4 w-4" /> },
];

/* ---------- shared tiny form atoms ---------- */

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/70">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

function FormShell({
  title,
  onSubmit,
  onCancel,
  busy,
  error,
  ok,
  editing,
  children,
}: {
  title: string;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  busy: boolean;
  error: string;
  ok: string;
  editing: boolean;
  children: ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border-2 border-dashed border-sindoor/40 bg-haldi/10 p-4">
      <h4 className="flex items-center gap-2 font-editorial text-lg font-bold text-ink">
        {editing ? <Pencil className="h-4 w-4 text-sindoor" /> : <Plus className="h-4 w-4 text-sindoor" />} {title}
      </h4>
      {children}
      {error && (
        <p className="flex items-start gap-2 rounded-lg bg-sindoor/10 px-3 py-2 text-sm text-sindoor">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </p>
      )}
      {ok && (
        <p className="flex items-start gap-2 rounded-lg bg-leaf/10 px-3 py-2 text-sm text-leaf">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {ok}
        </p>
      )}
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={busy} className="btn-journey flex-1 py-2 text-sm disabled:opacity-60">
          {busy ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : editing ? 'আপডেট করুন' : 'যোগ করুন'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost px-4 py-2 text-sm">
          বাতিল
        </button>
      </div>
    </form>
  );
}

function ListRow({
  title,
  sub,
  onEdit,
  onDelete,
}: {
  title: string;
  sub?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white/60 px-3.5 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{title}</p>
        {sub && <p className="truncate text-xs text-ink-soft">{sub}</p>}
      </div>
      <button
        onClick={onEdit}
        aria-label={`Edit ${title}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/15 bg-white/80 text-ink/70 hover:border-haldi hover:text-gold"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={onDelete}
        aria-label={`Delete ${title}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/15 bg-white/80 text-ink/70 hover:border-sindoor hover:text-sindoor"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ---------- tab: updates (YouTube videos) ---------- */

const emptyVideo = { title: '', youtube_url: '', category: 'সংবাদ', featured: false };

function UpdatesTab() {
  const { videos, refreshVideos } = useData();
  const [form, setForm] = useState(emptyVideo);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setOk('');
    try {
      if (editingId) {
        await api.updates.update(editingId, form);
        setOk('ভিডিও আপডেট হয়েছে');
      } else {
        await api.updates.create(form);
        setOk('নতুন ভিডিও যোগ হয়েছে');
      }
      await refreshVideos();
      setForm(emptyVideo);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ব্যর্থ হয়েছে');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (v: UpdateVideo) => {
    if (!window.confirm(`মুছে ফেলবেন: “${v.title}”?`)) return;
    try {
      await api.updates.remove(v.id);
      await refreshVideos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'মোছা যায়নি');
    }
  };

  return (
    <div className="space-y-3">
      {!showForm ? (
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(emptyVideo);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sindoor/50 bg-sindoor/5 py-3 text-sm font-semibold text-sindoor hover:bg-sindoor/10"
        >
          <Plus className="h-4 w-4" /> নতুন ইউটিউব ভিডিও যোগ করুন
        </button>
      ) : (
        <FormShell
          title={editingId ? 'ভিডিও সম্পাদনা' : 'নতুন ভিডিও'}
          onSubmit={submit}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
            setError('');
            setOk('');
          }}
          busy={busy}
          error={error}
          ok={ok}
          editing={!!editingId}
        >
          <Field label="শিরোনাম">
            <input className="field" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="ভিডিওর শিরোনাম লিখুন" />
          </Field>
          <Field label="YouTube লিংক" hint="watch / share / shorts / live — যেকোনো ফর্ম্যাট চলবে">
            <input className="field" required dir="ltr" value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="বিভাগ">
              <input className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="সংবাদ / পুজো / গ্রাম বাংলা" />
            </Field>
            <label className="mt-6 flex items-center gap-2 text-sm font-semibold text-ink">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-[#b02818]" />
              ফিচার্ড
            </label>
          </div>
        </FormShell>
      )}

      {!showForm && ok && <p className="rounded-lg bg-leaf/10 px-3 py-2 text-sm text-leaf">{ok}</p>}

      <div className="space-y-2">
        {videos.length === 0 && <p className="rounded-xl bg-white/50 px-4 py-6 text-center text-sm text-ink-soft">এখনও কোনো ভিডিও নেই — প্রথমটি যোগ করুন।</p>}
        {videos.map((v) => (
          <ListRow
            key={v.id}
            title={v.title}
            sub={`${v.category} · ${v.youtube_url}`}
            onEdit={() => {
              setEditingId(v.id);
              setForm({ title: v.title, youtube_url: v.youtube_url, category: v.category, featured: v.featured });
              setShowForm(true);
              setError('');
              setOk('');
            }}
            onDelete={() => remove(v)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- tab: live broadcast ---------- */

function LiveTab() {
  const { live, refreshLive } = useData();
  const [form, setForm] = useState({ title: '', description: '', youtube_url: '', is_live: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    if (live) {
      setForm({ title: live.title, description: live.description, youtube_url: live.youtube_url, is_live: live.is_live });
    }
  }, [live]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setOk('');
    try {
      const payload: Partial<LiveBroadcast> = { ...form };
      if (live?.id) payload.id = live.id;
      await api.live.save(payload);
      setOk(form.is_live ? 'লাইভ সম্প্রচার চালু হয়েছে!' : 'লাইভ তথ্য সংরক্ষিত হয়েছে');
      await refreshLive();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ব্যর্থ হয়েছে');
    } finally {
      setBusy(false);
    }
  };

  return (
    <FormShell title="লাইভ সম্প্রচার নিয়ন্ত্রণ" onSubmit={submit} onCancel={() => setError('')} busy={busy} error={error} ok={ok} editing={!!live}>
      <Field label="সম্প্রচারের শিরোনাম">
        <input className="field" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="যেমন: সন্ধ্যার প্রধান সংবাদ" />
      </Field>
      <Field label="YouTube লাইভ লিংক" hint="লাইভ স্ট্রিম / watch লিংক — খালি রাখলে দর্শকরা অফলাইন নোট দেখবেন">
        <input className="field" dir="ltr" value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" />
      </Field>
      <Field label="বিবরণ / পরবর্তী সময়সূচি">
        <textarea className="field resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="প্রতিদিন সন্ধ্যা ৬টায় প্রধান সংবাদ সরাসরি" />
      </Field>
      <label className="flex items-center gap-3 rounded-xl border-2 border-sindoor/30 bg-white/60 px-4 py-3">
        <input type="checkbox" checked={form.is_live} onChange={(e) => setForm({ ...form, is_live: e.target.checked })} className="h-5 w-5 accent-[#b02818]" />
        <span className="text-sm font-bold text-ink">
          এখন লাইভে আছি
          <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-sindoor/15 px-2 py-0.5 text-xs font-bold text-sindoor">
            <span className={`h-1.5 w-1.5 rounded-full ${form.is_live ? 'live-dot bg-sindoor' : 'bg-ink/30'}`} /> LIVE
          </span>
        </span>
      </label>
    </FormShell>
  );
}

/* ---------- tab: paper links ---------- */

const emptyPaper = { title: '', summary: '', url: '', edition: '' };

function PaperTab() {
  const { papers, refreshPapers } = useData();
  const [form, setForm] = useState(emptyPaper);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setOk('');
    try {
      if (editingId) {
        await api.papers.update(editingId, form);
        setOk('খবর আপডেট হয়েছে');
      } else {
        await api.papers.create(form);
        setOk('নতুন খবর যোগ হয়েছে');
      }
      await refreshPapers();
      setForm(emptyPaper);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ব্যর্থ হয়েছে');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p: PaperLink) => {
    if (!window.confirm(`মুছে ফেলবেন: “${p.title}”?`)) return;
    try {
      await api.papers.remove(p.id);
      await refreshPapers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'মোছা যায়নি');
    }
  };

  return (
    <div className="space-y-3">
      {!showForm ? (
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(emptyPaper);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sindoor/50 bg-sindoor/5 py-3 text-sm font-semibold text-sindoor hover:bg-sindoor/10"
        >
          <Plus className="h-4 w-4" /> আজকের পত্রিকায় নতুন খবর
        </button>
      ) : (
        <FormShell
          title={editingId ? 'খবর সম্পাদনা' : 'নতুন খবর'}
          onSubmit={submit}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
          busy={busy}
          error={error}
          ok={ok}
          editing={!!editingId}
        >
          <Field label="শিরোনাম">
            <input className="field" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="খবরের শিরোনাম" />
          </Field>
          <Field label="লিংক">
            <input className="field" required dir="ltr" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…" />
          </Field>
          <Field label="সংক্ষিপ্ত বিবরণ">
            <textarea className="field resize-none" rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="দু-এক লাইনে খবরের সার" />
          </Field>
          <Field label="সংস্করণ (Edition)" hint="যেমন: আজকের সংস্করণ / সন্ধ্যা সংস্করণ">
            <input className="field" value={form.edition} onChange={(e) => setForm({ ...form, edition: e.target.value })} placeholder="আজকের সংস্করণ" />
          </Field>
        </FormShell>
      )}

      {!showForm && ok && <p className="rounded-lg bg-leaf/10 px-3 py-2 text-sm text-leaf">{ok}</p>}

      <div className="space-y-2">
        {papers.length === 0 && <p className="rounded-xl bg-white/50 px-4 py-6 text-center text-sm text-ink-soft">এখনও কোনো খবর নেই।</p>}
        {papers.map((p) => (
          <ListRow
            key={p.id}
            title={p.title}
            sub={p.url}
            onEdit={() => {
              setEditingId(p.id);
              setForm({ title: p.title, summary: p.summary, url: p.url, edition: p.edition });
              setShowForm(true);
            }}
            onDelete={() => remove(p)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- tab: story episodes ---------- */

const emptyEpisode = { title: '', description: '', youtube_url: '', duration: '' };

function StoryTab() {
  const { episodes, refreshEpisodes } = useData();
  const [form, setForm] = useState(emptyEpisode);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setOk('');
    try {
      if (editingId) {
        await api.episodes.update(editingId, form);
        setOk('পর্ব আপডেট হয়েছে');
      } else {
        await api.episodes.create(form);
        setOk('নতুন পর্ব যোগ হয়েছে');
      }
      await refreshEpisodes();
      setForm(emptyEpisode);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ব্যর্থ হয়েছে');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (ep: StoryEpisode) => {
    if (!window.confirm(`মুছে ফেলবেন: “${ep.title}”?`)) return;
    try {
      await api.episodes.remove(ep.id);
      await refreshEpisodes();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'মোছা যায়নি');
    }
  };

  return (
    <div className="space-y-3">
      {!showForm ? (
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(emptyEpisode);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sindoor/50 bg-sindoor/5 py-3 text-sm font-semibold text-sindoor hover:bg-sindoor/10"
        >
          <Plus className="h-4 w-4" /> মধ্যরাতের রহস্য — নতুন পর্ব
        </button>
      ) : (
        <FormShell
          title={editingId ? 'পর্ব সম্পাদনা' : 'নতুন পর্ব'}
          onSubmit={submit}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
          busy={busy}
          error={error}
          ok={ok}
          editing={!!editingId}
        >
          <Field label="পর্বের শিরোনাম">
            <input className="field" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="যেমন: মাঝরাতের সহযাত্রী" />
          </Field>
          <Field label="YouTube লিংক">
            <input className="field" required dir="ltr" value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" />
          </Field>
          <Field label="বিবরণ">
            <textarea className="field resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="গল্পের এক লাইনের সার" />
          </Field>
          <Field label="দৈর্ঘ্য" hint="যেমন: ১৮ মিনিট">
            <input className="field" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="১৫ মিনিট" />
          </Field>
        </FormShell>
      )}

      {!showForm && ok && <p className="rounded-lg bg-leaf/10 px-3 py-2 text-sm text-leaf">{ok}</p>}

      <div className="space-y-2">
        {episodes.length === 0 && <p className="rounded-xl bg-white/50 px-4 py-6 text-center text-sm text-ink-soft">এখনও কোনো পর্ব নেই।</p>}
        {episodes.map((ep) => (
          <ListRow
            key={ep.id}
            title={ep.title}
            sub={ep.youtube_url}
            onEdit={() => {
              setEditingId(ep.id);
              setForm({ title: ep.title, description: ep.description, youtube_url: ep.youtube_url, duration: ep.duration });
              setShowForm(true);
            }}
            onDelete={() => remove(ep)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- tab: site links ---------- */

const emptyLink = { label: '', url: '', kind: 'official', sort_order: 0 };

function LinksTab() {
  const { links, refreshLinks } = useData();
  const [form, setForm] = useState(emptyLink);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setOk('');
    try {
      if (editingId) {
        await api.links.update(editingId, form);
        setOk('লিংক আপডেট হয়েছে');
      } else {
        await api.links.create(form);
        setOk('নতুন লিংক যোগ হয়েছে');
      }
      await refreshLinks();
      setForm(emptyLink);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ব্যর্থ হয়েছে');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (l: SiteLink) => {
    if (!window.confirm(`মুছে ফেলবেন: “${l.label}”?`)) return;
    try {
      await api.links.remove(l.id);
      await refreshLinks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'মোছা যায়নি');
    }
  };

  return (
    <div className="space-y-3">
      {!showForm ? (
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(emptyLink);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sindoor/50 bg-sindoor/5 py-3 text-sm font-semibold text-sindoor hover:bg-sindoor/10"
        >
          <Plus className="h-4 w-4" /> নতুন লিংক যোগ করুন
        </button>
      ) : (
        <FormShell
          title={editingId ? 'লিংক সম্পাদনা' : 'নতুন লিংক'}
          onSubmit={submit}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
          busy={busy}
          error={error}
          ok={ok}
          editing={!!editingId}
        >
          <Field label="নাম">
            <input className="field" required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="যেমন: ইউটিউব চ্যানেল" />
          </Field>
          <Field label="লিংক">
            <input className="field" required dir="ltr" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ধরণ">
              <select className="field" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
                <option value="official">অফিসিয়াল</option>
                <option value="social">সোশ্যাল</option>
                <option value="story">গল্পের চ্যানেল</option>
                <option value="contact">যোগাযোগ</option>
              </select>
            </Field>
            <Field label="ক্রম">
              <input className="field" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })} />
            </Field>
          </div>
        </FormShell>
      )}

      {!showForm && ok && <p className="rounded-lg bg-leaf/10 px-3 py-2 text-sm text-leaf">{ok}</p>}

      <div className="space-y-2">
        {links.length === 0 && <p className="rounded-xl bg-white/50 px-4 py-6 text-center text-sm text-ink-soft">এখনও কোনো লিংক নেই।</p>}
        {links.map((l) => (
          <ListRow
            key={l.id}
            title={l.label}
            sub={`${l.kind} · ${l.url}`}
            onEdit={() => {
              setEditingId(l.id);
              setForm({ label: l.label, url: l.url, kind: l.kind, sort_order: l.sort_order });
              setShowForm(true);
            }}
            onDelete={() => remove(l)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- the panel shell ---------- */

export default function AdminPanel({ open, tab, onClose, onTabChange }: AdminPanelProps) {
  const { isAdmin, logout } = useAdmin();

  if (!isAdmin) return null;

  return (
    <>
      {!open && (
        <motion.button
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          onClick={() => onTabChange(tab)}
          aria-label="Open editor desk"
          className="fixed bottom-5 right-5 z-[65] flex h-13 w-13 items-center justify-center rounded-2xl border-2 border-amber-100/40 bg-ink text-haldi shadow-paper transition-transform hover:scale-105"
          title="সম্পাদকের ডেস্ক"
          style={{ height: 52, width: 52 }}
        >
          <Settings className="h-5.5 w-5.5" strokeWidth={2} />
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[75] bg-ink/50 backdrop-blur-[2px]"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '105%' }}
              animate={{ x: 0 }}
              exit={{ x: '105%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              className="fixed inset-y-0 right-0 z-[76] flex w-full max-w-[480px] flex-col border-l-4 border-sindoor bg-paper shadow-2xl"
              role="dialog"
              aria-label="Editor desk"
            >
              <div className="relative overflow-hidden border-b-2 border-ink/10 bg-ink px-5 py-4">
                <div className="pointer-events-none absolute inset-0 opacity-25">
                  <img src="/assets/asset6.png" alt="" className="h-full w-full scale-150 object-cover object-center" />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-amber-50">সম্পাদকের ডেস্ক</h3>
                    <p className="text-xs text-amber-100/70">Sabar Kotha — Editor's Desk (Admin)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      aria-label="Admin logout"
                      title="অ্যাডমিন লগ আউট"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-100/30 text-amber-100 hover:bg-white/10"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                    <button
                      onClick={onClose}
                      aria-label="Close panel"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-100/30 text-amber-100 hover:bg-white/10"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-1.5 overflow-x-auto border-b-2 border-ink/10 bg-paper-deep/70 px-3 py-2.5">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onTabChange(t.id)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                      tab === t.id ? 'bg-sindoor text-paper-soft shadow' : 'text-ink/60 hover:bg-white/70 hover:text-ink'
                    }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                {tab === 'updates' && <UpdatesTab />}
                {tab === 'live' && <LiveTab />}
                {tab === 'paper' && <PaperTab />}
                {tab === 'story' && <StoryTab />}
                {tab === 'links' && <LinksTab />}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
