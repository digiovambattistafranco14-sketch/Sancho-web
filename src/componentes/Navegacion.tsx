'use client';

import { useEffect, useState } from 'react';
import { Marca } from './Marca';
import { usePedido } from './PedidoContexto';
import type { Config } from '@/lib/types';
import { estadoDelLocal } from '@/lib/formato';

const ENLACES = [
  { href: '#carta', texto: 'Carta' },
  { href: '#mostrador', texto: 'Mostrador' },
  { href: '#jueves', texto: 'Jueves' },
  { href: '#visitanos', texto: 'Dónde' },
];

export function Navegacion({ config }: { config: Config }) {
  const { cantidadTotal, abrirPanel } = usePedido();
  const [compacta, setCompacta] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [estado, setEstado] = useState<string | null>(null);

  useEffect(() => {
    const alScrollear = () => setCompacta(window.scrollY > 80);
    alScrollear();
    window.addEventListener('scroll', alScrollear, { passive: true });
    return () => window.removeEventListener('scroll', alScrollear);
  }, []);

  // Se calcula en el cliente para no romper la hidratación con la hora del servidor.
  useEffect(() => {
    setEstado(estadoDelLocal(config.dias_abiertos).texto);
  }, [config.dias_abiertos]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          compacta
            ? 'bg-[var(--color-cal)]/92 backdrop-blur-md shadow-[0_1px_0_rgba(16,31,71,0.12)]'
            : 'bg-transparent'
        }`}
      >
        <nav className="contenedor flex items-center justify-between gap-6 py-4">
          <a href="#top" className="flex items-baseline gap-2.5" aria-label="Sancho, inicio">
            <Marca className={compacta ? 'text-[1.55rem]' : 'text-[1.8rem]'} />
            {estado && (
              <span className="hidden items-center gap-1.5 etiqueta text-[var(--color-humo)] sm:flex">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    estado.includes('Abierto') || estado.includes('Happy')
                      ? 'bg-[var(--color-teja)] pulso'
                      : 'bg-[var(--color-humo)]/50'
                  }`}
                />
                {estado}
              </span>
            )}
          </a>

          <div className="flex items-center gap-1.5">
            <ul className="hidden items-center gap-1 md:flex">
              {ENLACES.map((e) => (
                <li key={e.href}>
                  <a
                    href={e.href}
                    className="rounded-full px-3.5 py-2 text-[0.9rem] font-semibold text-[var(--color-marino)] transition-colors hover:bg-[var(--color-cobalto)]/8 hover:text-[var(--color-cobalto)]"
                  >
                    {e.texto}
                  </a>
                </li>
              ))}
            </ul>

            {config.take_away_activo && (
              <button
                type="button"
                onClick={abrirPanel}
                className="group relative flex items-center gap-2 rounded-full bg-[var(--color-cobalto)] px-4 py-2.5 text-[0.9rem] font-bold text-[var(--color-cal)] transition-all hover:bg-[var(--color-marino)] active:scale-[0.97] sm:px-5"
              >
                <span className="hidden sm:inline">Mi pedido</span>
                <span className="sm:hidden">Pedido</span>
                <span
                  className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.7rem] font-bold transition-colors ${
                    cantidadTotal > 0
                      ? 'bg-[var(--color-teja)] text-white'
                      : 'bg-white/20 text-[var(--color-cal)]'
                  }`}
                >
                  {cantidadTotal}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setMenuAbierto((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full text-[var(--color-marino)] transition-colors hover:bg-[var(--color-cobalto)]/10 md:hidden"
              aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuAbierto}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                {menuAbierto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {menuAbierto && (
        <div className="fixed inset-0 z-40 bg-[var(--color-cal)] pt-24 md:hidden">
          <ul className="contenedor flex flex-col gap-1">
            {ENLACES.map((e) => (
              <li key={e.href}>
                <a
                  href={e.href}
                  onClick={() => setMenuAbierto(false)}
                  className="block border-b border-[var(--color-marino)]/10 py-5 text-[2rem] font-[800] tracking-[-0.03em] text-[var(--color-marino)]"
                >
                  {e.texto}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
