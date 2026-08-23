import supabase from './db-client.js';
import { cors } from './admin.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('journey_members')
        .select('*')
        .order('id', { ascending: false })
        .limit(60);
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { name, email, message } = req.body || {};
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'আপনার নাম লিখুন (name required)' });
      }
      const { data, error } = await supabase
        .from('journey_members')
        .insert({
          name: name.trim().slice(0, 80),
          email: (email || '').slice(0, 120),
          message: (message || '').slice(0, 300),
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Members API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
