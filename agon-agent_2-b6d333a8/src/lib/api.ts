import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
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
      try {
        const querySnapshot = await getDocs(collection(db, 'updates'));
        return querySnapshot.docs.map((docSnap, i) => {
          const data = docSnap.data();
          return {
            id: docSnap.id as any,
            title: data.title || data.dscription || 'সংবাদ আপডেট',
            youtube_url: data.youtube_url || data.news_url || '',
            category: data.category || 'সংবাদ',
            featured: Boolean(data.featured),
            sort_order: data.sort_order ?? i,
            created_at: data.created_at || new Date().toISOString(),
          };
        });
      } catch (error) {
        console.error('Error fetching updates from Firestore:', error);
        return [];
      }
    },
    create: async (d: VideoPayload) => {
      const docRef = await addDoc(collection(db, 'updates'), {
        ...d,
        created_at: new Date().toISOString(),
      });
      return { id: docRef.id, ...d } as unknown as UpdateVideo;
    },
    update: async (id: number | string, d: VideoPayload) => {
      const docRef = doc(db, 'updates', String(id));
      await updateDoc(docRef, d);
      return { id, ...d } as unknown as UpdateVideo;
    },
    remove: async (id: number | string) => {
      await deleteDoc(doc(db, 'updates', String(id)));
      return { ok: true };
    },
  },

 live: {
    get: async (): Promise<LiveBroadcast | null> => {
      try {
        const querySnapshot = await getDocs(collection(db, 'live'));
        if (querySnapshot.empty) return null;
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        return {
          id: docSnap.id as any,
          title: data.title || '',
          description: data.description || '',
          youtube_url: data.youtube_url || '',
          is_live: Boolean(data.is_live),
          updated_at: data.updated_at || new Date().toISOString(),
        };
      } catch (error) {
        console.error('Error fetching live settings:', error);
        return null;
      }
    },
    save: async (d: Partial<LiveBroadcast>) => {
      const querySnapshot = await getDocs(collection(db, 'live'));
      if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'live', firstDoc.id), {
          ...d,
          updated_at: new Date().toISOString(),
        });
        return { id: firstDoc.id, ...d } as unknown as LiveBroadcast;
      } else {
        const docRef = await addDoc(collection(db, 'live'), {
          ...d,
          updated_at: new Date().toISOString(),
        });
        return { id: docRef.id, ...d } as unknown as LiveBroadcast;
      }
    },
  },

  papers: {
    list: async (): Promise<PaperLink[]> => {
      try {
        const querySnapshot = await getDocs(collection(db, 'papers'));
        return querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id as any,
          ...(docSnap.data() as Omit<PaperLink, 'id'>),
        }));
      } catch (error) {
        console.error('Error fetching papers:', error);
        return [];
      }
    },
    create: async (d: PaperPayload) => {
      const docRef = await addDoc(collection(db, 'papers'), {
        ...d,
        created_at: new Date().toISOString(),
      });
      return { id: docRef.id, ...d } as unknown as PaperLink;
    },
    update: async (id: number | string, d: PaperPayload) => {
      await updateDoc(doc(db, 'papers', String(id)), d);
      return { id, ...d } as unknown as PaperLink;
    },
    remove: async (id: number | string) => {
      await deleteDoc(doc(db, 'papers', String(id)));
      return { ok: true };
    },
  },

  episodes: {
    list: async (): Promise<StoryEpisode[]> => {
      try {
        const querySnapshot = await getDocs(collection(db, 'episodes'));
        return querySnapshot.docs.map((docSnap, i) => {
          const data = docSnap.data();
          return {
            id: docSnap.id as any,
            title: data.title || '',
            description: data.description || '',
            youtube_url: data.youtube_url || '',
            duration: data.duration || '',
            sort_order: data.sort_order ?? i,
            created_at: data.created_at || new Date().toISOString(),
          };
        });
      } catch (error) {
        console.error('Error fetching story episodes:', error);
        return [];
      }
    },
    create: async (d: EpisodePayload) => {
      const docRef = await addDoc(collection(db, 'episodes'), {
        ...d,
        created_at: new Date().toISOString(),
      });
      return { id: docRef.id, ...d } as unknown as StoryEpisode;
    },
    update: async (id: number | string, d: EpisodePayload) => {
      await updateDoc(doc(db, 'episodes', String(id)), d);
      return { id, ...d } as unknown as StoryEpisode;
    },
    remove: async (id: number | string) => {
      await deleteDoc(doc(db, 'episodes', String(id)));
      return { ok: true };
    },
  },

  links: {
    list: async (): Promise<SiteLink[]> => {
      try {
        const querySnapshot = await getDocs(collection(db, 'links'));
        return querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id as any,
          ...(docSnap.data() as Omit<SiteLink, 'id'>),
        }));
      } catch (error) {
        console.error('Error fetching links:', error);
        return [];
      }
    },
    create: async (d: LinkPayload) => {
      const docRef = await addDoc(collection(db, 'links'), d);
      return { id: docRef.id, ...d } as unknown as SiteLink;
    },
    update: async (id: number | string, d: LinkPayload) => {
      await updateDoc(doc(db, 'links', String(id)), d);
      return { id, ...d } as unknown as SiteLink;
    },
    remove: async (id: number | string) => {
      await deleteDoc(doc(db, 'links', String(id)));
      return { ok: true };
    },
  },

  members: {
    list: async (): Promise<JourneyMember[]> => {
      try {
        const querySnapshot = await getDocs(collection(db, 'members'));
        return querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<JourneyMember, 'id'>),
        }));
      } catch (error) {
        console.error('Error fetching members:', error);
        return [];
      }
    },
    join: async (d: { name: string; email?: string; message?: string }) => {
      const docRef = await addDoc(collection(db, 'members'), {
        ...d,
        created_at: new Date().toISOString(),
      });
      return { id: docRef.id, ...d } as JourneyMember;
    },
  },

  admin: {
    login: async (password: string) => ({ token: 'static_admin_token' }),
    verify: async () => ({ valid: true }),
  },
