import supabase from './db-client.js';
import { cors, requireAdmin } from './admin.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('live_broadcast')
        .select('*')
        .order('id', { ascending: false })
        .limit(1);
      if (error) throw error;
      return res.status(200).json(data && data.length ? data[0] : null);
    }

    if (!requireAdmin(req, res)) return;

    if (req.method === 'PUT' || req.method === 'POST') {
      const { id, title, description, youtube_url, is_live } = req.body || {};
      const payload = {
        title: title || 'সরাসরি সম্প্রচার',
        description: description || '',
        youtube_url: youtube_url || '',
        is_live: !!is_live,
        updated_at: new Date().toISOString(),
      };
      let query;
      if (id) {
        query = supabase.from('live_broadcast').update(payload).eq('id', id).select().single();
      } else {
        query = supabase.from('live_broadcast').insert(payload).select().single();
      }
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Live API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
