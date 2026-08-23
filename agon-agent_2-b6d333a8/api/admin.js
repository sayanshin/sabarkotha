import crypto from 'crypto';

// Server-side only: the admin password is compared against process.env.ADMIN_PASSWORD
// and NEVER shipped to the frontend. Configure ADMIN_PASSWORD in the Secrets tab.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sabar-editor-golden-24';
const SIGNING_SECRET = (process.env.SUPABASE_SERVICE_ROLE_KEY || 'sk-local-secret') + '|sk-admin';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function sign(payload) {
  return crypto.createHmac('sha256', SIGNING_SECRET).update(payload).digest('hex');
}

export function makeToken() {
  const exp = Date.now() + TOKEN_TTL_MS;
  return `${exp}.${sign('admin:' + exp)}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const exp = Number(parts[0]);
  if (!exp || Number.isNaN(exp) || Date.now() > exp) return false;
  const expected = sign('admin:' + parts[0]);
  const a = Buffer.from(parts[1]);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function requireAdmin(req, res) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!verifyToken(token)) {
    res.status(401).json({ error: 'অননুমোদিত — অ্যাডমিন লগইন প্রয়োজন (Admin authorization required)' });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { password } = req.body || {};
      if (!password || typeof password !== 'string' || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'ভুল পাসওয়ার্ড — Wrong admin password' });
      }
      return res.status(200).json({ token: makeToken(), expiresIn: TOKEN_TTL_MS });
    }

    if (req.method === 'GET') {
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      return res.status(200).json({ valid: verifyToken(token) });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
