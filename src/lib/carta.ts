import { supabasePublico } from './supabase/publico';
import {
  CATEGORIAS_BASE,
  CONFIG_BASE,
  PRECIO_TAPA,
  PRODUCTOS_BASE,
  TAPAS_BASE,
} from './datos-base';
import type { Categoria, Config, Producto, TapaDelDia } from './types';

export type CartaCompleta = {
  categorias: Categoria[];
  productos: Producto[];
  tapas: TapaDelDia[];
  config: Config;
  precioTapa: number;
  /** true cuando los datos vienen de Supabase y no del fallback. */
  enVivo: boolean;
};

const BASE: Omit<CartaCompleta, 'enVivo'> = {
  categorias: CATEGORIAS_BASE,
  productos: PRODUCTOS_BASE,
  tapas: TAPAS_BASE,
  config: CONFIG_BASE,
  precioTapa: PRECIO_TAPA,
};

/**
 * Carga la carta desde Supabase. Si no está configurado, si falla la consulta
 * o si las tablas todavía están vacías, devuelve la carta real hardcodeada
 * para que el sitio nunca se muestre roto.
 */
export async function cargarCarta(): Promise<CartaCompleta> {
  const supabase = supabasePublico();
  if (!supabase) return { ...BASE, enVivo: false };

  try {
    const [cats, prods, taps, cfg] = await Promise.all([
      supabase.from('categorias').select('*').eq('activa', true).order('orden'),
      supabase.from('productos').select('*').order('orden'),
      supabase.from('tapas_del_dia').select('*').order('orden'),
      supabase.from('config').select('*').eq('id', 1).maybeSingle(),
    ]);

    if (cats.error || prods.error) return { ...BASE, enVivo: false };

    const categorias = (cats.data ?? []) as Categoria[];
    const productos = (prods.data ?? []) as Producto[];
    if (categorias.length === 0 || productos.length === 0) return { ...BASE, enVivo: false };

    const filaCfg = (cfg.data ?? null) as (Partial<Config> & { precio_tapa?: number }) | null;

    return {
      categorias,
      productos,
      tapas: ((taps.data ?? []) as TapaDelDia[]).length
        ? (taps.data as TapaDelDia[])
        : TAPAS_BASE,
      config: { ...CONFIG_BASE, ...(filaCfg ?? {}) },
      precioTapa: filaCfg?.precio_tapa ?? PRECIO_TAPA,
      enVivo: true,
    };
  } catch {
    return { ...BASE, enVivo: false };
  }
}
