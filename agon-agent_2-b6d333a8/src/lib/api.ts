import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface NewsItem {
  id: number;
  created_at?: string;
  news_url?: string;
  live_url?: string;
  story_url?: string;
  channel_url?: string;
  thumbnail_url?: string;
  dscription?: string;
}

export interface UpdateVideo {
  id: number;
  title: string;
  youtube_url: string;
  category: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface LiveBroadcast {
  id: number;
  title: string;
  description: string;
  youtube_url: string;
  is_live: boolean;
  updated_at: string;
}

export interface PaperLink {
  id: number;
  title: string;
  summary: string;
  url: string;
  edition: string;
  created_at: string;
}

export interface StoryEpisode {
  id: number;
  title: string;
  description: string;
  youtube_url: string;
  duration: string;
  sort_order: number;
  created_at: string;
}

export interface SiteLink {
  id: number;
  label: string;
  url: string;
  kind: string;
  sort_order: number;
}

export interface JourneyMember {
  id: string | number;
  name: string;
  email?: string;
  message?: string;
  created_at?: string;
}

export interface Playable {
  title: string;
  youtube_url: string;
}

export const tokenStore = {
  get: (): string => {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem('sk_admin_token') || localStorage.getItem('admin_token') || '';
  },
  set: (t: string) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('sk_admin_token', t);
      localStorage.setItem('admin_token', t);
    }
  },
  clear: () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('sk_admin_token');
      localStorage.removeItem('admin_token');
    }
  },
};

async function req<T>(path: string, options: RequestInit = {}, admin = false): Promise<T> {
  const headers: Record<string, string> = { 
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };
  
  if (admin) {
    const token = tokenStore.get();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(path, { ...options, headers });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  
  if (!res.ok) {
    const errorMessage = (data.error as string) || (data.message as string) || `Request failed with status ${res.status}`;
    throw new Error(errorMessage);
  }
  
  return data as T;
}

type VideoPayload = Partial<UpdateVideo>;
type PaperPayload = Partial<PaperLink>;
type EpisodePayload = Partial<StoryEpisode>;
type LinkPayload = Partial<SiteLink>;

export const api = {
  // Direct Firebase news fetcher (Using Firestore to match application db instance)
 getNews: async (): Promise<NewsItem[]> => {
  try {
    const newsRef = collection(db, 'news');
    const snapshot = await getDocs(newsRef);

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        id: data.id ?? index + 1, // Fallback to index if no numeric id exists
        created_at: data.created_at ?? '',
        news_url: data.news_url ?? '',
        live_url: data.live_url ?? '',
        story_url: data.story_url ?? '',
        channel_url: data.channel_url ?? '',
        thumbnail_url: data.thumbnail_url ?? '',
        dscription: data.dscription ?? data.description ?? '',
      };
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
},
  updates: {
    list: () => req<UpdateVideo[]>('/api/updates'),
    create: (d: VideoPayload) => req<UpdateVideo>('/api/updates', { method: 'POST', body: JSON.stringify(d) }, true),
    update: (id: number, d: VideoPayload) => req<UpdateVideo>('/api/updates', { method: 'PUT', body: JSON.stringify({ id, ...d }) }, true),
    remove: (id: number) => req<{ ok: boolean }>('/api/updates', { method: 'DELETE', body: JSON.stringify({ id }) }, true),
  },
  live: {
    get: () => req<LiveBroadcast | null>('/api/live'),
    save: (d: Partial<LiveBroadcast>) => req<LiveBroadcast>('/api/live', { method: 'PUT', body: JSON.stringify(d) }, true),
  },
  papers: {
    list: () => req<PaperLink[]>('/api/paper'),
    create: (d: PaperPayload) => req<PaperLink>('/api/paper', { method: 'POST', body: JSON.stringify(d) }, true),
    update: (id: number, d: PaperPayload) => req<PaperLink>('/api/paper', { method: 'PUT', body: JSON.stringify({ id, ...d }) }, true),
    remove: (id: number) => req<{ ok: boolean }>('/api/paper', { method: 'DELETE', body: JSON.stringify({ id }) }, true),
  },
  episodes: {
    list: () => req<StoryEpisode[]>('/api/story'),
    create: (d: EpisodePayload) => req<StoryEpisode>('/api/story', { method: 'POST', body: JSON.stringify(d) }, true),
    update: (id: number, d: EpisodePayload) => req<StoryEpisode>('/api/story', { method: 'PUT', body: JSON.stringify({ id, ...d }) }, true),
    remove: (id: number) => req<{ ok: boolean }>('/api/story', { method: 'DELETE', body: JSON.stringify({ id }) }, true),
  },
  links: {
    list: () => req<SiteLink[]>('/api/links'),
    create: (d: LinkPayload) => req<SiteLink>('/api/links', { method: 'POST', body: JSON.stringify(d) }, true),
    update: (id: number, d: LinkPayload) => req<SiteLink>('/api/links', { method: 'PUT', body: JSON.stringify({ id, ...d }) }, true),
    remove: (id: number) => req<{ ok: boolean }>('/api/links', { method: 'DELETE', body: JSON.stringify({ id }) }, true),
  },
  members: {
    list: () => req<JourneyMember[]>('/api/members'),
    join: (d: { name: string; email?: string; message?: string }) =>
      req<JourneyMember>('/api/members', { method: 'POST', body: JSON.stringify(d) }),
  },
  admin: {
    login: async (password: string) => {
      const res = await req<{ token: string }>('/api/admin', { method: 'POST', body: JSON.stringify({ password }) });
      if (res.token) {
        tokenStore.set(res.token);
      }
      return res;
    },
    verify: () => req<{ valid: boolean }>('/api/admin', {}, true),
  },
};
