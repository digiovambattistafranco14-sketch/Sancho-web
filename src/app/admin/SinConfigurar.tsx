import { Marca } from '@/componentes/Marca';

export function SinConfigurar({ mensaje }: { mensaje?: string }) {
  return (
    <main className="contenedor-angosto py-24">
      <Marca className="text-[2.25rem]" />
      <h1 className="titular-seccion mt-6 text-[var(--color-marino)]">
        Falta conectar
        <br />
        <span className="subrayado">Supabase.</span>
      </h1>

      {mensaje && (
        <p className="mt-8 rounded-xl bg-[var(--color-teja)]/10 px-5 py-4 text-[0.95rem] font-semibold text-[var(--color-teja)]">
          {mensaje}
        </p>
      )}

      <ol className="mt-10 space-y-6 text-[1rem] leading-relaxed text-[var(--color-marino)]/78">
        <li>
          <strong className="font-semibold text-[var(--color-marino)]">1.</strong> Creá un
          proyecto gratis en{' '}
          <a
            className="font-semibold text-[var(--color-cobalto)] underline underline-offset-4"
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer noopener"
          >
            supabase.com
          </a>
          .
        </li>
        <li>
          <strong className="font-semibold text-[var(--color-marino)]">2.</strong> En{' '}
          <em>SQL Editor</em>, pegá y ejecutá el archivo{' '}
          <code className="rounded bg-[var(--color-marino)]/8 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[0.85rem]">
            supabase/esquema.sql
          </code>{' '}
          del proyecto.
        </li>
        <li>
          <strong className="font-semibold text-[var(--color-marino)]">3.</strong> Copiá el{' '}
          <em>Project URL</em> y la <em>anon key</em> desde{' '}
          <em>Project Settings → API</em> a un archivo{' '}
          <code className="rounded bg-[var(--color-marino)]/8 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[0.85rem]">
            .env.local
          </code>
          .
        </li>
        <li>
          <strong className="font-semibold text-[var(--color-marino)]">4.</strong> En{' '}
          <em>Authentication → Users</em>, creá tu usuario con email y contraseña.
        </li>
      </ol>

      <p className="mt-10 rounded-xl bg-[var(--color-cobalto)]/8 px-5 py-4 text-[0.92rem] leading-relaxed text-[var(--color-marino)]/75">
        Mientras tanto el sitio público funciona igual: sirve la carta que está en{' '}
        <code className="font-[family-name:var(--font-mono)] text-[0.85rem]">
          src/lib/datos-base.ts
        </code>
        .
      </p>

      <a
        href="/"
        className="mt-10 inline-block text-[0.9rem] font-semibold text-[var(--color-marino)]/50 transition-colors hover:text-[var(--color-cobalto)]"
      >
        ← Volver al sitio
      </a>
    </main>
  );
}
