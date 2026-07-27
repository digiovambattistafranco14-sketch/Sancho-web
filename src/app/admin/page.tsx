import { HAY_SUPABASE } from '@/lib/supabase/config';
import { supabaseServidor } from '@/lib/supabase/servidor';
import type { Categoria, Config, Producto, TapaDelDia } from '@/lib/types';
import { Panel } from './Panel';
import { SinConfigurar } from './SinConfigurar';

export const dynamic = 'force-dynamic';

export default async function Admin() {
  if (!HAY_SUPABASE) return <SinConfigurar />;

  const supabase = await supabaseServidor();
  if (!supabase) return <SinConfigurar />;

  const [cats, prods, taps, cfg, sesion] = await Promise.all([
    supabase.from('categorias').select('*').order('orden'),
    supabase.from('productos').select('*').order('orden'),
    supabase.from('tapas_del_dia').select('*').order('orden'),
    supabase.from('config').select('*').eq('id', 1).maybeSingle(),
    supabase.auth.getUser(),
  ]);

  if (cats.error || prods.error) {
    return (
      <SinConfigurar
        mensaje={`No pude leer las tablas: ${cats.error?.message ?? prods.error?.message}. ¿Corriste supabase/esquema.sql?`}
      />
    );
  }

  return (
    <Panel
      email={sesion.data.user?.email ?? ''}
      categorias={(cats.data ?? []) as Categoria[]}
      productos={(prods.data ?? []) as Producto[]}
      tapas={(taps.data ?? []) as TapaDelDia[]}
      config={cfg.data as (Config & { precio_tapa: number }) | null}
    />
  );
}
