const DIAS = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
] as const;

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

export function pesos(valor: number): string {
  return '$' + valor.toLocaleString('es-AR', { maximumFractionDigits: 0 });
}

export function fechaLarga(fecha: Date): string {
  return `${DIAS[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]}`;
}

export function nombreDia(indice: number): string {
  return DIAS[indice] ?? '';
}

/** Los días que abre Sancho, empezando por hoy. Devuelve los próximos 7. */
export function proximosDiasAbiertos(diasAbiertos: number[], cuantos = 5) {
  const salida: { valor: string; etiqueta: string; fecha: Date }[] = [];
  const hoy = new Date();

  for (let i = 0; i < 14 && salida.length < cuantos; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    if (!diasAbiertos.includes(fecha.getDay())) continue;

    const etiqueta = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : fechaLarga(fecha);
    salida.push({
      valor: fecha.toISOString().slice(0, 10),
      etiqueta: etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1),
      fecha,
    });
  }

  return salida;
}

export type EstadoLocal = {
  abierto: boolean;
  enHappyHour: boolean;
  texto: string;
};

/** Estado en vivo: abierto / cerrado / en happy hour. Horario 18–00. */
export function estadoDelLocal(diasAbiertos: number[], ahora = new Date()): EstadoLocal {
  const dia = ahora.getDay();
  const hora = ahora.getHours();
  const abiertoHoy = diasAbiertos.includes(dia);
  const abierto = abiertoHoy && hora >= 18;
  const enHappyHour = abierto && hora >= 18 && hora < 20;

  if (enHappyHour) return { abierto, enHappyHour, texto: 'Happy hour, ahora mismo' };
  if (abierto) return { abierto, enHappyHour, texto: 'Abierto ahora' };
  if (abiertoHoy) return { abierto, enHappyHour, texto: 'Hoy abrimos a las 18' };

  const siguiente = proximosDiasAbiertos(diasAbiertos, 1)[0];
  return {
    abierto: false,
    enHappyHour: false,
    texto: siguiente ? `Volvemos el ${siguiente.etiqueta.toLowerCase()}` : 'Cerrado',
  };
}
