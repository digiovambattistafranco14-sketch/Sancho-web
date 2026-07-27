export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** El sitio funciona sin Supabase usando la carta de `datos-base.ts`. */
export const HAY_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
