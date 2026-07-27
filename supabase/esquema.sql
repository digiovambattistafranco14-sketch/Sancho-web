-- ════════════════════════════════════════════════════════════════════════════
-- SANCHO — esquema de base de datos
-- Pegá TODO este archivo en Supabase → SQL Editor → Run.
-- Es idempotente: podés volver a correrlo sin romper nada.
-- ════════════════════════════════════════════════════════════════════════════

-- ── Tablas ──────────────────────────────────────────────────────────────────

create table if not exists public.categorias (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  nombre      text not null,
  bajada      text,
  precio_fijo integer,
  grupo       text not null default 'cocina' check (grupo in ('cocina', 'barra')),
  orden       integer not null default 0,
  activa      boolean not null default true,
  creado_en   timestamptz not null default now()
);

create table if not exists public.productos (
  id             uuid primary key default gen_random_uuid(),
  categoria_slug text not null references public.categorias(slug) on update cascade on delete cascade,
  nombre         text not null,
  detalle        text,
  precio         integer not null default 0 check (precio >= 0),
  orden          integer not null default 0,
  disponible     boolean not null default true,
  take_away      boolean not null default true,
  vegetariano    boolean not null default false,
  sin_gluten     boolean not null default false,
  creado_en      timestamptz not null default now()
);

create index if not exists productos_categoria_idx on public.productos (categoria_slug, orden);

-- Evita que volver a correr este archivo duplique la carta.
create unique index if not exists productos_unicos_idx on public.productos (categoria_slug, nombre);

-- Las tapas del mostrador cambian a diario y no tienen precio propio.
create table if not exists public.tapas_del_dia (
  id        uuid primary key default gen_random_uuid(),
  nombre    text not null,
  orden     integer not null default 0,
  creado_en timestamptz not null default now()
);

-- Fila única (id = 1) con todos los ajustes del local.
create table if not exists public.config (
  id                 integer primary key default 1 check (id = 1),
  whatsapp           text not null default '5492216600777',
  direccion          text not null default 'Diag. 3 (Jorge Bell) 375, e/ 473 y 473 bis · City Bell',
  como_llegar        text not null default 'A media cuadra de Cantilo, en el local donde nació el primer Don Quijote.',
  horarios           text not null default 'Miércoles a domingo, de 18 a 00',
  dias_abiertos      integer[] not null default '{3,4,5,6,0}',
  happy_hour         text not null default '2x1 en tragos y cañas, de 18 a 20',
  descuento_efectivo integer not null default 10,
  precio_tapa        integer not null default 4500,
  alias              text,
  titular            text,
  aviso              text,
  take_away_activo   boolean not null default true,
  instagram          text not null default 'https://www.instagram.com/sancho_cb',
  maps_url           text not null default 'https://www.google.com/maps/search/?api=1&query=Sancho+Tapas+y+Barra+City+Bell'
);

insert into public.config (id) values (1) on conflict (id) do nothing;

-- ── Seguridad (RLS) ─────────────────────────────────────────────────────────
-- Cualquiera puede LEER la carta (la web es pública).
-- Solo usuarios logueados pueden ESCRIBIR (el panel /admin).

alter table public.categorias    enable row level security;
alter table public.productos     enable row level security;
alter table public.tapas_del_dia enable row level security;
alter table public.config        enable row level security;

