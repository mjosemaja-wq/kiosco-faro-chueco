import { MARGEN_SOBRE_IDEAL } from "../config.js";

export const ESTADOS = {
  AGOTADO: "Agotado",
  REPONER: "Reponer",
  DISPONIBLE: "Disponible",
};

/* Agotado prevalece sobre Reponer. */
export function estado(p) {
  if (p.stock <= 0) return ESTADOS.AGOTADO;
  if (p.stock <= p.minimo) return ESTADOS.REPONER;
  return ESTADOS.DISPONIBLE;
}

/* Cantidad a comprar: ideal menos stock, nunca negativa. Ej.: ideal 12, stock 3 → 9. */
export function sugerencia(p) {
  return Math.max(0, p.ideal - p.stock);
}

export function tope(p) {
  return p.ideal + MARGEN_SOBRE_IDEAL;
}

export function puedeVender(p) {
  return p.stock > 0;
}

export function puedeDevolver(p) {
  return p.stock < tope(p);
}

function cambiar(productos, id, fn) {
  return productos.map((p) => (p.id === id ? fn(p) : p));
}

export function vender(productos, id) {
  return cambiar(productos, id, (p) => (puedeVender(p) ? { ...p, stock: p.stock - 1 } : p));
}

export function devolver(productos, id) {
  return cambiar(productos, id, (p) => (puedeDevolver(p) ? { ...p, stock: p.stock + 1 } : p));
}

export function necesitaReponer(p) {
  return p.stock <= p.minimo;
}

/* Lista del panel: agotados primero, después por nombre. */
export function paraReponer(productos) {
  return productos
    .filter(necesitaReponer)
    .sort(
      (a, b) =>
        Number(a.stock > 0) - Number(b.stock > 0) || a.nombre.localeCompare(b.nombre, "es")
    );
}

/* «Reponer todo»: lleva cada producto de la lista a su cantidad ideal. */
export function reponerTodo(productos) {
  return productos.map((p) => (necesitaReponer(p) ? { ...p, stock: p.ideal } : p));
}
