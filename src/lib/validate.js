import { CATEGORIAS } from "../config.js";

/* Compara nombres sin importar mayúsculas, tildes ni espacios de más. */
export function claveNombre(nombre) {
  return String(nombre)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const CAMPOS_NUMERICOS = {
  precio: "El precio",
  stock: "El stock",
  minimo: "El stock mínimo",
  ideal: "La cantidad ideal",
};

/*
  Valida el borrador del formulario.
  Devuelve { ok, errores: { campo: mensaje }, producto } con los números ya convertidos.
*/
export function validarProducto(borrador, productos, idEditando = null) {
  const errores = {};
  const nombre = String(borrador.nombre ?? "").replace(/\s+/g, " ").trim();

  if (!nombre) {
    errores.nombre = "Poné un nombre.";
  } else if (
    productos.some((p) => p.id !== idEditando && claveNombre(p.nombre) === claveNombre(nombre))
  ) {
    errores.nombre = "Ya hay un producto con ese nombre.";
  }

  if (!CATEGORIAS.includes(borrador.categoria)) {
    errores.categoria = "Elegí una categoría.";
  }

  const numeros = {};
  for (const [campo, etiqueta] of Object.entries(CAMPOS_NUMERICOS)) {
    const texto = String(borrador[campo] ?? "").trim();
    const n = Number(texto);
    if (texto === "") errores[campo] = `${etiqueta} no puede quedar vacío.`;
    else if (!Number.isInteger(n) || n < 0) errores[campo] = `${etiqueta} va en números enteros, desde 0.`;
    else numeros[campo] = n;
  }

  if (!errores.ideal && !errores.minimo && numeros.ideal <= numeros.minimo) {
    errores.ideal = "La cantidad ideal tiene que ser mayor que el stock mínimo.";
  }

  const ok = Object.keys(errores).length === 0;
  return {
    ok,
    errores,
    producto: ok
      ? {
          nombre,
          categoria: borrador.categoria,
          ...numeros,
          visible: Boolean(borrador.visible),
        }
      : null,
  };
}
