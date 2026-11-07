import { cargarCarta } from '@/lib/carta';
import { BarraPedido } from '@/componentes/BarraPedido';
import { Carta } from '@/componentes/Carta';
import { ComoFunciona } from '@/componentes/ComoFunciona';
import { Historia } from '@/componentes/Historia';
import { Jueves } from '@/componentes/Jueves';
import { Marquesina } from '@/componentes/Marquesina';
import { Mostrador } from '@/componentes/Mostrador';
import { Navegacion } from '@/componentes/Navegacion';
import { PanelPedido } from '@/componentes/PanelPedido';
import { ProveedorPedido } from '@/componentes/PedidoContexto';
import { Pie } from '@/componentes/Pie';
import { Portada } from '@/componentes/Portada';
import { Visitanos } from '@/componentes/Visitanos';

// Página estática (ISR): se sirve desde caché, sin consultar Supabase en cada visita.
// El panel la regenera al instante al guardar (ver admin/acciones.ts); esto es
// solo una red de seguridad por si algún cambio se hace directo en Supabase.
export const revalidate = 300;

export default async function Inicio() {
  const { categorias, productos, tapas, config, precioTapa } = await cargarCarta();
  const paella = productos.find((p) => p.categoria_slug === 'especial') ?? null;

  return (
    <ProveedorPedido>
      <Navegacion config={config} />

      <main>
        {config.aviso && (
          <div className="bg-[var(--color-teja)] px-4 py-2.5 text-center text-[0.9rem] font-semibold text-[var(--color-cal)]">
            {config.aviso}
          </div>
        )}

        <Portada config={config} />
        <Marquesina />
        <Historia />
        <Carta
          categorias={categorias}
          productos={productos}
          takeAwayActivo={config.take_away_activo}
        />
        <Mostrador tapas={tapas} precio={precioTapa} />
        <Jueves paella={paella} />
        <ComoFunciona config={config} />
        <Visitanos config={config} />
      </main>

      <Pie config={config} />

      <PanelPedido config={config} />
      <BarraPedido />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Restaurant',
            name: 'Sancho — Tapas y Barra',
            servesCuisine: 'Española',
            priceRange: '$$',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Diag. 3 (Jorge Bell) 375',
              addressLocality: 'City Bell',
              addressRegion: 'Buenos Aires',
              addressCountry: 'AR',
            },
            telephone: `+${config.whatsapp}`,
            openingHours: 'We-Su 18:00-00:00',
            sameAs: [config.instagram],
          }),
        }}
      />
    </ProveedorPedido>
  );
}
