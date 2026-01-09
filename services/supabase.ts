
import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables
const getEnv = (key: string): string => {
  // Check multiple possible key variations (e.g., VITE_SUPABASE_URL and SUPABASE_URL)
  const keys = [key, key.replace('VITE_', '')];
  
  for (const k of keys) {
    try {
      // 1. Try import.meta.env (Vite standard)
      if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[k]) {
        return (import.meta as any).env[k];
      }
      // 2. Try process.env (Node/Vercel standard)
      if (typeof process !== 'undefined' && process.env && process.env[k]) {
        return process.env[k] || '';
      }
      // 3. Try window environment (Some sandboxes)
      if (typeof window !== 'undefined' && (window as any)._env_ && (window as any)._env_[k]) {
        return (window as any)._env_[k];
      }
    } catch (e) {}
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Initialize Supabase client
// If keys are missing, we provide placeholders to prevent immediate crash.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

// A configuration is valid only if we have real values
export const isSupabaseConfigured = 
  !!supabaseUrl && 
  !!supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  !supabaseUrl.includes('xxxxxxxxxxxx');
