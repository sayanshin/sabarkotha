import supabase from './db-client.js';
import { cors, requireAdmin } from './admin.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('paper_links')
        .select('*')
        .order('id', { ascending: false })
        .limit(60);
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (!requireAdmin(req, res)) return;

    if (req.method === 'POST') {
      const { title, summary, url, edition } = req.body || {};
      if (!title || !url) {
        return res.status(400).json({ error: 'শিরোনাম ও লিংক আবশ্যক (title and url required)' });
      }
      const { data, error } = await supabase
        .from('paper_links')
        .insert({ title, summary: summary || '', url, edition: edition || 'আজকের সংস্করণ' })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, title, summary, url, edition } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      const { data, error } = await supabase
        .from('paper_links')
        .update({ title, summary, url, edition })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      const { error } = await supabase.from('paper_links').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Paper API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
