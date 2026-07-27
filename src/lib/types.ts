export type Categoria = {
  id: string;
  slug: string;
  nombre: string;
  bajada: string | null;
  /** Precio único para toda la categoría (Tapas $4.500, Bocattas $12.000). */
  precio_fijo: number | null;
  grupo: 'cocina' | 'barra';
  orden: number;
  activa: boolean;
};

export type Producto = {
  id: string;
  categoria_slug: string;
  nombre: string;
  detalle: string | null;
  precio: number;
  orden: number;
  /** Se marca desde el panel cuando se agota en el día. */
  disponible: boolean;
  /** Si no viaja bien, no aparece en el armador de pedido. */
  take_away: boolean;
  vegetariano: boolean;
  sin_gluten: boolean;
};

/** Las tapas del mostrador cambian a diario: se cargan sueltas desde el panel. */
export type TapaDelDia = {
  id: string;
  nombre: string;
  orden: number;
};

export type Config = {
  whatsapp: string;
  direccion: string;
  como_llegar: string;
  horarios: string;
  dias_abiertos: number[];
  happy_hour: string;
  descuento_efectivo: number;
  alias: string | null;
  titular: string | null;
  aviso: string | null;
  take_away_activo: boolean;
  instagram: string;
  maps_url: string;
};

export type ItemPedido = {
  producto_id: string;
  nombre: string;
  detalle: string | null;
  precio: number;
  cantidad: number;
};
