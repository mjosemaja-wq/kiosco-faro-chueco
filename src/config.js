/*
  Configuración del kiosco.

  CLAVE DEL PANEL: para cambiarla, editá PANEL_KEY, guardá y volvé a desplegar
  (en Vercel alcanza con hacer push a la rama principal). Ver README.
  Es una clave compartida que se controla en el navegador: no hay cuentas,
  ni alta de usuarios, ni recuperación de acceso.
*/
export const PANEL_KEY = "faro2026";

/* Clave propia de esta app en localStorage. No la cambies salvo que quieras empezar de cero. */
export const STORAGE_KEY = "faro-chueco-kiosco-v1";

/* Categorías fijas del encargo. */
export const CATEGORIAS = ["Bebidas", "Almacén", "Viaje", "Alquiler"];

/* «Devolvieron 1» nunca deja el stock por encima de la cantidad ideal más este margen. */
export const MARGEN_SOBRE_IDEAL = 10;

export const HORARIO = {
  recepcion: "de 8:00 a 23:00",
  compras: "lunes y jueves a la mañana",
};

export const NOMBRE_NEGOCIO = "Kiosco del Faro Chueco";
