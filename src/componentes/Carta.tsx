'use client';

import { useMemo, useState } from 'react';
import { pesos } from '@/lib/formato';
import type { Categoria, Producto } from '@/lib/types';
import { usePedido } from './PedidoContexto';
import { Revelar } from './Revelar';
import { Asterisco } from './Trazos';

export function Carta({
  categorias,
  productos,
  takeAwayActivo,
}: {
  categorias: Categoria[];
  productos: Producto[];
  takeAwayActivo: boolean;
}) {
  const cocina = categorias.filter((c) => c.grupo === 'cocina');
  const barra = categorias.filter((c) => c.grupo === 'barra');

  const [grupo, setGrupo] = useState<'cocina' | 'barra'>('cocina');
  const visibles = grupo === 'cocina' ? cocina : barra;

  const porCategoria = useMemo(() => {
    const mapa = new Map<string, Producto[]>();
    for (const p of productos) {
      const lista = mapa.get(p.categoria_slug) ?? [];
      lista.push(p);
      mapa.set(p.categoria_slug, lista);
    }
    for (const lista of mapa.values()) lista.sort((a, b) => a.orden - b.orden);
    return mapa;
  }, [productos]);

  return (
    <section id="carta" className="relative py-24 sm:py-32">
      <div className="contenedor">
        <Revelar className="mb-14 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="etiqueta mb-6 flex items-center gap-2.5 text-[var(--color-teja)]">
              <Asterisco className="h-3 w-3" />
              La carta
            </p>
            <h2 className="titular-seccion text-[var(--color-marino)]">
              Todo se comparte,
              <br />
              <span className="subrayado">nada se pide solo.</span>
            </h2>
          </div>

          {/* Interruptor cocina / barra */}
          <div
            role="tablist"
            aria-label="Secciones de la carta"
            className="flex shrink-0 gap-1 self-start rounded-full border-[1.5px] border-[var(--color-marino)]/15 p-1 sm:self-end"
          >
            {(['cocina', 'barra'] as const).map((g) => (
              <button
                key={g}
                role="tab"
                aria-selected={grupo === g}
                type="button"
                onClick={() => setGrupo(g)}
                className={`rounded-full px-6 py-2.5 text-[0.9rem] font-bold capitalize transition-all ${
                  grupo === g
                    ? 'bg-[var(--color-cobalto)] text-[var(--color-cal)]'
                    : 'text-[var(--color-marino)]/60 hover:text-[var(--color-marino)]'
                }`}
              >
                {g === 'cocina' ? 'Cocina' : 'Barra'}
              </button>
            ))}
          </div>
        </Revelar>

        <div className="space-y-20">
          {visibles.map((categoria) => (
            <BloqueCategoria
              key={categoria.slug}
              categoria={categoria}
              productos={porCategoria.get(categoria.slug) ?? []}
              takeAwayActivo={takeAwayActivo}
            />
          ))}
        </div>

        <Revelar className="mt-20 rounded-2xl border-[1.5px] border-dashed border-[var(--color-marino)]/22 px-7 py-6">
          <p className="text-[0.95rem] leading-relaxed text-[var(--color-marino)]/70">
            <strong className="font-semibold text-[var(--color-marino)]">Los precios cambian</strong>{' '}
            y algunos platos se agotan durante la noche. Si algo no está disponible te lo
            avisamos al confirmar el pedido.
          </p>
        </Revelar>
      </div>
    </section>
  );
}

function BloqueCategoria({
  categoria,
  productos,
  takeAwayActivo,
}: {
  categoria: Categoria;
  productos: Producto[];
  takeAwayActivo: boolean;
}) {
  if (productos.length === 0) return null;

  const esEspecial = categoria.slug === 'especial';

  return (
    <Revelar
      como="article"
      className={`grid gap-x-10 gap-y-7 lg:grid-cols-12 ${
        esEspecial ? 'rounded-3xl bg-[var(--color-burdeos)] px-7 py-10 sm:px-12 sm:py-12' : ''
      }`}
    >
      {/* Encabezado en columna angosta, alineado a la derecha en desktop */}
      <header className="lg:col-span-4 lg:text-right">
        <h3
          className={`text-[clamp(1.9rem,4vw,3rem)] font-[800] leading-[0.95] tracking-[-0.035em] ${
            esEspecial ? 'text-[var(--color-cal)]' : 'text-[var(--color-cobalto)]'
          }`}
        >
          {categoria.nombre}
        </h3>
        {categoria.bajada && (
          <p
            className={`mt-3 text-[0.95rem] leading-snug ${
              esEspecial ? 'text-[var(--color-cal)]/70' : 'text-[var(--color-marino)]/55'
            }`}
          >
            {categoria.bajada}
          </p>
        )}
        {categoria.precio_fijo && (
          <p
            className={`precio mt-4 inline-block rounded-full px-3.5 py-1.5 text-[0.85rem] font-medium ${
              esEspecial
                ? 'bg-[var(--color-cal)]/15 text-[var(--color-cal)]'
                : 'bg-[var(--color-cobalto)]/10 text-[var(--color-cobalto)]'
            }`}
          >
            {pesos(categoria.precio_fijo)} c/u
          </p>
        )}
      </header>

      <ul className="lg:col-span-7 lg:col-start-6">
        {productos.map((producto) => (
          <FilaProducto
            key={producto.id}
            producto={producto}
            oscuro={esEspecial}
            takeAwayActivo={takeAwayActivo}
          />
        ))}
      </ul>
    </Revelar>
  );
}

