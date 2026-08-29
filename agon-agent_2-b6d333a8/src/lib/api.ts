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

// Helper function to read static JSON file safely
async function fetchStaticJson() {
  try {
    const res = await fetch('/data.json');
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching data.json:', error);
    return null;
  }
}

type VideoPayload = Partial<UpdateVideo>;
type PaperPayload = Partial<PaperLink>;
type EpisodePayload = Partial<StoryEpisode>;
type LinkPayload = Partial<SiteLink>;

export const api = {
  getNews: async (): Promise<NewsItem[]> => {
    const json = await fetchStaticJson();
    if (!json) return [];
    const list = Array.isArray(json) ? json : json.updates || [];
    return list.map((item: any, index: number) => ({
      id: item.id ?? index + 1,
      created_at: item.created_at ?? '',
      news_url: item.news_url ?? item.youtube_url ?? '',
      live_url: item.live_url ?? '',
      story_url: item.story_url ?? '',
      channel_url: item.channel_url ?? '',
      thumbnail_url: item.thumbnail_url ?? '',
      dscription: item.dscription ?? item.description ?? item.title ?? '',
    }));
  },

  updates: {
    list: async (): Promise<UpdateVideo[]> => {
      const json = await fetchStaticJson();
      if (!json) return [];
      const list = Array.isArray(json) ? json : json.updates || [];
      return list.map((item: any, i: number) => ({
        id: item.id || i + 1,
        title: item.dscription || item.title || 'সংবাদ আপডেট',
        youtube_url: item.news_url || item.youtube_url || '',
        category: 'সংবাদ',
        featured: false,
        sort_order: i,
        created_at: item.created_at || new Date().toISOString(),
      }));
    },
    create: async (d: VideoPayload) => ({} as UpdateVideo),
    update: async (id: number, d: VideoPayload) => ({} as UpdateVideo),
    remove: async (id: number) => ({ ok: true }),
  },

  live: {
    get: async (): Promise<LiveBroadcast | null> => {
      const json = await fetchStaticJson();
      if (!json || !json.live) return null;
      return {
        id: 1,
        title: json.live.title || '',
        description: '',
        youtube_url: json.live.youtube_url || '',
        is_live: Boolean(json.live.isLive),
        updated_at: new Date().toISOString(),
      };
    },
    save: async (d: Partial<LiveBroadcast>) => ({} as LiveBroadcast),
  },

  papers: {
    list: async (): Promise<PaperLink[]> => [],
    create: async (d: PaperPayload) => ({} as PaperLink),
    update: async (id: number, d: PaperPayload) => ({} as PaperLink),
    remove: async (id: number) => ({ ok: true }),
  },

  episodes: {
    list: async (): Promise<StoryEpisode[]> => {
      const json = await fetchStaticJson();
      if (!json || !Array.isArray(json.story)) return [];
      return json.story.map((item: any, i: number) => ({
        id: item.id || i + 1,
        title: item.title || '',
        description: item.description || '',
        youtube_url: item.youtube_url || '',
        duration: '',
        sort_order: i,
        created_at: new Date().toISOString(),
      }));
    },
    create: async (d: EpisodePayload) => ({} as StoryEpisode),
    update: async (id: number, d: EpisodePayload) => ({} as StoryEpisode),
    remove: async (id: number) => ({ ok: true }),
  },

  links: {
    list: async (): Promise<SiteLink[]> => [],
    create: async (d: LinkPayload) => ({} as SiteLink),
    update: async (id: number, d: LinkPayload) => ({} as SiteLink),
    remove: async (id: number) => ({ ok: true }),
  },

  members: {
    list: async (): Promise<JourneyMember[]> => [],
    join: async (d: { name: string; email?: string; message?: string }) => ({} as JourneyMember),
  },

  admin: {
    login: async (password: string) => ({ token: 'static_admin_token' }),
    verify: async () => ({ valid: true }),
  },
};
