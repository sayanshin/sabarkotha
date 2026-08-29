import fs from 'fs';
import path from 'path';
import { cors, requireAdmin } from './admin.js';

// Helper function to read static JSON safely
function getStaticData() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data.json');
    if (!fs.existsSync(filePath)) return [];
    const rawData = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(rawData);
    
    // Support both raw array format and object format with updates property
    const list = Array.isArray(json) ? json : (json.updates || []);
    
    return list.map((item, index) => ({
      id: item.id || index + 1,
      title: item.dscription || item.title || 'সংবাদ আপডেট',
      youtube_url: item.news_url || item.youtube_url || '',
      category: 'সংবাদ',
      featured: false,
      sort_order: index,
      created_at: item.created_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.error('Error reading static data.json:', err);
    return [];
  }
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const data = getStaticData();
      return res.status(200).json(data);
    }

    if (!requireAdmin(req, res)) return;

    // Static mode mock responses for write operations
    if (req.method === 'POST') {
      const { title, youtube_url, category, featured, sort_order } = req.body || {};
      if (!title || !youtube_url) {
        return res.status(400).json({ error: 'শিরোনাম ও ইউটিউব লিংক আবশ্যক (title and youtube_url required)' });
      }
      return res.status(201).json({
        id: Date.now(),
        title,
        youtube_url,
        category: category || 'সংবাদ',
        featured: !!featured,
        sort_order: Number.isFinite(sort_order) ? sort_order : 0,
        created_at: new Date().toISOString()
      });
    }

    if (req.method === 'PUT') {
      const { id, title, youtube_url } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      return res.status(200).json({ id, title, youtube_url });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Updates API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
