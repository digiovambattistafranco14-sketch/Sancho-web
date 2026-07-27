'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ItemPedido, Producto } from '@/lib/types';

const CLAVE = 'sancho:pedido';

type Contexto = {
  items: ItemPedido[];
  cantidadTotal: number;
  subtotal: number;
  agregar: (producto: Pick<Producto, 'id' | 'nombre' | 'detalle' | 'precio'>) => void;
  quitar: (productoId: string) => void;
  fijar: (productoId: string, cantidad: number) => void;
  vaciar: () => void;
  cantidadDe: (productoId: string) => number;
  panelAbierto: boolean;
  abrirPanel: () => void;
  cerrarPanel: () => void;
};

const Ctx = createContext<Contexto | null>(null);

export function ProveedorPedido({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemPedido[]>([]);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [hidratado, setHidratado] = useState(false);

  // Recupera el pedido si el usuario recarga o vuelve más tarde.
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE);
      if (guardado) setItems(JSON.parse(guardado) as ItemPedido[]);
    } catch {
      /* localStorage bloqueado: seguimos en memoria */
    }
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch {
      /* sin persistencia, no es crítico */
    }
  }, [items, hidratado]);

  // Bloquea el scroll del fondo mientras el panel está abierto.
  useEffect(() => {
    document.body.style.overflow = panelAbierto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [panelAbierto]);

  const agregar: Contexto['agregar'] = useCallback((producto) => {
    setItems((previos) => {
      const existente = previos.find((i) => i.producto_id === producto.id);
      if (existente) {
        return previos.map((i) =>
          i.producto_id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i,
        );
      }
      return [
        ...previos,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          detalle: producto.detalle,
          precio: producto.precio,
          cantidad: 1,
        },
      ];
    });
  }, []);

  const fijar = useCallback((productoId: string, cantidad: number) => {
    setItems((previos) =>
      cantidad <= 0
        ? previos.filter((i) => i.producto_id !== productoId)
        : previos.map((i) => (i.producto_id === productoId ? { ...i, cantidad } : i)),
    );
  }, []);

  const quitar = useCallback((productoId: string) => {
    setItems((previos) => previos.filter((i) => i.producto_id !== productoId));
  }, []);

  const vaciar = useCallback(() => setItems([]), []);

  const valor = useMemo<Contexto>(
    () => ({
      items,
      cantidadTotal: items.reduce((s, i) => s + i.cantidad, 0),
      subtotal: items.reduce((s, i) => s + i.precio * i.cantidad, 0),
      agregar,
      quitar,
      fijar,
      vaciar,
      cantidadDe: (id) => items.find((i) => i.producto_id === id)?.cantidad ?? 0,
      panelAbierto,
      abrirPanel: () => setPanelAbierto(true),
      cerrarPanel: () => setPanelAbierto(false),
    }),
    [items, panelAbierto, agregar, quitar, fijar, vaciar],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function usePedido() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePedido debe usarse dentro de <ProveedorPedido>');
  return ctx;
}
