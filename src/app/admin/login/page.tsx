'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Marca } from '@/componentes/Marca';
import { supabaseNavegador } from '@/lib/supabase/cliente';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const supabase = supabaseNavegador();
    if (!supabase) {
      setError('Supabase todavía no está configurado. Revisá el archivo .env.local.');
      return;
    }

    setCargando(true);
    const { error: fallo } = await supabase.auth.signInWithPassword({ email, password: clave });
    setCargando(false);

    if (fallo) {
      setError('Email o contraseña incorrectos.');
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Marca className="text-[2.25rem]" />
        <p className="etiqueta mt-2 text-[var(--color-humo)]">Panel del local</p>

        <form onSubmit={entrar} className="mt-10 space-y-4">
          <div>
            <label htmlFor="email" className="etiqueta mb-2 block text-[var(--color-marino)]/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-[1.5px] border-[var(--color-marino)]/18 bg-transparent px-4 py-3 text-[0.95rem] outline-none transition-colors focus:border-[var(--color-cobalto)]"
            />
          </div>

          <div>
            <label htmlFor="clave" className="etiqueta mb-2 block text-[var(--color-marino)]/70">
              Contraseña
            </label>
            <input
              id="clave"
              type="password"
              required
              autoComplete="current-password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="w-full rounded-xl border-[1.5px] border-[var(--color-marino)]/18 bg-transparent px-4 py-3 text-[0.95rem] outline-none transition-colors focus:border-[var(--color-cobalto)]"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-[var(--color-teja)]/10 px-4 py-3 text-[0.88rem] font-semibold text-[var(--color-teja)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-full bg-[var(--color-cobalto)] px-6 py-4 text-[1rem] font-bold text-[var(--color-cal)] transition-colors hover:bg-[var(--color-marino)] disabled:opacity-50"
          >
            {cargando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <a
          href="/"
          className="mt-8 inline-block text-[0.88rem] font-semibold text-[var(--color-marino)]/50 transition-colors hover:text-[var(--color-cobalto)]"
        >
          ← Volver al sitio
        </a>
      </div>
    </main>
  );
}
