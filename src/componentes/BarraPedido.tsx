'use client';

import { pesos } from '@/lib/formato';
import { usePedido } from './PedidoContexto';

/** Barra flotante en mobile: el pedido siempre a un toque de distancia. */
export function BarraPedido() {
  const { cantidadTotal, subtotal, abrirPanel, panelAbierto } = usePedido();

  const visible = cantidadTotal > 0 && !panelAbierto;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 p-4 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <button
        type="button"
        onClick={abrirPanel}
        tabIndex={visible ? 0 : -1}
        className="flex w-full items-center justify-between gap-4 rounded-full bg-[var(--color-cobalto)] px-6 py-4 text-[var(--color-cal)] shadow-[0_8px_30px_rgba(16,31,71,0.28)] active:scale-[0.985]"
      >
        <span className="flex items-center gap-2.5">
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[var(--color-teja)] px-1.5 text-[0.75rem] font-bold">
            {cantidadTotal}
          </span>
          <span className="text-[0.95rem] font-bold">Ver mi pedido</span>
        </span>
        <span className="precio text-[1rem] font-medium">{pesos(subtotal)}</span>
      </button>
    </div>
  );
}
