import { createClient } from '@supabase/supabase-js';
 
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yyazmipvvmotbtujbywj.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5YXptaXB2dm1vdGJ0dWpieXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NjY2MjIsImV4cCI6MjEwMzA0MjYyMn0.naxpYSY2M2knVPCGAQaPAb4BR7rzWjJbrLxCyvPj9sU';
 
// If this warning ever shows up in the browser console, it means Vercel's
// VITE_SUPABASE_ANON_KEY env var was not baked into the build.
// Fix: check Vercel → Settings → Environment Variables, then redeploy
// with "Use existing Build Cache" turned OFF.
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    '[supabase.ts] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY was not found in the build. ' +
    'Using the hardcoded fallback key instead. Check your Vercel environment variables.'
  );
}
 
const supabase = createClient(supabaseUrl, supabaseAnonKey);
 
export default supabase;
