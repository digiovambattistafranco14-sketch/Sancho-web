import { pesos } from '@/lib/formato';
import type { TapaDelDia } from '@/lib/types';
import { Revelar } from './Revelar';
import { Asterisco } from './Trazos';

/**
 * Las tapas del mostrador son el corazón de Sancho y lo único que no se puede
 * pedir por la web: hay que verlas. La sección lo dice sin disimular.
 */
export function Mostrador({ tapas, precio }: { tapas: TapaDelDia[]; precio: number }) {
  return (
    <section id="mostrador" className="relative overflow-hidden bg-[var(--color-cobalto)] py-24 text-[var(--color-cal)] sm:py-32">
      <div className="contenedor">
        <div className="grid gap-14 lg:grid-cols-12">
          <Revelar className="lg:col-span-5">
            <p className="etiqueta mb-7 flex items-center gap-2.5 text-[var(--color-cal)]/70">
              <Asterisco className="h-3 w-3" />
              El mostrador
            </p>

            <h2 className="titular-seccion text-[var(--color-cal)]">
              Hoy hay
              <br />
              <span className="editorial font-normal italic tracking-[-0.02em]">esto.</span>
              <br />
              Mañana,
              <br />
              <span className="subrayado subrayado-cal">quién sabe.</span>
            </h2>

            <p className="mt-8 max-w-sm text-[1.05rem] leading-relaxed text-[var(--color-cal)]/72">
              Las tapas se exhiben en la barra y cambian todos los días según lo que llegue.
              No las vas a encontrar en ninguna carta fija — y por eso tampoco se piden por
              acá. Venís, mirás y señalás.
            </p>

            <p className="precio mt-8 inline-flex items-baseline gap-2 rounded-full bg-[var(--color-cal)]/12 px-5 py-2.5">
              <span className="text-[1.35rem] font-medium">{pesos(precio)}</span>
              <span className="etiqueta text-[var(--color-cal)]/75">cada una</span>
            </p>
          </Revelar>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="etiqueta mb-6 text-[var(--color-cal)]/70">
              Lo que hubo esta semana
            </p>

            <ul className="space-y-0">
              {tapas.map((tapa, i) => (
                <Revelar
                  como="li"
                  key={tapa.id}
                  retraso={(Math.min(i, 4) as 0 | 1 | 2 | 3 | 4)}
                  className="flex items-baseline gap-5 border-b border-[var(--color-cal)]/18 py-5"
                >
                  <span className="precio shrink-0 text-[0.8rem] text-[var(--color-cal)]/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[1.15rem] font-semibold leading-snug tracking-[-0.015em] sm:text-[1.35rem]">
                    {tapa.nombre}
                  </span>
                </Revelar>
              ))}
            </ul>

            <p className="mt-7 text-[0.9rem] italic text-[var(--color-cal)]/50">
              Van cambiando ;)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
