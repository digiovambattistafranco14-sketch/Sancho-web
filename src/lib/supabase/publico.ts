import { createClient } from '@supabase/supabase-js';
import { HAY_SUPABASE, SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

/**
 * Cliente sin cookies para datos públicos (carta, tapas, config). No usar
 * `next/headers` acá: llamarlo saca a la página del modo estático y rompe
 * el ISR (`revalidate`), forzando una consulta a Supabase en cada visita.
 */
export function supabasePublico() {
  if (!HAY_SUPABASE) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
