import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieNueva = { name: string; value: string; options?: CookieOptions };
import { HAY_SUPABASE, SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

export async function supabaseServidor() {
  if (!HAY_SUPABASE) return null;

  const almacen = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return almacen.getAll();
      },
      setAll(cookiesNuevas: CookieNueva[]) {
        try {
          cookiesNuevas.forEach(({ name, value, options }) => {
            almacen.set(name, value, options);
          });
        } catch {
          // Se llamó desde un Server Component: el middleware ya refresca la sesión.
        }
      },
    },
  });
}
