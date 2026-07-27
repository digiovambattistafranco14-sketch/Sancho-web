'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { pesos, proximosDiasAbiertos } from '@/lib/formato';
import type { Config } from '@/lib/types';
import {
  armarMensaje,
  descuentoPedido,
  enlaceWhatsApp,
  subtotalPedido,
  type DatosPedido,
  type MedioDePago,
} from '@/lib/whatsapp';
import { usePedido } from './PedidoContexto';
import { Asterisco, ManoBotella } from './Trazos';

const HORARIOS = ['Lo antes posible', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'];

const PAGOS: { valor: MedioDePago; etiqueta: string; nota?: string }[] = [
  { valor: 'efectivo', etiqueta: 'Efectivo' },
  { valor: 'transferencia', etiqueta: 'Transferencia' },
  { valor: 'tarjeta', etiqueta: 'Tarjeta' },
];

export function PanelPedido({ config }: { config: Config }) {
  const { items, panelAbierto, cerrarPanel, fijar, quitar, vaciar } = usePedido();

  const dias = useMemo(() => proximosDiasAbiertos(config.dias_abiertos, 5), [config.dias_abiertos]);

  const [datos, setDatos] = useState<DatosPedido>({
    nombre: '',
    telefono: '',
    fecha: '',
    horario: HORARIOS[0],
    pago: 'efectivo',
    notas: '',
  });
  const [intentado, setIntentado] = useState(false);
  const cerrarRef = useRef<HTMLButtonElement>(null);

  // El primer día disponible se elige en el cliente (depende de la fecha real).
  useEffect(() => {
    if (!datos.fecha && dias.length > 0) {
      setDatos((d) => ({ ...d, fecha: dias[0].valor }));
    }
  }, [dias, datos.fecha]);

  useEffect(() => {
    if (!panelAbierto) return;
    cerrarRef.current?.focus();
    const alApretar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrarPanel();
    };
    window.addEventListener('keydown', alApretar);
    return () => window.removeEventListener('keydown', alApretar);
  }, [panelAbierto, cerrarPanel]);

  const subtotal = subtotalPedido(items);
  const descuento = descuentoPedido(items, datos.pago, config.descuento_efectivo);
  const total = subtotal - descuento;

  const nombreOk = datos.nombre.trim().length >= 2;
  const telefonoOk = datos.telefono.replace(/\D/g, '').length >= 8;
  const listo = items.length > 0 && nombreOk && telefonoOk && Boolean(datos.fecha);

  function enviar() {
    setIntentado(true);
    if (!listo) return;
    const mensaje = armarMensaje(items, datos, config);
    window.open(enlaceWhatsApp(config.whatsapp, mensaje), '_blank', 'noopener');
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] overflow-hidden transition-opacity duration-400 ${
          panelAbierto ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!panelAbierto}
      >
        <button
          type="button"
          tabIndex={panelAbierto ? 0 : -1}
          onClick={cerrarPanel}
          aria-label="Cerrar el pedido"
          className="absolute inset-0 h-full w-full cursor-default bg-[var(--color-marino)]/45 backdrop-blur-[3px]"
        />

        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Tu pedido"
          className={`absolute inset-y-0 right-0 flex w-full max-w-[34rem] flex-col bg-[var(--color-cal)] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            panelAbierto ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Encabezado */}
          <header className="flex shrink-0 items-start justify-between gap-4 border-b-[1.5px] border-[var(--color-marino)]/12 px-6 py-5 sm:px-8">
            <div>
              <p className="etiqueta flex items-center gap-2 text-[var(--color-teja)]">
                <Asterisco className="h-2.5 w-2.5" />
                Para llevar
              </p>
              <h2 className="mt-2 text-[1.75rem] font-[800] leading-none tracking-[-0.035em] text-[var(--color-marino)]">
                Tu pedido
              </h2>
            </div>
            <button
              ref={cerrarRef}
              type="button"
              onClick={cerrarPanel}
              tabIndex={panelAbierto ? 0 : -1}
              aria-label="Cerrar"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[var(--color-marino)] transition-colors hover:bg-[var(--color-marino)]/8"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div className="scroll-fino min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-6 py-6 sm:px-8">
            {items.length === 0 ? (
              <Vacio alCerrar={cerrarPanel} />
            ) : (
              <div className="space-y-9">
                {/* Items */}
                <ul className="space-y-0">
                  {items.map((item) => (
                    <li
                      key={item.producto_id}
                      className="flex items-start gap-4 border-b border-[var(--color-marino)]/10 py-4 first:pt-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[1rem] font-semibold leading-snug text-[var(--color-marino)]">
                          {item.nombre}
                        </p>
                        {item.detalle && (
                          <p className="mt-0.5 text-[0.82rem] leading-snug text-[var(--color-marino)]/50">
                            {item.detalle}
                          </p>
                        )}
                        <p className="precio mt-1.5 text-[0.85rem] text-[var(--color-marino)]/60">
                          {pesos(item.precio)} c/u
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1 rounded-full border-[1.5px] border-[var(--color-marino)]/15">
                        <BotonCantidad
                          etiqueta={`Quitar uno de ${item.nombre}`}
                          onClick={() => fijar(item.producto_id, item.cantidad - 1)}
                        >
                          <path d="M5 12h14" />
                        </BotonCantidad>
                        <span className="precio w-6 text-center text-[0.9rem] font-medium text-[var(--color-marino)]">
                          {item.cantidad}
                        </span>
                        <BotonCantidad
                          etiqueta={`Agregar uno de ${item.nombre}`}
                          onClick={() => fijar(item.producto_id, item.cantidad + 1)}
                        >
                          <path d="M12 5v14M5 12h14" />
                        </BotonCantidad>
                      </div>

                      <span className="precio w-[4.5rem] shrink-0 text-right text-[0.95rem] font-medium text-[var(--color-marino)]">
                        {pesos(item.precio * item.cantidad)}
                      </span>

                      <button
                        type="button"
                        onClick={() => quitar(item.producto_id)}
                        aria-label={`Sacar ${item.nombre} del pedido`}
                        className="mt-0.5 shrink-0 text-[var(--color-marino)]/30 transition-colors hover:text-[var(--color-teja)]"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={vaciar}
                  className="etiqueta text-[var(--color-marino)]/40 transition-colors hover:text-[var(--color-teja)]"
                >
                  Vaciar pedido
                </button>

                {/* Datos */}
                <fieldset className="min-w-0 space-y-5 border-t-[1.5px] border-[var(--color-marino)]/12 pt-8">
                  <legend className="sr-only">Tus datos</legend>

                  <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                    <Campo
                      etiqueta="Tu nombre"
                      valor={datos.nombre}
                      alCambiar={(v) => setDatos({ ...datos, nombre: v })}
                      error={intentado && !nombreOk ? 'Necesitamos tu nombre' : null}
                      autoComplete="given-name"
                      placeholder="Franco"
                    />
                    <Campo
                      etiqueta="Teléfono"
                      valor={datos.telefono}
                      alCambiar={(v) => setDatos({ ...datos, telefono: v })}
                      error={intentado && !telefonoOk ? 'Poné un teléfono válido' : null}
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="221 555 5555"
                    />
                  </div>

                  <Selector
                    etiqueta="¿Para cuándo?"
                    opciones={dias.map((d) => ({ valor: d.valor, texto: d.etiqueta }))}
                    valor={datos.fecha}
                    alElegir={(v) => setDatos({ ...datos, fecha: v })}
                  />

                  <Selector
                    etiqueta="Horario de retiro"
                    opciones={HORARIOS.map((h) => ({ valor: h, texto: h }))}
                    valor={datos.horario}
                    alElegir={(v) => setDatos({ ...datos, horario: v })}
                  />

                  <div>
                    <p className="etiqueta mb-2.5 text-[var(--color-marino)]/70">Cómo pagás</p>
                    <div className="flex flex-wrap gap-2">
                      {PAGOS.map((p) => (
                        <button
                          key={p.valor}
                          type="button"
                          onClick={() => setDatos({ ...datos, pago: p.valor })}
                          className={`rounded-full border-[1.5px] px-4 py-2.5 text-[0.9rem] font-semibold transition-all ${
                            datos.pago === p.valor
                              ? 'border-transparent bg-[var(--color-cobalto)] text-[var(--color-cal)]'
                              : 'border-[var(--color-marino)]/18 text-[var(--color-marino)]/70 hover:border-[var(--color-cobalto)]'
                          }`}
                        >
                          {p.etiqueta}
                          {p.valor === 'efectivo' && config.descuento_efectivo > 0 && (
                            <span className="ml-1.5 opacity-75">−{config.descuento_efectivo}%</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="notas-pedido"
                      className="etiqueta mb-2 block text-[var(--color-marino)]/70"
                    >
                      Alguna aclaración
                    </label>
                    <textarea
                      id="notas-pedido"
                      rows={2}
                      value={datos.notas}
                      onChange={(e) => setDatos({ ...datos, notas: e.target.value })}
                      placeholder="Sin picante, celiaquía, lo que sea"
                      className="w-full resize-none rounded-xl border-[1.5px] border-[var(--color-marino)]/18 bg-transparent px-4 py-3 text-[0.95rem] text-[var(--color-marino)] outline-none transition-colors placeholder:text-[var(--color-marino)]/30 focus:border-[var(--color-cobalto)]"
                    />
                  </div>
                </fieldset>

                <p className="rounded-xl bg-[var(--color-cobalto)]/7 px-5 py-4 text-[0.85rem] leading-relaxed text-[var(--color-marino)]/70">
                  El pedido se envía por WhatsApp y{' '}
                  <strong className="font-semibold text-[var(--color-marino)]">
                    no queda confirmado
                  </strong>{' '}
                  hasta que te respondamos. Las tapas del mostrador no se piden por acá: se
                  eligen en la barra.
                </p>
              </div>
            )}
          </div>

          {/* Pie con el total */}
          {items.length > 0 && (
            <footer className="shrink-0 border-t-[1.5px] border-[var(--color-marino)]/12 bg-[var(--color-cal-hondo)] px-6 py-5 sm:px-8">
              <dl className="mb-4 space-y-1.5">
                {descuento > 0 && (
                  <>
                    <div className="flex justify-between text-[0.9rem] text-[var(--color-marino)]/60">
                      <dt>Subtotal</dt>
                      <dd className="precio">{pesos(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between text-[0.9rem] font-semibold text-[var(--color-teja)]">
                      <dt>Efectivo −{config.descuento_efectivo}%</dt>
                      <dd className="precio">−{pesos(descuento)}</dd>
                    </div>
                  </>
                )}
                <div className="flex items-baseline justify-between pt-1">
                  <dt className="text-[1.05rem] font-bold text-[var(--color-marino)]">Total</dt>
                  <dd className="precio text-[1.6rem] font-medium tracking-[-0.03em] text-[var(--color-marino)]">
                    {pesos(total)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={enviar}
                aria-disabled={!listo}
                className={`flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-[1rem] font-bold transition-all active:scale-[0.985] ${
                  listo
                    ? 'bg-[var(--color-cobalto)] text-[var(--color-cal)] hover:bg-[var(--color-marino)]'
                    : 'cursor-not-allowed bg-[var(--color-marino)]/15 text-[var(--color-marino)]/45'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.8 14.16c-.25.69-1.43 1.32-1.98 1.4-.53.08-1.19.11-1.92-.12-.44-.14-1.01-.33-1.74-.64-3.06-1.32-5.06-4.4-5.21-4.6-.15-.2-1.25-1.66-1.25-3.17s.79-2.25 1.07-2.56c.28-.31.61-.38.81-.38.2 0 .41 0 .58.01.19.01.44-.07.69.53.25.6.86 2.08.94 2.23.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.31.39-.45.53-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.28.1 1.75.83 2.05.98.3.15.5.23.57.35.08.13.08.72-.17 1.41z" />
                </svg>
                Enviar por WhatsApp
              </button>

              {intentado && !listo && (
                <p className="mt-3 text-center text-[0.85rem] font-semibold text-[var(--color-teja)]">
                  Completá tu nombre y teléfono para poder enviarlo.
                </p>
              )}
            </footer>
          )}
        </aside>
      </div>
    </>
  );
}