function FilaProducto({
  producto,
  oscuro,
  takeAwayActivo,
}: {
  producto: Producto;
  oscuro: boolean;
  takeAwayActivo: boolean;
}) {
  const { agregar, cantidadDe } = usePedido();
  const cantidad = cantidadDe(producto.id);
  const sePuedePedir = takeAwayActivo && producto.take_away && producto.disponible;

  const tinta = oscuro ? 'var(--color-cal)' : 'var(--color-marino)';

  return (
    <li
      className={`group flex items-baseline gap-3 border-b py-4 transition-colors ${
        oscuro ? 'border-[var(--color-cal)]/15' : 'border-[var(--color-marino)]/10'
      } ${!producto.disponible ? 'opacity-45' : ''}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span
            className="text-[1.05rem] font-semibold leading-snug tracking-[-0.012em]"
            style={{ color: tinta }}
          >
            {producto.nombre}
          </span>

          {producto.vegetariano && <Distintivo texto="veg" oscuro={oscuro} />}
          {producto.sin_gluten && <Distintivo texto="sin tacc" oscuro={oscuro} />}
          {!producto.disponible && <Distintivo texto="hoy no hay" oscuro={oscuro} alerta />}
        </div>

        {producto.detalle && (
          <p
            className="mt-1 text-[0.875rem] leading-snug"
            style={{ color: oscuro ? 'rgba(250,247,241,0.6)' : 'rgba(16,31,71,0.55)' }}
          >
            {producto.detalle}
          </p>
        )}
      </div>

      {/* Línea de puntos hacia el precio: tipografía de carta impresa */}
      <span
        aria-hidden="true"
        className="hidden h-px min-w-6 flex-1 self-center border-b border-dotted sm:block"
        style={{ borderColor: oscuro ? 'rgba(250,247,241,0.28)' : 'rgba(16,31,71,0.22)' }}
      />

      <span className="precio shrink-0 text-[1rem] font-medium" style={{ color: tinta }}>
        {pesos(producto.precio)}
      </span>

      {sePuedePedir && (
        <button
          type="button"
          onClick={() => agregar(producto)}
          aria-label={`Agregar ${producto.nombre} al pedido`}
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-[1.5px] transition-all active:scale-90 ${
            cantidad > 0
              ? 'border-transparent bg-[var(--color-teja)] text-white'
              : oscuro
                ? 'border-[var(--color-cal)]/30 text-[var(--color-cal)] hover:border-[var(--color-cal)] hover:bg-[var(--color-cal)] hover:text-[var(--color-burdeos)]'
                : 'border-[var(--color-marino)]/20 text-[var(--color-marino)] hover:border-[var(--color-cobalto)] hover:bg-[var(--color-cobalto)] hover:text-[var(--color-cal)]'
          }`}
        >
          {cantidad > 0 ? (
            <span className="precio text-[0.8rem] font-medium">{cantidad}</span>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          )}
        </button>
      )}
    </li>
  );
}

function Distintivo({
  texto,
  oscuro,
  alerta = false,
}: {
  texto: string;
  oscuro: boolean;
  alerta?: boolean;
}) {
  return (
    <span
      className="etiqueta rounded-full px-2 py-0.5 text-[0.6rem] leading-none"
      style={{
        background: alerta
          ? 'rgba(179,35,46,0.12)'
          : oscuro
            ? 'rgba(250,247,241,0.14)'
            : 'rgba(27,63,168,0.09)',
        color: alerta ? 'var(--color-teja)' : oscuro ? 'rgba(250,247,241,0.85)' : 'var(--color-cobalto)',
      }}
    >
      {texto}
    </span>
  );
}
