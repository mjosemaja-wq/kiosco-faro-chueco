import { STORAGE_KEY } from "../config.js";
import { crearSemilla } from "./seed.js";

function almacenamiento() {
  try {
    return typeof window !== "undefined" ? window.localStorage : globalThis.localStorage;
  } catch {
    return undefined;
  }
}

/*
  Carga el catálogo.
  - Si la clave de esta app NO existe (primera visita): carga la semilla y la guarda.
  - Si existe, usa lo guardado aunque sea una lista vacía (una lista vacía no es una primera visita).
  - Si lo guardado está dañado, no lo pisa: avisa y deja restaurar desde el Panel.
  - Si localStorage no está disponible, trabaja en memoria y avisa.

  Devuelve { productos, aviso, puedeGuardar }.
*/
export function cargarProductos(store = almacenamiento()) {
  let raw;
  try {
    if (!store) throw new Error("sin localStorage");
    raw = store.getItem(STORAGE_KEY);
  } catch {
    return {
      productos: crearSemilla(),
      aviso: "Este navegador no deja guardar datos. Lo que cambies se pierde al recargar.",
      puedeGuardar: false,
    };
  }

  if (raw === null) {
    const semilla = crearSemilla();
    const ok = guardarProductos(semilla, store);
    return {
      productos: semilla,
      aviso: ok ? null : "No se pudieron guardar los datos de ejemplo en este navegador.",
      puedeGuardar: ok,
    };
  }

  try {
    const datos = JSON.parse(raw);
    if (!Array.isArray(datos)) throw new Error("formato inesperado");
    return { productos: datos.map(normalizar).filter(Boolean), aviso: null, puedeGuardar: true };
  } catch {
    return {
      productos: [],
      aviso: "Los datos guardados están dañados. Podés restaurar los de ejemplo desde el Panel.",
      puedeGuardar: true,
    };
  }
}

/* Guarda y devuelve true solo si localStorage aceptó la escritura. */
export function guardarProductos(productos, store = almacenamiento()) {
  try {
    if (!store) return false;
    store.setItem(STORAGE_KEY, JSON.stringify(productos));
    return true;
  } catch {
    return false;
  }
}

function entero(v, porDefecto = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : porDefecto;
}

function normalizar(p) {
  if (!p || typeof p !== "object" || typeof p.nombre !== "string") return null;
  return {
    id: String(p.id ?? crearId()),
    nombre: p.nombre,
    categoria: String(p.categoria ?? "Almacén"),
    precio: entero(p.precio),
    stock: entero(p.stock),
    minimo: entero(p.minimo),
    ideal: entero(p.ideal),
    visible: p.visible !== false,
  };
}

export function crearId() {
  return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
