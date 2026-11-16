import { NOMBRE_NEGOCIO } from "../config.js";
import { paraReponer, sugerencia } from "./stock.js";

/* Arma el texto de la lista de compras: cada producto a reponer con su cantidad. */
export function mensajeReposicion(productos, fecha = new Date()) {
  const lista = paraReponer(productos);
  const dia = fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "numeric" });
  const lineas = lista.map((p) => `• ${p.nombre}: ${sugerencia(p)}`);
  return [`Compras ${NOMBRE_NEGOCIO} (${dia})`, "", ...lineas].join("\n");
}

export function enlaceWhatsApp(texto) {
  return "https://wa.me/?text=" + encodeURIComponent(texto);
}

export function formatoPrecio(n) {
  return "$ " + Number(n).toLocaleString("es-UY");
}
