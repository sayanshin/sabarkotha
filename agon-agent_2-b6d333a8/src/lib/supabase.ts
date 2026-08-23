import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yyazmipvvmotbtujbywj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5YXptaXB2dm1vdGJ0dWpieXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NjY2MjIsImV4cCI6MjEwMzA0MjYyMn0.8S5Y2wI8E7xY0X3Q9L8p_9Z0K_X_X0K8X0K8X0K8X0K';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
