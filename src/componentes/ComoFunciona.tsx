import type { Config } from '@/lib/types';
import { Revelar } from './Revelar';
import { Asterisco, Porron } from './Trazos';

const PASOS = [
  {
    titulo: 'Caés',
    texto: 'No hay reserva ni lista de espera. Si hay lugar, es tuyo; si no, la barra siempre tiene un hueco.',
  },
  {
    titulo: 'Pedís en la barra',
    texto: 'Mirás el mostrador, señalás lo que te gusta, pedís las cañas y las llevás vos a la mesa.',
  },
  {
    titulo: 'Te dan un bipper',
    texto: 'Suena cuando lo tuyo está listo. Mientras tanto, no tenés que mirar a la cocina.',
  },
  {
    titulo: 'Te sentás donde quieras',
    texto: 'Barra alta, salón, la vereda o el patio de atrás con estufas. Nadie te asigna nada.',
  },
];

export function ComoFunciona({ config }: { config: Config }) {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="contenedor">
        <Revelar className="mb-16 max-w-2xl">
          <p className="etiqueta mb-6 flex items-center gap-2.5 text-[var(--color-teja)]">
            <Asterisco className="h-3 w-3" />
            Cómo funciona
          </p>
          <h2 className="titular-seccion text-[var(--color-marino)]">
            Cuatro pasos y
            <br />
            <span className="subrayado">ninguna regla más.</span>
          </h2>
        </Revelar>

        {/* Lista escalonada: cada paso se corre un poco a la derecha */}
        <ol className="space-y-0 border-t-[1.5px] border-[var(--color-marino)]/12">
          {PASOS.map((paso, i) => (
            <Revelar
              como="li"
              key={paso.titulo}
              retraso={(Math.min(i + 1, 4) as 1 | 2 | 3 | 4)}
              className="group grid gap-x-8 gap-y-3 border-b-[1.5px] border-[var(--color-marino)]/12 py-8 transition-colors hover:bg-[var(--color-cobalto)]/4 sm:grid-cols-12 sm:py-10"
            >
              <span
                className="precio text-[0.85rem] text-[var(--color-cobalto)]/60 sm:col-span-1"
                style={{ paddingLeft: `${i * 0.5}rem` }}
              >
                0{i + 1}
              </span>
              <h3 className="text-[1.6rem] font-[800] leading-none tracking-[-0.03em] text-[var(--color-marino)] sm:col-span-4 sm:text-[2rem]">
                {paso.titulo}
              </h3>
              <p className="max-w-xl text-[1rem] leading-relaxed text-[var(--color-marino)]/68 sm:col-span-7">
                {paso.texto}
              </p>
            </Revelar>
          ))}
        </ol>

        {/* Happy hour */}
        <Revelar className="relative mt-16 grid items-center gap-8 overflow-hidden rounded-[2rem] bg-[var(--color-teja)] px-8 py-12 text-[var(--color-cal)] sm:grid-cols-12 sm:px-14 sm:py-14">
          <Porron className="pointer-events-none absolute -bottom-8 right-6 hidden h-52 w-auto text-[var(--color-cal)]/18 sm:block" />

          <div className="sm:col-span-8">
            <p className="etiqueta mb-5 text-[var(--color-cal)]/75">Happy hour</p>
            <h3 className="text-[clamp(2rem,5vw,3.25rem)] font-[800] leading-[0.95] tracking-[-0.035em]">
              {config.happy_hour}
            </h3>
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-[var(--color-cal)]/80">
              Llegar temprano tiene premio. Y si pagás en efectivo, un{' '}
              <strong className="font-semibold text-[var(--color-cal)]">
                {config.descuento_efectivo}% menos
              </strong>{' '}
              en toda la cuenta.
            </p>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
