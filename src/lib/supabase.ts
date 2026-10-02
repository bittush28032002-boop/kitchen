import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration keys
export const SUPABASE_STORAGE_KEYS = {
  URL: 'kitchencraft_supabase_url',
  ANON_KEY: 'kitchencraft_supabase_anon_key',
  LAST_SYNC: 'kitchencraft_supabase_last_sync'
};

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isCustom: boolean;
  isConnected: boolean;
}

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  // 1. Check localStorage first (in case user provided credentials in the UI)
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(SUPABASE_STORAGE_KEYS.URL) : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(SUPABASE_STORAGE_KEYS.ANON_KEY) : null;

  if (localUrl && localKey) {
    return { url: localUrl.trim(), anonKey: localKey.trim() };
  }

  // 2. Check environment variables
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: envUrl.trim(),
    anonKey: envKey.trim()
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(
    url && 
    anonKey && 
    url.startsWith('https://') && 
    !url.includes('your-project-id') &&
    anonKey.length > 20
  );
}

let activeClient: SupabaseClient | null = null;
let currentUrl = '';
let currentKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey || !isSupabaseConfigured()) {
    return null;
  }

  if (activeClient && currentUrl === url && currentKey === anonKey) {
    return activeClient;
  }

  try {
    activeClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'kitchencraft_sb_auth'
      }
    });
    currentUrl = url;
    currentKey = anonKey;
    return activeClient;
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    if (url && anonKey) {
      localStorage.setItem(SUPABASE_STORAGE_KEYS.URL, url.trim());
      localStorage.setItem(SUPABASE_STORAGE_KEYS.ANON_KEY, anonKey.trim());
    } else {
      localStorage.removeItem(SUPABASE_STORAGE_KEYS.URL);
      localStorage.removeItem(SUPABASE_STORAGE_KEYS.ANON_KEY);
    }
  }
  activeClient = null;
  currentUrl = '';
  currentKey = '';
}

export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string }> {
  try {
    const creds = url && anonKey ? { url: url.trim(), anonKey: anonKey.trim() } : getSupabaseCredentials();
    if (!creds.url || !creds.anonKey) {
      return { success: false, message: 'URL and Anon Key are required.' };
    }
    const testClient = createClient(creds.url, creds.anonKey);
    // Simple ping to categories or public table
    const { error } = await testClient.from('categories').select('count', { count: 'exact', head: true });
    
    if (error && error.code !== 'PGRST116') {
      // If table does not exist yet, connection is still valid if it reached PostgreSQL
      if (error.message && (error.message.includes('relation') || error.message.includes('table'))) {
        return { 
          success: true, 
          message: 'Connected to Supabase project! Schema tables need to be created using schema.sql.' 
        };
      }
      return { success: false, message: error.message || 'Failed to authenticate with Supabase.' };
    }
    
    return { success: true, message: 'Successfully connected to Supabase database!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error connecting to Supabase.' };
  }
}
