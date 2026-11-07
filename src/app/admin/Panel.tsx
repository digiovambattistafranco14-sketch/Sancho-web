'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Marca } from '@/componentes/Marca';
import { pesos } from '@/lib/formato';
import { supabaseNavegador } from '@/lib/supabase/cliente';
import type { Categoria, Config, Producto, TapaDelDia } from '@/lib/types';
import { refrescarCarta } from './acciones';

type ConfigFila = Config & { precio_tapa: number };

const SOLAPAS = [
  { id: 'carta', texto: 'Carta' },
  { id: 'mostrador', texto: 'Mostrador' },
  { id: 'ajustes', texto: 'Ajustes' },
] as const;

type Solapa = (typeof SOLAPAS)[number]['id'];

export function Panel({
  email,
  categorias,
  productos,
  tapas,
  config,
}: {
  email: string;
  categorias: Categoria[];
  productos: Producto[];
  tapas: TapaDelDia[];
  config: ConfigFila | null;
}) {
  const router = useRouter();
  const [solapa, setSolapa] = useState<Solapa>('carta');
  const [aviso, setAviso] = useState<string | null>(null);

  const supabase = useMemo(() => supabaseNavegador(), []);

  function avisar(texto: string) {
    setAviso(texto);
    window.setTimeout(() => setAviso(null), 2600);
  }

  function recargar() {
    router.refresh();
    // Sin await: la home se regenera en segundo plano, el panel no espera.
    void refrescarCarta();
  }

  async function salir() {
    await supabase?.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="min-h-dvh pb-24">
      <header className="sticky top-0 z-30 border-b-[1.5px] border-[var(--color-marino)]/12 bg-[var(--color-cal)]/95 backdrop-blur">
        <div className="contenedor flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-baseline gap-3">
            <Marca className="text-[1.5rem]" />
            <span className="etiqueta text-[var(--color-humo)]">Panel</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-[0.88rem] font-semibold text-[var(--color-marino)]/60 transition-colors hover:text-[var(--color-cobalto)]"
            >
              Ver el sitio ↗
            </a>
            <button
              type="button"
              onClick={salir}
              className="rounded-full border-[1.5px] border-[var(--color-marino)]/18 px-4 py-2 text-[0.85rem] font-semibold transition-colors hover:border-[var(--color-teja)] hover:text-[var(--color-teja)]"
            >
              Salir
            </button>
          </div>
        </div>

        <div className="contenedor flex gap-1 pb-3">
          {SOLAPAS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSolapa(s.id)}
              className={`rounded-full px-5 py-2 text-[0.9rem] font-bold transition-all ${
                solapa === s.id
                  ? 'bg-[var(--color-cobalto)] text-[var(--color-cal)]'
                  : 'text-[var(--color-marino)]/55 hover:bg-[var(--color-cobalto)]/8'
              }`}
            >
              {s.texto}
            </button>
          ))}
        </div>
      </header>

      {aviso && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[var(--color-marino)] px-6 py-3 text-[0.9rem] font-semibold text-[var(--color-cal)] shadow-lg">
          {aviso}
        </div>
      )}

      <main className="contenedor pt-10">
        {solapa === 'carta' && (
          <SolapaCarta
            categorias={categorias}
            productos={productos}
            avisar={avisar}
            recargar={recargar}
          />
        )}
        {solapa === 'mostrador' && (
          <SolapaMostrador
            tapas={tapas}
            precioTapa={config?.precio_tapa ?? 4500}
            avisar={avisar}
            recargar={recargar}
          />
        )}
        {solapa === 'ajustes' && (
          <SolapaAjustes config={config} email={email} avisar={avisar} recargar={recargar} />
        )}
      </main>
    </div>
  );
}

/* ══ Carta ═══════════════════════════════════════════════════════════════ */

