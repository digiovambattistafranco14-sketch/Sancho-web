import type { Config } from '@/lib/types';
import { Marca } from './Marca';

export function Pie({ config }: { config: Config }) {
  return (
    <footer className="border-t-[1.5px] border-[var(--color-marino)]/12 py-12">
      <div className="contenedor flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Marca className="text-[1.6rem]" />
          <p className="mt-2 text-[0.9rem] text-[var(--color-marino)]/55">
            Tapas y barra · City Bell
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9rem] font-semibold text-[var(--color-marino)]/70">
          <a href="#carta" className="transition-colors hover:text-[var(--color-cobalto)]">
            Carta
          </a>
          <a href="#visitanos" className="transition-colors hover:text-[var(--color-cobalto)]">
            Dónde estamos
          </a>
          <a
            href={config.instagram}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-[var(--color-cobalto)]"
          >
            Instagram
          </a>
          <a
            href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-[var(--color-cobalto)]"
          >
            WhatsApp
          </a>
        </nav>
      </div>

      <div className="contenedor mt-10 border-t border-[var(--color-marino)]/10 pt-6">
        <p className="text-[0.8rem] text-[var(--color-marino)]/40">
          © {new Date().getFullYear()} Sancho · {config.direccion}. Beber con moderación.
          Prohibida la venta de alcohol a menores de 18 años.
        </p>
      </div>
    </footer>
  );
}
