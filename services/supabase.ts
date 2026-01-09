
import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables in Vite/Vercel
const getEnv = (key: string): string => {
  try {
    // Check import.meta.env (Vite standard)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env[key] || '';
    }
    // Fallback to process.env (Vercel/Node fallback)
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || '';
    }
  } catch (e) {
    console.warn(`Environment variable ${key} could not be accessed safely.`);
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Initialize with empty strings if missing to avoid immediate crash, 
// though API calls will later fail gracefully.
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;
