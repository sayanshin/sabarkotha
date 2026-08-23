import { createClient } from '@supabase/supabase-js';
import { triggerRestore } from './db-wake.js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://yyazmipvvmotbtujbywj.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_v3Cj3W5neKMchbiHx5pTXw_wsv9QS5M';

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
