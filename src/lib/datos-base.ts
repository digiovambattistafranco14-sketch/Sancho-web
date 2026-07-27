import type { Categoria, Config, Producto, TapaDelDia } from './types';

/**
 * Carta real de Sancho. Estos datos son el fallback: si Supabase todavía no está
 * configurado (o falla), el sitio se sirve igual con esta carta.
 * Una vez conectado el panel, Supabase manda y esto queda como red de seguridad.
 */

export const CONFIG_BASE: Config = {
  // Teléfono del listado público de Google. Confirmar que sea el WhatsApp del local.
  whatsapp: '5492216600777',
  direccion: 'Diag. 3 (Jorge Bell) 375, e/ 473 y 473 bis · City Bell',
  como_llegar: 'A media cuadra de Cantilo, en el local donde nació el primer Don Quijote.',
  horarios: 'Miércoles a domingo, de 18 a 00',
  dias_abiertos: [3, 4, 5, 6, 0],
  happy_hour: '2x1 en tragos y cañas, de 18 a 20',
  descuento_efectivo: 10,
  alias: null,
  titular: null,
  aviso: null,
  take_away_activo: true,
  instagram: 'https://www.instagram.com/sancho_cb',
  maps_url: 'https://www.google.com/maps/search/?api=1&query=Sancho+Tapas+y+Barra+City+Bell',
};

export const CATEGORIAS_BASE: Categoria[] = [
  {
    id: 'c1',
    slug: 'para-picar',
    nombre: 'Para picar',
    bajada: 'Lo que se pide primero y siempre se pide de nuevo.',
    precio_fijo: null,
    grupo: 'cocina',
    orden: 1,
    activa: true,
  },
  {
    id: 'c2',
    slug: 'raciones',
    nombre: 'Raciones',
    bajada: 'Plato al centro. Nadie mira su propio plato.',
    precio_fijo: null,
    grupo: 'cocina',
    orden: 2,
    activa: true,
  },
  {
    id: 'c3',
    slug: 'bocattas',
    nombre: 'Bocattas',
    bajada: 'Pan propio. Cinco provincias, cinco rellenos.',
    precio_fijo: 12000,
    grupo: 'cocina',
    orden: 3,
    activa: true,
  },
  {
    id: 'c4',
    slug: 'especial',
    nombre: 'Especial',
    bajada: 'Todos los jueves.',
    precio_fijo: null,
    grupo: 'cocina',
    orden: 4,
    activa: true,
  },
  {
    id: 'c5',
    slug: 'postres',
    nombre: 'Postres',
    bajada: 'Dos. Los de siempre. No hacen falta más.',
    precio_fijo: null,
    grupo: 'cocina',
    orden: 5,
    activa: true,
  },
  {
    id: 'c6',
    slug: 'tragos',
    nombre: 'Tragos',
    bajada: null,
    precio_fijo: null,
    grupo: 'barra',
    orden: 6,
    activa: true,
  },
  {
    id: 'c7',
    slug: 'vinos-copa',
    nombre: 'Vinos por copa',
    bajada: null,
    precio_fijo: null,
    grupo: 'barra',
    orden: 7,
    activa: true,
  },
  {
    id: 'c8',
    slug: 'vinos-botella',
    nombre: 'Vinos por botella',
    bajada: null,
    precio_fijo: null,
    grupo: 'barra',
    orden: 8,
    activa: true,
  },
  {
    id: 'c9',
    slug: 'espumantes',
    nombre: 'Espumantes y sidra',
    bajada: null,
    precio_fijo: null,
    grupo: 'barra',
    orden: 9,
    activa: true,
  },
  {
    id: 'c10',
    slug: 'cervezas',
    nombre: 'Cervezas',
    bajada: null,
    precio_fijo: null,
    grupo: 'barra',
    orden: 10,
    activa: true,
  },
  {
    id: 'c11',
    slug: 'sin-alcohol',
    nombre: 'Gaseosas y aguas',
    bajada: null,
    precio_fijo: null,
    grupo: 'barra',
    orden: 11,
    activa: true,
  },
];

const p = (
  id: string,
  categoria_slug: string,
  nombre: string,
  precio: number,
  orden: number,
  extra: Partial<Producto> = {},
): Producto => ({
  id,
  categoria_slug,
  nombre,
  detalle: null,
  precio,
  orden,
  disponible: true,
  take_away: true,
  vegetariano: false,
  sin_gluten: false,
  ...extra,
});

