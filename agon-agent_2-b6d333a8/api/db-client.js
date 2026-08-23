import { createClient } from '@supabase/supabase-js';
import { triggerRestore } from './db-wake.js';
 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
 
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
    'Set both in Vercel → Settings → Environment Variables, then redeploy.'
  );
}
 
const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    global: {
      fetch: async (url, options) => {
        const res = await fetch(url, options);
        if (!res.ok && res.status >= 500) triggerRestore();
        return res;
      },
    },
  }
);
 
export default supabase;
