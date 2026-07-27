'use client';

import { createBrowserClient } from '@supabase/ssr';
import { HAY_SUPABASE, SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

export function supabaseNavegador() {
  if (!HAY_SUPABASE) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
