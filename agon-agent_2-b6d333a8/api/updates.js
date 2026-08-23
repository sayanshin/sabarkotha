import supabase from './db-client.js';
import { cors, requireAdmin } from './admin.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('updates_videos')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('id', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (!requireAdmin(req, res)) return;

    if (req.method === 'POST') {
      const { title, youtube_url, category, featured, sort_order } = req.body || {};
      if (!title || !youtube_url) {
        return res.status(400).json({ error: 'শিরোনাম ও ইউটিউব লিংক আবশ্যক (title and youtube_url required)' });
      }
      const { data, error } = await supabase
        .from('updates_videos')
        .insert({
          title,
          youtube_url,
          category: category || 'সংবাদ',
          featured: !!featured,
          sort_order: Number.isFinite(sort_order) ? sort_order : 0,
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, title, youtube_url, category, featured, sort_order } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      const { data, error } = await supabase
        .from('updates_videos')
        .update({ title, youtube_url, category, featured: !!featured, sort_order: sort_order ?? 0 })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      const { error } = await supabase.from('updates_videos').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Updates API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
