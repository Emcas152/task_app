import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zjfxthhswxojoivpqidq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqZnh0aGhzd3hvam9pdnBxaWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTM2MzcsImV4cCI6MjA2ODE2OTYzN30.UCsXERDYM0qg6kY9WTxNpF4vF67CVufWOc2Hu65jaB0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);