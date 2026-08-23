import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  api,
  type JourneyMember,
  type LiveBroadcast,
  type PaperLink,
  type SiteLink,
  type StoryEpisode,
  type UpdateVideo,
} from '../lib/api';

interface DataContextValue {
  videos: UpdateVideo[];
  live: LiveBroadcast | null;
  papers: PaperLink[];
  episodes: StoryEpisode[];
  links: SiteLink[];
  members: JourneyMember[];
  loading: boolean;
  refreshVideos: () => Promise<void>;
  refreshLive: () => Promise<void>;
  refreshPapers: () => Promise<void>;
  refreshEpisodes: () => Promise<void>;
  refreshLinks: () => Promise<void>;
  refreshMembers: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<UpdateVideo[]>([]);
  const [live, setLive] = useState<LiveBroadcast | null>(null);
  const [papers, setPapers] = useState<PaperLink[]>([]);
  const [episodes, setEpisodes] = useState<StoryEpisode[]>([]);
  const [links, setLinks] = useState<SiteLink[]>([]);
  const [members, setMembers] = useState<JourneyMember[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshVideos = useCallback(async () => {
    try {
      setVideos(await api.updates.list());
    } catch (err) {
      console.error('updates fetch failed', err);
    }
  }, []);

  const refreshLive = useCallback(async () => {
    try {
      setLive(await api.live.get());
    } catch (err) {
      console.error('live fetch failed', err);
    }
  }, []);

  const refreshPapers = useCallback(async () => {
    try {
      setPapers(await api.papers.list());
    } catch (err) {
      console.error('papers fetch failed', err);
    }
  }, []);

  const refreshEpisodes = useCallback(async () => {
    try {
      setEpisodes(await api.episodes.list());
    } catch (err) {
      console.error('episodes fetch failed', err);
    }
  }, []);

  const refreshLinks = useCallback(async () => {
    try {
      setLinks(await api.links.list());
    } catch (err) {
      console.error('links fetch failed', err);
    }
  }, []);

  const refreshMembers = useCallback(async () => {
    try {
      setMembers(await api.members.list());
    } catch (err) {
      console.error('members fetch failed', err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      await Promise.all([
        refreshVideos(),
        refreshLive(),
        refreshPapers(),
        refreshEpisodes(),
        refreshLinks(),
        refreshMembers(),
      ]);
      if (!cancelled) setLoading(false);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [refreshVideos, refreshLive, refreshPapers, refreshEpisodes, refreshLinks, refreshMembers]);

  return (
    <DataContext.Provider
      value={{
        videos,
        live,
        papers,
        episodes,
        links,
        members,
        loading,
        refreshVideos,
        refreshLive,
        refreshPapers,
        refreshEpisodes,
        refreshLinks,
        refreshMembers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