export const PRODUCTOS_BASE: Producto[] = [
  // ── Para picar ────────────────────────────────────────────────────────────
  p('p1', 'para-picar', 'Croquetas de jamón serrano', 13000, 1, { detalle: '4 unidades' }),
  p('p2', 'para-picar', 'Croquetas de setas', 13000, 2, { detalle: '4 unidades', vegetariano: true }),
  p('p3', 'para-picar', 'Tortilla de patatas confitadas', 9500, 3, {
    vegetariano: true,
    sin_gluten: true,
  }),
  // Los huevos rotos se arruinan en el viaje: quedan fuera del armador.
  p('p4', 'para-picar', 'Huevos rotos con jamón', 12000, 4, { take_away: false }),
  p('p5', 'para-picar', 'Huevos rotos con txistorra', 14500, 5, { take_away: false }),
  p('p6', 'para-picar', 'Huevos rotos veggie', 12000, 6, { take_away: false, vegetariano: true }),
  p('p7', 'para-picar', 'Empanadillas de camarones', 14000, 7, { detalle: '3 unidades' }),
  p('p8', 'para-picar', 'Papas bravas', 9000, 8, { vegetariano: true, sin_gluten: true }),

  // ── Raciones ──────────────────────────────────────────────────────────────
  p('r1', 'raciones', 'Txipirones al ajillo', 21000, 1, { sin_gluten: true }),
  p('r2', 'raciones', 'Gambas al ajillo', 19000, 2, { sin_gluten: true }),
  p('r3', 'raciones', 'Rabas', 19000, 3),
  p('r4', 'raciones', 'Pulpo a la gallega', 29000, 4, { sin_gluten: true }),
  p('r5', 'raciones', 'Brocheta de solomillo', 16000, 5, { sin_gluten: true }),
  p('r6', 'raciones', 'Albondiguitas con salsa de tomate', 12500, 6),
  p('r7', 'raciones', 'Brochetta de verduras a la parrilla', 11000, 7, {
    detalle: '2 unidades',
    vegetariano: true,
    sin_gluten: true,
  }),

  // ── Bocattas ($12.000 c/u) ────────────────────────────────────────────────
  p('b1', 'bocattas', 'Catalunya', 12000, 1, {
    detalle: 'Jamón crudo, rúcula, parmesano, tomates cherry confitados',
  }),
  p('b2', 'bocattas', 'Andalucía', 12000, 2, {
    detalle: 'Solomillo, panceta ahumada, pimientos adobados, tortilla',
  }),
  p('b3', 'bocattas', 'Murcia', 12000, 3, {
    detalle: 'Rosca de pan, ensaladilla rusa, olivas marinadas y anchoas',
  }),
  p('b4', 'bocattas', 'Asturias', 12000, 4, {
    detalle: 'Pan relleno de jamón, cebolla, morrón, tomate, olivas negras',
  }),
  p('b5', 'bocattas', 'Madrid', 12000, 5, { detalle: 'Calamares fritos y salsa tártara' }),

  // ── Especial ──────────────────────────────────────────────────────────────
  p('e1', 'especial', 'Paella valenciana', 22000, 1, { detalle: 'Solo los jueves' }),

  // ── Postres ───────────────────────────────────────────────────────────────
  p('d1', 'postres', 'Arroz con leche y canela', 9000, 1, { vegetariano: true, sin_gluten: true }),
  p('d2', 'postres', 'Natilla quemada', 11000, 2, { vegetariano: true, sin_gluten: true }),

  // ── Tragos (no viajan) ────────────────────────────────────────────────────
  p('t1', 'tragos', 'Tinto de verano', 5000, 1, { take_away: false }),
  p('t2', 'tragos', 'Vermouth con soda y naranja', 5000, 2, { take_away: false }),
  p('t3', 'tragos', 'Fernet Branca con Coca-Cola', 7000, 3, { take_away: false }),
  p('t4', 'tragos', 'Gancia c/ Sprite', 7000, 4, { take_away: false }),
  p('t5', 'tragos', 'Gancia batido', 8000, 5, { take_away: false }),
  p('t6', 'tragos', 'Americano', 8000, 6, { take_away: false }),
  p('t7', 'tragos', 'Cynar Julepp', 7000, 7, { take_away: false }),
  p('t8', 'tragos', 'Negroni', 8000, 8, { take_away: false }),
  p('t9', 'tragos', 'Aperol Spritz', 8000, 9, { take_away: false }),
  p('t10', 'tragos', 'Caipirinha', 8000, 10, { take_away: false }),
  p('t11', 'tragos', "Berrie's Caipi", 9000, 11, { take_away: false }),
  p('t12', 'tragos', 'Tanqueray Gin Tonic', 9500, 12, { take_away: false }),
  p('t13', 'tragos', "Gordon's Gin Tonic", 7500, 13, { take_away: false }),
  p('t14', 'tragos', 'Smirnoff Capiroska', 8000, 14, { take_away: false }),
  p('t15', 'tragos', 'Campari c/ naranja', 7500, 15, { take_away: false }),

  // ── Vinos por copa (no viajan) ────────────────────────────────────────────
  p('vc1', 'vinos-copa', 'Trapiche Reserva Malbec', 5000, 1, { take_away: false }),
  p('vc2', 'vinos-copa', 'El Cazador Malbec', 3500, 2, { take_away: false }),
  p('vc3', 'vinos-copa', 'Marantiqua Pinot Noir', 9500, 3, { take_away: false }),
  p('vc4', 'vinos-copa', 'Trapiche Reserva Chardonnay', 5000, 4, { take_away: false }),
  p('vc5', 'vinos-copa', 'El Cazador Blanco Dulce', 3500, 5, { take_away: false }),
  p('vc6', 'vinos-copa', 'La Mascota Rosé', 7000, 6, { take_away: false }),

  // ── Vinos por botella (sí viajan) ─────────────────────────────────────────
  p('vb1', 'vinos-botella', 'El Cazador Malbec', 9500, 1),
  p('vb2', 'vinos-botella', 'La Mascota Cabernet Sauvignon', 18000, 2),
  p('vb3', 'vinos-botella', 'Marantiqua Pinot Noir', 28000, 3),
  p('vb4', 'vinos-botella', 'Costa y Pampa Albariño', 27000, 4),
  p('vb5', 'vinos-botella', 'La Mascota Rosado', 18000, 5),
  p('vb6', 'vinos-botella', 'Trapiche Rva. Chardonnay', 13000, 6),
  p('vb7', 'vinos-botella', 'Trapiche Rva. Malbec', 13000, 7),
  p('vb8', 'vinos-botella', 'El Cazador Blanco Dulce', 9500, 8),

  // ── Espumantes y sidra ────────────────────────────────────────────────────
  p('es1', 'espumantes', 'Dadá Extra Brut', 11500, 1),
  p('es2', 'espumantes', 'Navarro Correas Extra Brut', 7000, 2, { detalle: 'Lata' }),
  p('es3', 'espumantes', 'Sidra Dadá', 9500, 3),
  p('es4', 'espumantes', 'Copa de Sidra Dadá', 4000, 4, { take_away: false }),

  // ── Cervezas ──────────────────────────────────────────────────────────────
  p('cv1', 'cervezas', 'Quilmes tirada', 5000, 1, { take_away: false }),
  p('cv2', 'cervezas', 'Stella Artois tirada', 7000, 2, { take_away: false }),
  p('cv3', 'cervezas', 'Patagonia lata', 6000, 3, { detalle: 'Amber · 24/7' }),
  p('cv4', 'cervezas', 'Stella Artois porrón', 5000, 4),
  p('cv5', 'cervezas', 'Corona / Corona Zero porrón', 7000, 5),

  // ── Sin alcohol ───────────────────────────────────────────────────────────
  p('sa1', 'sin-alcohol', 'Línea Coca-Cola', 4000, 1),
  p('sa2', 'sin-alcohol', 'Limonada menta / jengibre', 4500, 2),
  p('sa3', 'sin-alcohol', 'Jarra de limonada', 9500, 3),
  p('sa4', 'sin-alcohol', 'Agua mineral con y sin gas', 3500, 4, {
    detalle: 'Se cobra la botella y se rellena cuantas veces gusten',
  }),
];

/** Ejemplos de mostrador. Se reemplazan a diario desde el panel. */
export const TAPAS_BASE: TapaDelDia[] = [
  { id: 'x1', nombre: 'Pincho de tortilla', orden: 1 },
  { id: 'x2', nombre: 'Tosta de sardina ahumada', orden: 2 },
  { id: 'x3', nombre: 'Morcilla vasca con pera y queso azul', orden: 3 },
  { id: 'x4', nombre: 'Tosta de paté de salmón', orden: 4 },
  { id: 'x5', nombre: 'Olivas marinadas', orden: 5 },
];

export const PRECIO_TAPA = 4500;