/* ── Piezas internas ──────────────────────────────────────────────────────── */

function Vacio({ alCerrar }: { alCerrar: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-16 text-center">
      <ManoBotella className="mb-8 h-36 w-auto text-[var(--color-cobalto)]/25" />
      <p className="text-[1.4rem] font-[800] tracking-[-0.03em] text-[var(--color-marino)]">
        Todavía no elegiste nada.
      </p>
      <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed text-[var(--color-marino)]/60">
        Volvé a la carta y tocá el <strong>+</strong> en lo que quieras llevarte. Los huevos
        rotos y las cañas quedan afuera: esos hay que comerlos acá.
      </p>
      <button
        type="button"
        onClick={alCerrar}
        className="mt-8 rounded-full border-[1.5px] border-[var(--color-marino)]/22 px-6 py-3 text-[0.95rem] font-bold text-[var(--color-marino)] transition-colors hover:border-[var(--color-cobalto)] hover:text-[var(--color-cobalto)]"
      >
        Ver la carta
      </button>
    </div>
  );
}

function BotonCantidad({
  children,
  etiqueta,
  onClick,
}: {
  children: React.ReactNode;
  etiqueta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiqueta}
      className="grid h-8 w-8 place-items-center rounded-full text-[var(--color-marino)] transition-colors hover:bg-[var(--color-cobalto)]/10"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
        {children}
      </svg>
    </button>
  );
}

