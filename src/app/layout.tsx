import type { Metadata, Viewport } from 'next';
import { DM_Mono, Figtree, Instrument_Serif } from 'next/font/google';
import './globals.css';

// Figtree es variable: sin `weight` baja un solo archivo con todos los pesos
// (antes eran cinco archivos, uno por peso).
const figtree = Figtree({
  subsets: ['latin'],
  variable: '--fuente-display',
  display: 'swap',
});

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--fuente-editorial',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--fuente-mono',
  display: 'swap',
  // Solo etiquetas y precios: no compite con la portada por la carga inicial.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sancho.com.ar'),
  title: 'Sancho · Tapas y barra en City Bell',
  description:
    'El primer bar de tapas de City Bell. Tapeo español, cañas y barra, de miércoles a domingo desde las 18. Sin reserva. Armá tu pedido y retiralo por el local.',
  keywords: [
    'Sancho City Bell',
    'bar de tapas City Bell',
    'tapas españolas La Plata',
    'take away City Bell',
    'paella City Bell',
  ],
  openGraph: {
    title: 'Sancho · Tapas y barra en City Bell',
    description:
      'Tapeo español, cañas y barra. Miércoles a domingo desde las 18. Sin reserva.',
    locale: 'es_AR',
    type: 'website',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#1b3fa8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${figtree.variable} ${instrument.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
