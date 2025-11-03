// Supabase client using environment variables (Lovable Cloud)
// This file overrides the default client via Vite alias to ensure the app
// talks to the correct backend in all environments.
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const FALLBACK_URL = 'https://eewotqwrtxcndvoehkrr.supabase.co'
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVld290cXdydHhjbmR2b2Voa3JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTExOTgsImV4cCI6MjA3NTE2NzE5OH0.yN_CnUft3YlGheXsvYsNRnl1F6FzJCv7CYIjjW9p_Hs'

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || FALLBACK_URL
const SUPABASE_PUBLISHABLE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) || FALLBACK_KEY

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  // Soft guard to help diagnose env misconfigurations during build/runtime
  console.warn('[Auth] Using fallback Lovable Cloud backend URL for Supabase client:', SUPABASE_URL)
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
})
