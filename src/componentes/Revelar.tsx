'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/**
 * Revela el contenido al entrar en viewport. Respeta prefers-reduced-motion
 * desde el CSS, así que acá no hace falta condicionar nada.
 */
export function Revelar({
  children,
  className = '',
  retraso = 0,
  como: Como = 'div',
}: {
  children: ReactNode;
  className?: string;
  retraso?: 0 | 1 | 2 | 3 | 4;
  como?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          nodo.classList.add('visible');
          observador.unobserve(nodo);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  const retrasoClase = retraso ? ` aparece-${retraso}` : '';

  return (
    <Como ref={ref} className={`aparece${retrasoClase} ${className}`}>
      {children}
    </Como>
  );
}
