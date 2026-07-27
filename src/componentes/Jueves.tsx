import { pesos } from '@/lib/formato';
import type { Producto } from '@/lib/types';
import { Revelar } from './Revelar';
import { Paella } from './Trazos';

/** El jueves de paella: el gancho de recurrencia más fuerte que tienen. */
export function Jueves({ paella }: { paella: Producto | null }) {
  return (
    <section id="jueves" className="py-24 sm:py-32">
      <div className="contenedor">
        <Revelar className="relative overflow-hidden rounded-[2rem] border-[1.5px] border-[var(--color-marino)]/12 bg-[var(--color-cal-hondo)] px-7 py-14 sm:px-14 sm:py-20">
          <Paella className="pointer-events-none absolute right-6 top-1/2 hidden h-56 w-auto -translate-y-1/2 text-[var(--color-cobalto)]/20 lg:block xl:right-16 xl:h-72" />

          <div className="relative max-w-2xl">
            <p className="etiqueta mb-6 text-[var(--color-teja)]">Todos los jueves</p>

            <h2 className="titular-seccion text-[var(--color-marino)]">
              Se hace una paella
              <br />
              <span className="subrayado subrayado-teja">y se termina.</span>
            </h2>

            <p className="mt-8 text-[1.075rem] leading-relaxed text-[var(--color-marino)]/75 sm:text-[1.15rem]">
              Paella valenciana, una sola tanda, jueves de por medio no: todos. Cuando se
              acaba, se acabó. Si venís tarde probablemente la veas pasar en la mesa de al
              lado, y ahí ya es tarde.
            </p>

            {paella && (
              <p className="precio mt-9 inline-flex items-baseline gap-3 rounded-full bg-[var(--color-marino)] px-6 py-3 text-[var(--color-cal)]">
                <span className="text-[1.3rem] font-medium">{pesos(paella.precio)}</span>
                <span className="etiqueta text-[var(--color-cal)]/75">la ración</span>
              </p>
            )}
          </div>
        </Revelar>
      </div>
    </section>
  );
}
