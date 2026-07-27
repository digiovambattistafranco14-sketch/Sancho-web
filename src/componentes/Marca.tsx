/** Logotipo: reproduce las letras corpóreas cobalto del frente del local. */
export function Marca({
  className = '',
  color = 'var(--color-cobalto)',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <span
      className={`inline-block font-[family-name:var(--font-display)] font-[900] tracking-[-0.055em] leading-none ${className}`}
      style={{ color }}
    >
      Sancho
    </span>
  );
}