do $$
declare t text;
begin
  foreach t in array array['categorias', 'productos', 'tapas_del_dia', 'config'] loop
    execute format('drop policy if exists "lectura publica" on public.%I', t);
    execute format('drop policy if exists "escritura autenticada" on public.%I', t);

    execute format(
      'create policy "lectura publica" on public.%I for select to anon, authenticated using (true)', t);

    execute format(
      'create policy "escritura autenticada" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- ── Carga inicial: la carta real de Sancho ──────────────────────────────────

insert into public.categorias (slug, nombre, bajada, precio_fijo, grupo, orden) values
  ('para-picar',    'Para picar',          'Lo que se pide primero y siempre se pide de nuevo.', null,  'cocina', 1),
  ('raciones',      'Raciones',            'Plato al centro. Nadie mira su propio plato.',       null,  'cocina', 2),
  ('bocattas',      'Bocattas',            'Pan propio. Cinco provincias, cinco rellenos.',      12000, 'cocina', 3),
  ('especial',      'Especial',            'Todos los jueves.',                                  null,  'cocina', 4),
  ('postres',       'Postres',             'Dos. Los de siempre. No hacen falta más.',           null,  'cocina', 5),
  ('tragos',        'Tragos',              null,                                                 null,  'barra',  6),
  ('vinos-copa',    'Vinos por copa',      null,                                                 null,  'barra',  7),
  ('vinos-botella', 'Vinos por botella',   null,                                                 null,  'barra',  8),
  ('espumantes',    'Espumantes y sidra',  null,                                                 null,  'barra',  9),
  ('cervezas',      'Cervezas',            null,                                                 null,  'barra', 10),
  ('sin-alcohol',   'Gaseosas y aguas',    null,                                                 null,  'barra', 11)
on conflict (slug) do nothing;

insert into public.productos
  (categoria_slug, nombre, detalle, precio, orden, take_away, vegetariano, sin_gluten)
values
  -- Para picar
  ('para-picar', 'Croquetas de jamón serrano', '4 unidades', 13000, 1, true,  false, false),
  ('para-picar', 'Croquetas de setas',         '4 unidades', 13000, 2, true,  true,  false),
  ('para-picar', 'Tortilla de patatas confitadas', null,      9500, 3, true,  true,  true),
  ('para-picar', 'Huevos rotos con jamón',     null,         12000, 4, false, false, false),
  ('para-picar', 'Huevos rotos con txistorra', null,         14500, 5, false, false, false),
  ('para-picar', 'Huevos rotos veggie',        null,         12000, 6, false, true,  false),
  ('para-picar', 'Empanadillas de camarones',  '3 unidades', 14000, 7, true,  false, false),
  ('para-picar', 'Papas bravas',               null,          9000, 8, true,  true,  true),
  -- Raciones
  ('raciones', 'Txipirones al ajillo',                null,         21000, 1, true, false, true),
  ('raciones', 'Gambas al ajillo',                    null,         19000, 2, true, false, true),
  ('raciones', 'Rabas',                               null,         19000, 3, true, false, false),
  ('raciones', 'Pulpo a la gallega',                  null,         29000, 4, true, false, true),
  ('raciones', 'Brocheta de solomillo',               null,         16000, 5, true, false, true),
  ('raciones', 'Albondiguitas con salsa de tomate',   null,         12500, 6, true, false, false),
  ('raciones', 'Brochetta de verduras a la parrilla', '2 unidades', 11000, 7, true, true,  true),
  -- Bocattas
  ('bocattas', 'Catalunya', 'Jamón crudo, rúcula, parmesano, tomates cherry confitados',   12000, 1, true, false, false),
  ('bocattas', 'Andalucía', 'Solomillo, panceta ahumada, pimientos adobados, tortilla',    12000, 2, true, false, false),
  ('bocattas', 'Murcia',    'Rosca de pan, ensaladilla rusa, olivas marinadas y anchoas',  12000, 3, true, false, false),
  ('bocattas', 'Asturias',  'Pan relleno de jamón, cebolla, morrón, tomate, olivas negras',12000, 4, true, false, false),
  ('bocattas', 'Madrid',    'Calamares fritos y salsa tártara',                            12000, 5, true, false, false),
  -- Especial
  ('especial', 'Paella valenciana', 'Solo los jueves', 22000, 1, true, false, true),
  -- Postres
  ('postres', 'Arroz con leche y canela', null,  9000, 1, true, true, true),
  ('postres', 'Natilla quemada',          null, 11000, 2, true, true, true),
  -- Tragos
  ('tragos', 'Tinto de verano',              null, 5000,  1, false, false, false),
  ('tragos', 'Vermouth con soda y naranja',  null, 5000,  2, false, false, false),
  ('tragos', 'Fernet Branca con Coca-Cola',  null, 7000,  3, false, false, false),
  ('tragos', 'Gancia c/ Sprite',             null, 7000,  4, false, false, false),
  ('tragos', 'Gancia batido',                null, 8000,  5, false, false, false),
  ('tragos', 'Americano',                    null, 8000,  6, false, false, false),
  ('tragos', 'Cynar Julepp',                 null, 7000,  7, false, false, false),
  ('tragos', 'Negroni',                      null, 8000,  8, false, false, false),
  ('tragos', 'Aperol Spritz',                null, 8000,  9, false, false, false),
  ('tragos', 'Caipirinha',                   null, 8000, 10, false, false, false),
  ('tragos', 'Berrie''s Caipi',              null, 9000, 11, false, false, false),
  ('tragos', 'Tanqueray Gin Tonic',          null, 9500, 12, false, false, false),
  ('tragos', 'Gordon''s Gin Tonic',          null, 7500, 13, false, false, false),
  ('tragos', 'Smirnoff Capiroska',           null, 8000, 14, false, false, false),
  ('tragos', 'Campari c/ naranja',           null, 7500, 15, false, false, false),
  -- Vinos por copa
  ('vinos-copa', 'Trapiche Reserva Malbec',     null, 5000, 1, false, false, false),
  ('vinos-copa', 'El Cazador Malbec',           null, 3500, 2, false, false, false),
  ('vinos-copa', 'Marantiqua Pinot Noir',       null, 9500, 3, false, false, false),
  ('vinos-copa', 'Trapiche Reserva Chardonnay', null, 5000, 4, false, false, false),
  ('vinos-copa', 'El Cazador Blanco Dulce',     null, 3500, 5, false, false, false),
  ('vinos-copa', 'La Mascota Rosé',             null, 7000, 6, false, false, false),
  -- Vinos por botella
  ('vinos-botella', 'El Cazador Malbec',             null,  9500, 1, true, false, false),
  ('vinos-botella', 'La Mascota Cabernet Sauvignon', null, 18000, 2, true, false, false),
  ('vinos-botella', 'Marantiqua Pinot Noir',         null, 28000, 3, true, false, false),
  ('vinos-botella', 'Costa y Pampa Albariño',        null, 27000, 4, true, false, false),
  ('vinos-botella', 'La Mascota Rosado',             null, 18000, 5, true, false, false),
  ('vinos-botella', 'Trapiche Rva. Chardonnay',      null, 13000, 6, true, false, false),
  ('vinos-botella', 'Trapiche Rva. Malbec',          null, 13000, 7, true, false, false),
  ('vinos-botella', 'El Cazador Blanco Dulce',       null,  9500, 8, true, false, false),
  -- Espumantes y sidra
  ('espumantes', 'Dadá Extra Brut',            null,   11500, 1, true,  false, false),
  ('espumantes', 'Navarro Correas Extra Brut', 'Lata',  7000, 2, true,  false, false),
  ('espumantes', 'Sidra Dadá',                 null,    9500, 3, true,  false, false),
  ('espumantes', 'Copa de Sidra Dadá',         null,    4000, 4, false, false, false),
  -- Cervezas
  ('cervezas', 'Quilmes tirada',               null,           5000, 1, false, false, false),
  ('cervezas', 'Stella Artois tirada',         null,           7000, 2, false, false, false),
  ('cervezas', 'Patagonia lata',               'Amber · 24/7', 6000, 3, true,  false, false),
  ('cervezas', 'Stella Artois porrón',         null,           5000, 4, true,  false, false),
  ('cervezas', 'Corona / Corona Zero porrón',  null,           7000, 5, true,  false, false),
  -- Sin alcohol
  ('sin-alcohol', 'Línea Coca-Cola',              null, 4000, 1, true, true, true),
  ('sin-alcohol', 'Limonada menta / jengibre',    null, 4500, 2, true, true, true),
  ('sin-alcohol', 'Jarra de limonada',            null, 9500, 3, true, true, true),
  ('sin-alcohol', 'Agua mineral con y sin gas',
                  'Se cobra la botella y se rellena cuantas veces gusten', 3500, 4, true, true, true)
on conflict (categoria_slug, nombre) do nothing;

-- Tapas de ejemplo: solo si el mostrador está vacío.
insert into public.tapas_del_dia (nombre, orden)
select * from (values
  ('Pincho de tortilla', 1),
  ('Tosta de sardina ahumada', 2),
  ('Morcilla vasca con pera y queso azul', 3),
  ('Tosta de paté de salmón', 4),
  ('Olivas marinadas', 5)
) as t(nombre, orden)
where not exists (select 1 from public.tapas_del_dia);