function SolapaCarta({
  categorias,
  productos,
  avisar,
  recargar,
}: {
  categorias: Categoria[];
  productos: Producto[];
  avisar: (t: string) => void;
  recargar: () => void;
}) {
  const supabase = useMemo(() => supabaseNavegador(), []);
  const [guardando, setGuardando] = useState<string | null>(null);

  async function actualizar(id: string, cambios: Partial<Producto>) {
    if (!supabase) return;
    setGuardando(id);
    const { error } = await supabase.from('productos').update(cambios).eq('id', id);
    setGuardando(null);
    if (error) return avisar('No se pudo guardar: ' + error.message);
    avisar('Guardado');
    recargar();
  }

  async function eliminar(producto: Producto) {
    if (!supabase) return;
    if (!window.confirm(`¿Sacar "${producto.nombre}" de la carta para siempre?`)) return;
    const { error } = await supabase.from('productos').delete().eq('id', producto.id);
    if (error) return avisar('No se pudo borrar: ' + error.message);
    avisar('Eliminado');
    recargar();
  }

  async function agregar(categoriaSlug: string) {
    if (!supabase) return;
    const nombre = window.prompt('Nombre del plato');
    if (!nombre?.trim()) return;

    const orden = Math.max(0, ...productos.filter((p) => p.categoria_slug === categoriaSlug).map((p) => p.orden)) + 1;
    const { error } = await supabase
      .from('productos')
      .insert({ categoria_slug: categoriaSlug, nombre: nombre.trim(), precio: 0, orden });

    if (error) return avisar('No se pudo agregar: ' + error.message);
    avisar('Agregado — cargale el precio');
    recargar();
  }

  return (
    <div className="space-y-12">
      <p className="max-w-2xl text-[0.95rem] leading-relaxed text-[var(--color-marino)]/70">
        Cada plato tiene dos botones que muestran cómo está ahora. Tocalos para cambiarlos.
        <br />
        <strong className="font-semibold text-[var(--color-marino)]">Hay / No hay:</strong> si lo
        dejás en <em>No hay</em>, el plato aparece tachado en la web y nadie puede pedirlo.
        <br />
        <strong className="font-semibold text-[var(--color-marino)]">
          Para llevar / Solo en el local:
        </strong>{' '}
        define si se puede pedir por WhatsApp. Los huevos rotos y las cañas conviene dejarlos en{' '}
        <em>Solo en el local</em> porque no viajan bien.
      </p>

      {categorias.map((categoria) => {
        const items = productos
          .filter((p) => p.categoria_slug === categoria.slug)
          .sort((a, b) => a.orden - b.orden);

        return (
          <section key={categoria.slug}>
            <div className="mb-4 flex items-end justify-between gap-4 border-b-[1.5px] border-[var(--color-marino)]/12 pb-3">
              <h2 className="text-[1.6rem] font-[800] tracking-[-0.03em] text-[var(--color-cobalto)]">
                {categoria.nombre}
              </h2>
              <button
                type="button"
                onClick={() => agregar(categoria.slug)}
                className="rounded-full border-[1.5px] border-[var(--color-marino)]/18 px-4 py-1.5 text-[0.82rem] font-bold transition-colors hover:border-[var(--color-cobalto)] hover:text-[var(--color-cobalto)]"
              >
                + Agregar
              </button>
            </div>

            <ul className="space-y-1">
              {items.map((producto) => (
                <li
                  key={producto.id}
                  className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--color-cobalto)]/5 ${
                    guardando === producto.id ? 'opacity-50' : ''
                  }`}
                >
                  <input
                    defaultValue={producto.nombre}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v && v !== producto.nombre) actualizar(producto.id, { nombre: v });
                    }}
                    aria-label={`Nombre de ${producto.nombre}`}
                    className={`min-w-[10rem] flex-1 rounded-lg border-[1.5px] border-transparent bg-transparent px-2 py-1.5 text-[0.98rem] font-semibold outline-none transition-colors hover:border-[var(--color-marino)]/15 focus:border-[var(--color-cobalto)] ${
                      producto.disponible ? '' : 'line-through opacity-50'
                    }`}
                  />

                  <div className="flex items-center gap-1 rounded-lg border-[1.5px] border-transparent px-1 transition-colors focus-within:border-[var(--color-cobalto)] hover:border-[var(--color-marino)]/15">
                    <span className="precio text-[0.9rem] text-[var(--color-marino)]/45">$</span>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      defaultValue={producto.precio}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (Number.isFinite(v) && v !== producto.precio) actualizar(producto.id, { precio: v });
                      }}
                      aria-label={`Precio de ${producto.nombre}`}
                      className="precio w-24 bg-transparent py-1.5 text-[0.95rem] outline-none"
                    />
                  </div>

                  <Interruptor
                    activo={producto.disponible}
                    siActivo="Hay"
                    siApagado="No hay"
                    onCambiar={(v) => actualizar(producto.id, { disponible: v })}
                  />
                  <Interruptor
                    activo={producto.take_away}
                    siActivo="Para llevar"
                    siApagado="Solo en el local"
                    onCambiar={(v) => actualizar(producto.id, { take_away: v })}
                  />

                  <button
                    type="button"
                    onClick={() => eliminar(producto)}
                    aria-label={`Eliminar ${producto.nombre}`}
                    className="grid h-8 w-8 place-items-center rounded-full text-[var(--color-marino)]/25 transition-colors hover:bg-[var(--color-teja)]/10 hover:text-[var(--color-teja)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/* ══ Mostrador ═══════════════════════════════════════════════════════════ */

function SolapaMostrador({
  tapas,
  precioTapa,
  avisar,
  recargar,
}: {
  tapas: TapaDelDia[];
  precioTapa: number;
  avisar: (t: string) => void;
  recargar: () => void;
}) {
  const supabase = useMemo(() => supabaseNavegador(), []);
  const [nueva, setNueva] = useState('');
  const [precio, setPrecio] = useState(precioTapa);

  async function agregar(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !nueva.trim()) return;
    const orden = Math.max(0, ...tapas.map((t) => t.orden)) + 1;
    const { error } = await supabase.from('tapas_del_dia').insert({ nombre: nueva.trim(), orden });
    if (error) return avisar('No se pudo agregar: ' + error.message);
    setNueva('');
    avisar('Tapa agregada');
    recargar();
  }

  async function quitar(id: string) {
    if (!supabase) return;
    const { error } = await supabase.from('tapas_del_dia').delete().eq('id', id);
    if (error) return avisar('No se pudo borrar: ' + error.message);
    recargar();
  }

  async function guardarPrecio() {
    if (!supabase) return;
    const { error } = await supabase.from('config').update({ precio_tapa: precio }).eq('id', 1);
    if (error) return avisar('No se pudo guardar: ' + error.message);
    avisar('Precio actualizado');
    recargar();
  }

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h2 className="text-[1.9rem] font-[800] tracking-[-0.03em] text-[var(--color-marino)]">
          Tapas de hoy
        </h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--color-marino)]/70">
          Lo que esté en el mostrador esta noche. Se muestra en la web pero no se puede pedir
          para llevar — es a propósito.
        </p>
      </div>

      <form onSubmit={agregar} className="flex gap-2">
        <input
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          placeholder="Tosta de morcilla con pera"
          aria-label="Nueva tapa"
          className="flex-1 rounded-xl border-[1.5px] border-[var(--color-marino)]/18 bg-transparent px-4 py-3 text-[0.95rem] outline-none transition-colors focus:border-[var(--color-cobalto)]"
        />
        <button
          type="submit"
          className="rounded-xl bg-[var(--color-cobalto)] px-6 py-3 text-[0.95rem] font-bold text-[var(--color-cal)] transition-colors hover:bg-[var(--color-marino)]"
        >
          Agregar
        </button>
      </form>

      <ul className="space-y-1">
        {tapas.map((tapa, i) => (
          <li
            key={tapa.id}
            className="flex items-center gap-4 rounded-xl border-b border-[var(--color-marino)]/10 px-3 py-3"
          >
            <span className="precio text-[0.8rem] text-[var(--color-marino)]/35">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="flex-1 text-[1.05rem] font-semibold">{tapa.nombre}</span>
            <button
              type="button"
              onClick={() => quitar(tapa.id)}
              aria-label={`Quitar ${tapa.nombre}`}
              className="grid h-8 w-8 place-items-center rounded-full text-[var(--color-marino)]/25 transition-colors hover:bg-[var(--color-teja)]/10 hover:text-[var(--color-teja)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </li>
        ))}
        {tapas.length === 0 && (
          <li className="py-8 text-center text-[0.95rem] text-[var(--color-marino)]/45">
            Todavía no cargaste ninguna tapa para hoy.
          </li>
        )}
      </ul>

      <div className="border-t-[1.5px] border-[var(--color-marino)]/12 pt-8">
        <label htmlFor="precio-tapa" className="etiqueta mb-2 block text-[var(--color-marino)]/70">
          Precio de cada tapa
        </label>
        <div className="flex gap-2">
          <input
            id="precio-tapa"
            type="number"
            min={0}
            step={500}
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
            className="precio w-40 rounded-xl border-[1.5px] border-[var(--color-marino)]/18 bg-transparent px-4 py-3 outline-none transition-colors focus:border-[var(--color-cobalto)]"
          />
          <button
            type="button"
            onClick={guardarPrecio}
            className="rounded-xl border-[1.5px] border-[var(--color-marino)]/18 px-6 py-3 text-[0.95rem] font-bold transition-colors hover:border-[var(--color-cobalto)] hover:text-[var(--color-cobalto)]"
          >
            Guardar
          </button>
          <span className="self-center text-[0.9rem] text-[var(--color-marino)]/45">
            hoy: {pesos(precioTapa)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══ Ajustes ═════════════════════════════════════════════════════════════ */

const DIAS_SEMANA = [
  { valor: 1, texto: 'Lun' },
  { valor: 2, texto: 'Mar' },
  { valor: 3, texto: 'Mié' },
  { valor: 4, texto: 'Jue' },
  { valor: 5, texto: 'Vie' },
  { valor: 6, texto: 'Sáb' },
  { valor: 0, texto: 'Dom' },
];

function SolapaAjustes({
  config,
  email,
  avisar,
  recargar,
}: {
  config: ConfigFila | null;
  email: string;
  avisar: (t: string) => void;
  recargar: () => void;
}) {
  const supabase = useMemo(() => supabaseNavegador(), []);
  const [datos, setDatos] = useState<Partial<ConfigFila>>(config ?? {});
  const [guardando, setGuardando] = useState(false);

  function set<K extends keyof ConfigFila>(clave: K, valor: ConfigFila[K]) {
    setDatos((d) => ({ ...d, [clave]: valor }));
  }

  async function guardar() {
    if (!supabase) return;
    setGuardando(true);
    const { error } = await supabase.from('config').update(datos).eq('id', 1);
    setGuardando(false);
    if (error) return avisar('No se pudo guardar: ' + error.message);
    avisar('Ajustes guardados');
    recargar();
  }

  const dias = datos.dias_abiertos ?? [];

  return (
    <div className="max-w-2xl space-y-8 pb-16">
      <div>
        <h2 className="text-[1.9rem] font-[800] tracking-[-0.03em] text-[var(--color-marino)]">
          Ajustes del local
        </h2>
        <p className="mt-2 text-[0.9rem] text-[var(--color-marino)]/50">Sesión: {email}</p>
      </div>

      <CampoTexto
        etiqueta="WhatsApp (con código de país, sin + ni espacios)"
        valor={datos.whatsapp ?? ''}
        alCambiar={(v) => set('whatsapp', v)}
        pista="Ej: 5492216600777 — así llegan los pedidos"
      />

      <CampoTexto
        etiqueta="Dirección"
        valor={datos.direccion ?? ''}
        alCambiar={(v) => set('direccion', v)}
      />

      <CampoTexto
        etiqueta="Cómo llegar"
        valor={datos.como_llegar ?? ''}
        alCambiar={(v) => set('como_llegar', v)}
      />

      <CampoTexto
        etiqueta="Horarios (texto que se muestra)"
        valor={datos.horarios ?? ''}
        alCambiar={(v) => set('horarios', v)}
      />

      <div>
        <p className="etiqueta mb-2.5 text-[var(--color-marino)]/70">Días que abre</p>
        <div className="flex flex-wrap gap-2">
          {DIAS_SEMANA.map((d) => {
            const activo = dias.includes(d.valor);
            return (
              <button
                key={d.valor}
                type="button"
                onClick={() =>
                  set(
                    'dias_abiertos',
                    activo ? dias.filter((x) => x !== d.valor) : [...dias, d.valor],
                  )
                }
                className={`rounded-full border-[1.5px] px-4 py-2 text-[0.88rem] font-bold transition-all ${
                  activo
                    ? 'border-transparent bg-[var(--color-cobalto)] text-[var(--color-cal)]'
                    : 'border-[var(--color-marino)]/18 text-[var(--color-marino)]/50'
                }`}
              >
                {d.texto}
              </button>
            );
          })}
        </div>
      </div>

      <CampoTexto
        etiqueta="Happy hour"
        valor={datos.happy_hour ?? ''}
        alCambiar={(v) => set('happy_hour', v)}
      />

      <div>
        <label htmlFor="desc" className="etiqueta mb-2 block text-[var(--color-marino)]/70">
          Descuento en efectivo (%)
        </label>
        <input
          id="desc"
          type="number"
          min={0}
          max={50}
          value={datos.descuento_efectivo ?? 0}
          onChange={(e) => set('descuento_efectivo', Number(e.target.value))}
          className="precio w-32 rounded-xl border-[1.5px] border-[var(--color-marino)]/18 bg-transparent px-4 py-3 outline-none focus:border-[var(--color-cobalto)]"
        />
      </div>

      <div className="grid gap-6 rounded-2xl border-[1.5px] border-[var(--color-marino)]/12 p-6 sm:grid-cols-2">
        <p className="sm:col-span-2 text-[0.9rem] text-[var(--color-marino)]/60">
          Datos de transferencia. Si los completás, se agregan automáticamente al mensaje de
          WhatsApp cuando el cliente elige pagar por transferencia.
        </p>
        <CampoTexto
          etiqueta="Alias"
          valor={datos.alias ?? ''}
          alCambiar={(v) => set('alias', v)}
        />
        <CampoTexto
          etiqueta="A nombre de"
          valor={datos.titular ?? ''}
          alCambiar={(v) => set('titular', v)}
        />
      </div>

      <CampoTexto
        etiqueta="Aviso en la web (dejalo vacío para ocultarlo)"
        valor={datos.aviso ?? ''}
        alCambiar={(v) => set('aviso', v)}
        pista="Ej: Cerrado por vacaciones del 5 al 12 de enero"
      />

      <label className="flex items-center gap-3 rounded-2xl border-[1.5px] border-[var(--color-marino)]/12 px-5 py-4">
        <input
          type="checkbox"
          checked={datos.take_away_activo ?? true}
          onChange={(e) => set('take_away_activo', e.target.checked)}
          className="h-5 w-5 accent-[var(--color-cobalto)]"
        />
        <span>
          <span className="block text-[1rem] font-semibold">Pedidos para llevar activos</span>
          <span className="block text-[0.85rem] text-[var(--color-marino)]/55">
            Si lo apagás, desaparece el armador de pedidos de toda la web.
          </span>
        </span>
      </label>

      <button
        type="button"
        onClick={guardar}
        disabled={guardando}
        className="w-full rounded-full bg-[var(--color-cobalto)] px-6 py-4 text-[1rem] font-bold text-[var(--color-cal)] transition-colors hover:bg-[var(--color-marino)] disabled:opacity-50 sm:w-auto sm:px-10"
      >
        {guardando ? 'Guardando…' : 'Guardar ajustes'}
      </button>
    </div>
  );
}

/* ══ Piezas ══════════════════════════════════════════════════════════════ */

/**
 * Muestra el estado actual, no la acción. Si dice "No hay", es que no hay:
 * tocarlo lo vuelve a poner en "Hay".
 */
function Interruptor({
  activo,
  siActivo,
  siApagado,
  onCambiar,
}: {
  activo: boolean;
  siActivo: string;
  siApagado: string;
  onCambiar: (v: boolean) => void;
}) {
  const etiqueta = activo ? siActivo : siApagado;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={`${etiqueta} — tocá para cambiar`}
      title={activo ? `Tocá para pasar a "${siApagado}"` : `Tocá para pasar a "${siActivo}"`}
      onClick={() => onCambiar(!activo)}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border-[1.5px] px-3 py-1.5 text-[0.78rem] font-bold whitespace-nowrap transition-all ${
        activo
          ? 'border-transparent bg-[var(--color-cobalto)] text-[var(--color-cal)]'
          : 'border-[var(--color-teja)]/45 bg-[var(--color-teja)]/8 text-[var(--color-teja)]'
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          activo ? 'bg-[var(--color-cal)]' : 'bg-[var(--color-teja)]'
        }`}
      />
      {etiqueta}
    </button>
  );
}

function CampoTexto({
  etiqueta,
  valor,
  alCambiar,
  pista,
}: {
  etiqueta: string;
  valor: string;
  alCambiar: (v: string) => void;
  pista?: string;
}) {
  const id = `aj-${etiqueta.slice(0, 14).toLowerCase().replace(/[^a-z]+/g, '-')}`;
  return (
    <div>
      <label htmlFor={id} className="etiqueta mb-2 block text-[var(--color-marino)]/70">
        {etiqueta}
      </label>
      <input
        id={id}
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        className="w-full rounded-xl border-[1.5px] border-[var(--color-marino)]/18 bg-transparent px-4 py-3 text-[0.95rem] outline-none transition-colors focus:border-[var(--color-cobalto)]"
      />
      {pista && <p className="mt-1.5 text-[0.8rem] text-[var(--color-marino)]/45">{pista}</p>}
    </div>
  );
}
