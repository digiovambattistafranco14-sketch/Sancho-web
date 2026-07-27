/**
 * Ilustraciones de línea continua — el recurso gráfico propio de Sancho:
 * manos sosteniendo copas, el asterisco y las ondas que atraviesan su carta.
 */

type Props = { className?: string; color?: string; ancho?: number };

export function Asterisco({ className = '', color = 'currentColor', ancho = 2.6 }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <g stroke={color} strokeWidth={ancho} strokeLinecap="round">
        <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
      </g>
    </svg>
  );
}

export function Onda({ className = '', color = 'currentColor', ancho = 2 }: Props) {
  return (
    <svg viewBox="0 0 400 24" fill="none" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d="M0 14C36 2 72 2 108 14s72 12 108 0 72-12 108 0 40 10 76 4"
        stroke={color}
        strokeWidth={ancho}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Mano sosteniendo una copa de cóctel. */
export function ManoCopa({ className = '', color = 'currentColor', ancho = 2.4 }: Props) {
  return (
    <svg viewBox="0 0 120 140" fill="none" className={className} aria-hidden="true">
      <g stroke={color} strokeWidth={ancho} strokeLinecap="round" strokeLinejoin="round">
        {/* copa */}
        <path d="M30 14h76L68 62 30 14Z" />
        <path d="M39 23h58" opacity="0.5" />
        <path d="M68 62v70" />
        <path d="M52 138h32" />
        {/* pulgar apoyado sobre el tallo */}
        <path d="M54 68c5-3 11-3 16 0" opacity="0.85" />
        {/* dedos que envuelven el tallo, entrando desde la izquierda */}
        <path d="M30 76h48a7 7 0 010 14H30a7 7 0 010-14Z" />
        <path d="M30 95h42a7 7 0 010 14H30a7 7 0 010-14Z" />
        <path d="M34 114h32a6 6 0 010 12H34a6 6 0 010-12Z" />
        {/* canto de la mano */}
        <path d="M30 76c-9 3-14 11-14 21v13c0 12 8 20 18 21" />
      </g>
    </svg>
  );
}

/** Mano sosteniendo una botella — el gesto de servir. */
export function ManoBotella({ className = '', color = 'currentColor', ancho = 2.4 }: Props) {
  return (
    <svg viewBox="0 0 120 140" fill="none" className={className} aria-hidden="true">
      <g stroke={color} strokeWidth={ancho} strokeLinecap="round" strokeLinejoin="round">
        <path d="M52 10h16v20c0 6 10 12 10 24v62c0 6-4 10-10 10H52c-6 0-10-4-10-10V54c0-12 10-18 10-24V10Z" />
        <path d="M42 64h36" opacity="0.5" />
        <path d="M52 20h16" opacity="0.5" />
        {/* dedos tomando el cuerpo de la botella */}
        <path d="M14 74h30a6 6 0 010 12H14a6 6 0 010-12Z" />
        <path d="M14 88h28a6 6 0 010 12H14a6 6 0 010-12Z" />
        <path d="M18 102h24a6 6 0 010 12H18a6 6 0 010-12Z" />
        <path d="M44 68c6-1 10-5 10-11" opacity="0.85" />
        <path d="M14 74c-8 3-13 10-13 19v8c0 11 6 19 15 21" />
      </g>
    </svg>
  );
}

/** Paella vista desde arriba, un solo trazo. */
export function Paella({ className = '', color = 'currentColor', ancho = 2.4 }: Props) {
  return (
    <svg viewBox="0 0 160 120" fill="none" className={className} aria-hidden="true">
      <g stroke={color} strokeWidth={ancho} strokeLinecap="round" strokeLinejoin="round">
        {/* paellera vista en escorzo */}
        <ellipse cx="80" cy="50" rx="54" ry="25" />
        <path d="M26 50c0 15 24 26 54 26s54-11 54-26" />
        {/* asas */}
        <path d="M26 50c-9-2-16-6-19-12M134 50c9-2 16-6 19-12" />
        {/* arroz y sofrito, en trazos cortos */}
        <path d="M54 44h20M80 38h18M60 56h26M96 52h14M72 62h20" opacity="0.55" />
      </g>
    </svg>
  );
}

/** Porrón de cerveza. */
export function Porron({ className = '', color = 'currentColor', ancho = 2.4 }: Props) {
  return (
    <svg viewBox="0 0 80 140" fill="none" className={className} aria-hidden="true">
      <g stroke={color} strokeWidth={ancho} strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 8h16v14c0 8 12 14 12 28v76c0 4-3 6-7 6H27c-4 0-7-2-7-6V50c0-14 12-20 12-28V8Z" />
        <path d="M20 58h40" />
        <path d="M20 74c8-4 16 4 24 0s12-4 16-2" opacity="0.6" />
      </g>
    </svg>
  );
}