function Campo({
  etiqueta,
  valor,
  alCambiar,
  error,
  ...resto
}: {
  etiqueta: string;
  valor: string;
  alCambiar: (v: string) => void;
  error: string | null;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `campo-${etiqueta.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="etiqueta mb-2 block text-[var(--color-marino)]/70">
        {etiqueta}
      </label>
      <input
        id={id}
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border-[1.5px] bg-transparent px-4 py-3 text-[0.95rem] text-[var(--color-marino)] outline-none transition-colors placeholder:text-[var(--color-marino)]/30 ${
          error
            ? 'border-[var(--color-teja)]'
            : 'border-[var(--color-marino)]/18 focus:border-[var(--color-cobalto)]'
        }`}
        {...resto}
      />
      {error && <p className="mt-1.5 text-[0.8rem] font-semibold text-[var(--color-teja)]">{error}</p>}
    </div>
  );
}

function Selector({
  etiqueta,
  opciones,
  valor,
  alElegir,
}: {
  etiqueta: string;
  opciones: { valor: string; texto: string }[];
  valor: string;
  alElegir: (v: string) => void;
}) {
  return (
    <div className="min-w-0">
      <p className="etiqueta mb-2.5 text-[var(--color-marino)]/70">{etiqueta}</p>
      <div className="sin-scroll -mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-1">
        {opciones.map((o) => (
          <button
            key={o.valor}
            type="button"
            onClick={() => alElegir(o.valor)}
            className={`shrink-0 rounded-full border-[1.5px] px-4 py-2.5 text-[0.88rem] font-semibold whitespace-nowrap transition-all ${
              valor === o.valor
                ? 'border-transparent bg-[var(--color-cobalto)] text-[var(--color-cal)]'
                : 'border-[var(--color-marino)]/18 text-[var(--color-marino)]/70 hover:border-[var(--color-cobalto)]'
            }`}
          >
            {o.texto}
          </button>
        ))}
      </div>
    </div>
  );
}
