import { Asterisco } from './Trazos';

const FRASES = [
  'Tapas y barra',
  'Sin reserva',
  'Miércoles a domingo',
  'Paella los jueves',
  'Cañas en porrón',
  'Pedís en la barra',
  'City Bell',
];

/** Cinta cobalto que corta la página, como el toldo del frente. */
export function Marquesina() {
  const tanda = [...FRASES, ...FRASES];

  return (
    <div className="marquesina relative flex overflow-hidden bg-[var(--color-cobalto)] py-4 select-none">
      <div className="flex shrink-0 items-center gap-9 pr-9">
        {tanda.map((frase, i) => (
          <span key={i} className="flex shrink-0 items-center gap-9 whitespace-nowrap">
            <span className="text-[0.95rem] font-bold tracking-[-0.01em] text-[var(--color-cal)] sm:text-[1.05rem]">
              {frase}
            </span>
            <Asterisco className="h-3 w-3 shrink-0 text-[var(--color-cal)]/55" />
          </span>
        ))}
      </div>
      <div aria-hidden="true" className="flex shrink-0 items-center gap-9 pr-9">
        {tanda.map((frase, i) => (
          <span key={i} className="flex shrink-0 items-center gap-9 whitespace-nowrap">
            <span className="text-[0.95rem] font-bold tracking-[-0.01em] text-[var(--color-cal)] sm:text-[1.05rem]">
              {frase}
            </span>
            <Asterisco className="h-3 w-3 shrink-0 text-[var(--color-cal)]/55" />
          </span>
        ))}
      </div>
    </div>
  );
}
