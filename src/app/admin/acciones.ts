'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServidor } from '@/lib/supabase/servidor';

/**
 * Regenera la home al instante después de un cambio en el panel. Sin esto,
 * la carta pública (cacheada) tardaría hasta `revalidate` segundos en
 * mostrar lo nuevo. Solo un usuario logueado puede dispararlo.
 */
export async function refrescarCarta() {
  const supabase = await supabaseServidor();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  revalidatePath('/');
}
