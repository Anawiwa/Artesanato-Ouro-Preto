import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;
let currentClientKey = '';

export const DEFAULT_SUPABASE_URL = 'https://hfiknqgszdrpokuhaeca.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmaWtucWdzemRycG9rdWhhZWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2NjI1MzEsImV4cCI6MjEwMjIzODUzMX0.PP4gnidiFH5KkMnwPdF1ivADkZA1I1O3p6N6MUYUcqQ';

export const getSupabaseConfig = () => {
  // Check localStorage overrides first
  const customUrl = typeof window !== 'undefined' ? localStorage.getItem('ouro_supabase_custom_url') : null;
  const customKey = typeof window !== 'undefined' ? localStorage.getItem('ouro_supabase_custom_key') : null;

  let url = customUrl || import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  let anonKey = customKey || import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  // Clean and sanitize URL
  if (url) {
    url = url.trim();
    if (url.startsWith('https:/') && !url.startsWith('https://')) {
      url = url.replace('https:/', 'https://');
    }
  }

  // If anonKey is malformed, not a valid JWT (doesn't start with eyJ), or starts with sb_publishable_, fallback to the working JWT
  if (!anonKey || !anonKey.trim().startsWith('eyJ')) {
    anonKey = DEFAULT_SUPABASE_ANON_KEY;
  } else {
    anonKey = anonKey.trim();
  }

  const isConfigured = Boolean(url && anonKey && !url.includes('placeholder'));
  return { url, anonKey, isConfigured };
};

export const setCustomSupabaseConfig = (url: string, anonKey: string) => {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem('ouro_supabase_custom_url', url.trim());
    if (anonKey) localStorage.setItem('ouro_supabase_custom_key', anonKey.trim());
    supabaseClient = null; // force recreation
    currentClientKey = '';
  }
};

export const resetSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ouro_supabase_custom_url');
    localStorage.removeItem('ouro_supabase_custom_key');
    supabaseClient = null;
    currentClientKey = '';
  }
};

export const getSupabase = (): SupabaseClient | null => {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  
  if (!isConfigured) {
    return null;
  }

  const clientKey = `${url}_${anonKey}`;
  if (!supabaseClient || currentClientKey !== clientKey) {
    supabaseClient = createClient(url, anonKey);
    currentClientKey = clientKey;
  }

  return supabaseClient;
};

