'use client';

import { usePedido } from './PedidoContexto';
import { Asterisco, ManoCopa, Onda } from './Trazos';
import type { Config } from '@/lib/types';

export function Portada({ config }: { config: Config }) {
  const { abrirPanel } = usePedido();

  return (
    <section id="top" className="relative overflow-hidden textura-cal pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Trazo de fondo: la onda que cruza su carta impresa */}
      <Onda
        className="pointer-events-none absolute -top-2 left-0 h-16 w-[140%] text-[var(--color-cobalto)]/12"
        ancho={3}
      />

      <div className="contenedor">
        {/* Grilla asimétrica: 7 / 5, el texto no arranca en el margen */}
        <div className="grid items-end gap-x-10 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:col-start-1">
            <p className="etiqueta mb-8 flex items-center gap-2.5 text-[var(--color-teja)]">
              <Asterisco className="h-3 w-3" />
              City Bell · Diagonal Jorge Bell
            </p>

            <h1 className="titular text-[var(--color-marino)]">
              <span className="block">
                <span className="editorial font-normal italic tracking-[-0.02em] text-[var(--color-cobalto)]">
                  Quijote
                </span>{' '}
                soñaba.
              </span>
              <span className="mt-1 block sm:mt-2">
                <span className="subrayado subrayado-teja">Sancho comía.</span>
              </span>
            </h1>

            <p className="mt-9 max-w-[30rem] text-[1.075rem] leading-[1.6] text-[var(--color-marino)]/80 sm:text-[1.2rem]">
              El primer bar de tapas de City Bell. Barra alta, cañas en porrón y platitos
              que van cambiando según lo que haya ese día. Pedís en la barra, te sentás
              donde quieras. Nada más.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {config.take_away_activo && (
                <button
                  type="button"
                  onClick={abrirPanel}
                  className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-cobalto)] px-7 py-4 text-[1rem] font-bold text-[var(--color-cal)] transition-all hover:bg-[var(--color-marino)] active:scale-[0.98]"
                >
                  Armar pedido para llevar
                  <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
                </button>
              )}
              <a
                href="#carta"
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[var(--color-marino)]/25 px-7 py-4 text-[1rem] font-bold text-[var(--color-marino)] transition-all hover:border-[var(--color-cobalto)] hover:text-[var(--color-cobalto)]"
              >
                Ver la carta
              </a>
            </div>
          </div>

          {/* Columna corta: la ilustración de mano + copa, su recurso de marca */}
          <div className="relative lg:col-span-4 lg:col-start-9">
            <ManoCopa className="ml-auto hidden h-64 w-auto text-[var(--color-cobalto)] lg:block" />
          </div>
        </div>

        {/* Franja de datos duros, alineada a la derecha para romper la simetría */}
        <dl className="mt-16 grid gap-px overflow-hidden rounded-2xl border-[1.5px] border-[var(--color-marino)]/12 bg-[var(--color-marino)]/12 sm:grid-cols-3 lg:ml-auto lg:mt-20 lg:w-[68%]">
          {[
            { t: 'Cuándo', d: config.horarios },
            { t: 'Happy hour', d: config.happy_hour },
            { t: 'Reservas', d: 'No hacen falta. Caés y listo.' },
          ].map((f) => (
            <div key={f.t} className="bg-[var(--color-cal)] px-6 py-5">
              <dt className="etiqueta text-[var(--color-humo)]">{f.t}</dt>
              <dd className="mt-2 text-[0.98rem] font-semibold leading-snug text-[var(--color-marino)]">
                {f.d}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
