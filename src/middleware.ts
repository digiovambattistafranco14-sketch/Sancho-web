import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieNueva = { name: string; value: string; options?: CookieOptions };

const URL_SB = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const KEY_SB = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export async function middleware(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  if (!URL_SB || !KEY_SB) return respuesta;

  const supabase = createServerClient(URL_SB, KEY_SB, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesNuevas: CookieNueva[]) {
        cookiesNuevas.forEach(({ name, value }) => request.cookies.set(name, value));
        respuesta = NextResponse.next({ request });
        cookiesNuevas.forEach(({ name, value, options }) =>
          respuesta.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ruta = request.nextUrl.pathname;

  if (ruta.startsWith('/admin') && ruta !== '/admin/login' && !user) {
    const destino = request.nextUrl.clone();
    destino.pathname = '/admin/login';
    return NextResponse.redirect(destino);
  }

  if (ruta === '/admin/login' && user) {
    const destino = request.nextUrl.clone();
    destino.pathname = '/admin';
    return NextResponse.redirect(destino);
  }

  return respuesta;
}

export const config = {
  matcher: ['/admin/:path*'],
};
