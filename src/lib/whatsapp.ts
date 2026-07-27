import { fechaLarga, pesos } from './formato';
import type { Config, ItemPedido } from './types';

export type MedioDePago = 'efectivo' | 'transferencia' | 'tarjeta';

export type DatosPedido = {
  nombre: string;
  telefono: string;
  fecha: string; // YYYY-MM-DD
  horario: string; // "Lo antes posible" | "21:30"
  pago: MedioDePago;
  notas: string;
};

const ETIQUETA_PAGO: Record<MedioDePago, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  tarjeta: 'Tarjeta',
};

export function subtotalPedido(items: ItemPedido[]): number {
  return items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
}

export function descuentoPedido(items: ItemPedido[], pago: MedioDePago, porcentaje: number) {
  if (pago !== 'efectivo' || porcentaje <= 0) return 0;
  return Math.round((subtotalPedido(items) * porcentaje) / 100);
}

export function totalPedido(items: ItemPedido[], pago: MedioDePago, porcentaje: number) {
  return subtotalPedido(items) - descuentoPedido(items, pago, porcentaje);
}

const RAYA = '━━━━━━━━━━━━━━━';

/**
 * Arma el texto del pedido tal como llega al WhatsApp del local.
 * Formato pensado para leerse de un vistazo desde la barra, en el celular.
 */
export function armarMensaje(
  items: ItemPedido[],
  datos: DatosPedido,
  config: Config,
): string {
  const hoy = new Date().toISOString().slice(0, 10);
  const esHoy = datos.fecha === hoy;
  const fecha = new Date(`${datos.fecha}T12:00:00`);

  const subtotal = subtotalPedido(items);
  const descuento = descuentoPedido(items, datos.pago, config.descuento_efectivo);
  const total = subtotal - descuento;

  const lineas: string[] = [];

  lineas.push('✳️ *NUEVO PEDIDO — SANCHO*');
  lineas.push(esHoy ? '🔵🔵 *PARA HOY* 🔵🔵' : `📆 *PARA EL ${fechaLarga(fecha).toUpperCase()}*`);
  lineas.push(RAYA);

  lineas.push(`👤 *${datos.nombre.trim()}*`);
  lineas.push(`📞 ${datos.telefono.trim()}`);
  lineas.push(`📅 *${capitalizar(fechaLarga(fecha))}*`);
  lineas.push(`🕐 *${datos.horario}*`);
  lineas.push('📍 Retiro en el local');
  lineas.push(`💳 ${ETIQUETA_PAGO[datos.pago]}`);

  lineas.push(RAYA);
  lineas.push('*PEDIDO:*');
  for (const item of items) {
    const detalle = item.detalle ? ` _(${item.detalle})_` : '';
    lineas.push(`• ${item.cantidad} × ${item.nombre}${detalle}`);
  }

  if (datos.notas.trim()) {
    lineas.push('');
    lineas.push(`📝 *Nota:* ${datos.notas.trim()}`);
  }

  lineas.push(RAYA);
  if (descuento > 0) {
    lineas.push(`Subtotal: ${pesos(subtotal)}`);
    lineas.push(`Descuento efectivo (${config.descuento_efectivo}%): -${pesos(descuento)}`);
  }
  lineas.push(`💰 *Total: ${pesos(total)}*`);
  lineas.push(RAYA);

  if (datos.pago === 'transferencia' && config.alias) {
    lineas.push('💳 *TRANSFERENCIA:*');
    lineas.push(`Alias: *${config.alias}*`);
    if (config.titular) lineas.push(`A nombre de: *${config.titular}*`);
    lineas.push('📲 Enviá el comprobante por acá para confirmar ✅');
    lineas.push(RAYA);
  }

  lineas.push('_Pedido enviado desde la web de Sancho._');
  lineas.push('_Esperá la confirmación antes de venir 🙌_');

  return lineas.join('\n');
}

export function enlaceWhatsApp(numero: string, mensaje: string): string {
  const limpio = numero.replace(/\D/g, '');
  return `https://wa.me/${limpio}?text=${encodeURIComponent(mensaje)}`;
}

function capitalizar(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
