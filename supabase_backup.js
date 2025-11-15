// Backup of Supabase configuration and related setup code
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://oxwgmgngnsjfmeuiaorn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94d2dtZ25nbnNqZm1ldWlhb3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNTU0MTcsImV4cCI6MjA3MjgzMTQxN30.dRJvQq0qLU9e5pN7GeIY63PeNDyuSMWUdwhaKO1s0Rk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
