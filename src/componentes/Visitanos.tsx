import { nombreDia } from '@/lib/formato';
import type { Config } from '@/lib/types';
import { Marca } from './Marca';
import { Revelar } from './Revelar';
import { Asterisco, Onda } from './Trazos';

const ORDEN_SEMANA = [1, 2, 3, 4, 5, 6, 0];

export function Visitanos({ config }: { config: Config }) {
  return (
    <section
      id="visitanos"
      className="relative overflow-hidden bg-[var(--color-marino)] py-24 text-[var(--color-cal)] sm:py-32"
    >
      <Onda
        className="pointer-events-none absolute -bottom-3 left-0 h-20 w-[140%] text-[var(--color-cal)]/8"
        ancho={3}
      />

      <div className="contenedor relative">
        <div className="grid gap-16 lg:grid-cols-12">
          <Revelar className="lg:col-span-6">
            <p className="etiqueta mb-7 flex items-center gap-2.5 text-[var(--color-cal)]/70">
              <Asterisco className="h-3 w-3" />
              Dónde y cuándo
            </p>

            <h2 className="titular-seccion mb-10 text-[var(--color-cal)]">
              Estamos donde
              <br />
              <span className="subrayado subrayado-cal">siempre estuvimos.</span>
            </h2>

            <address className="not-italic">
              <p className="text-[1.35rem] font-semibold leading-snug tracking-[-0.02em] sm:text-[1.6rem]">
                {config.direccion}
              </p>
              <p className="mt-3 text-[1rem] leading-relaxed text-[var(--color-cal)]/62">
                {config.como_llegar}
              </p>
            </address>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={config.maps_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2.5 rounded-full bg-[var(--color-cal)] px-6 py-3.5 text-[0.95rem] font-bold text-[var(--color-marino)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Cómo llegar
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
              <a
                href={config.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-[var(--color-cal)]/28 px-6 py-3.5 text-[0.95rem] font-bold text-[var(--color-cal)] transition-colors hover:border-[var(--color-cal)]"
              >
                @sancho_cb
              </a>
            </div>
          </Revelar>

          <Revelar retraso={2} className="lg:col-span-5 lg:col-start-8">
            <p className="etiqueta mb-6 text-[var(--color-cal)]/70">Horarios</p>

            <ul className="border-t border-[var(--color-cal)]/18">
              {ORDEN_SEMANA.map((dia) => {
                const abierto = config.dias_abiertos.includes(dia);
                return (
                  <li
                    key={dia}
                    className="flex items-baseline justify-between gap-4 border-b border-[var(--color-cal)]/18 py-3.5"
                  >
                    <span
                      className={`text-[1.05rem] capitalize ${
                        abierto ? 'font-semibold' : 'text-[var(--color-cal)]/35'
                      }`}
                    >
                      {nombreDia(dia)}
                    </span>
                    <span
                      className={`precio text-[0.9rem] ${
                        abierto ? 'text-[var(--color-cal)]/80' : 'text-[var(--color-cal)]/30'
                      }`}
                    >
                      {abierto ? '18:00 — 00:00' : 'cerrado'}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-8 rounded-2xl bg-[var(--color-cal)]/8 px-6 py-5 text-[0.95rem] leading-relaxed text-[var(--color-cal)]/72">
              <strong className="font-semibold text-[var(--color-cal)]">Sin reserva.</strong>{' '}
              Nunca tomamos mesas por teléfono ni por Instagram: llegás, ves si hay lugar y te
              acomodás. La barra casi siempre tiene un hueco.
            </p>
          </Revelar>
        </div>

        <Revelar className="mt-24 flex justify-center">
          <Marca
            className="text-[clamp(4rem,20vw,14rem)] leading-none"
            color="rgba(250,247,241,0.09)"
          />
        </Revelar>
      </div>
    </section>
  );
}
