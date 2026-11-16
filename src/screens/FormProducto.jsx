import { useState } from "react";
import { CATEGORIAS } from "../config.js";
import { validarProducto } from "../lib/validate.js";
import { Aviso, Boton, Tarjeta, Titulo } from "../components/ui.jsx";

const VACIO = { nombre: "", categoria: CATEGORIAS[0], precio: "", stock: "", minimo: "", ideal: "", visible: true };

const NUMEROS = [
  ["precio", "Precio ($)"],
  ["stock", "Stock"],
  ["minimo", "Stock mínimo"],
  ["ideal", "Cantidad ideal"],
];

const INPUT = "mt-1 min-h-13 w-full rounded-2xl border-2 bg-fondo px-4 text-lg";

export default function FormProducto({ producto, productos, onGuardar, onCancelar }) {
  const [borrador, setBorrador] = useState(() =>
    producto
      ? Object.fromEntries(Object.entries({ ...VACIO, ...producto }).map(([k, v]) => [k, typeof v === "number" ? String(v) : v]))
      : VACIO
  );
  const [errores, setErrores] = useState({});
  const [falloGuardado, setFalloGuardado] = useState(false);

  const cambiar = (campo) => (e) => {
    const valor = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setBorrador((b) => ({ ...b, [campo]: valor }));
    setErrores((er) => ({ ...er, [campo]: undefined }));
    setFalloGuardado(false);
  };

  function enviar(e) {
    e.preventDefault();
    const r = validarProducto(borrador, productos, producto?.id ?? null);
    if (!r.ok) {
      setErrores(r.errores);
      const primero = Object.keys(r.errores)[0];
      document.getElementById(`campo-${primero}`)?.focus();
      return;
    }
    // Si localStorage falla, el formulario conserva lo escrito.
    if (!onGuardar(r.producto)) setFalloGuardado(true);
  }

  const borde = (campo) => (errores[campo] ? "border-coral" : "border-borde");

  return (
    <>
      <Titulo titulo={producto ? "Editar producto" : "Nuevo producto"} />
      <Tarjeta>
        <form onSubmit={enviar} noValidate>
          <Campo id="nombre" etiqueta="Nombre" error={errores.nombre}>
            <input
              id="campo-nombre"
              value={borrador.nombre}
              onChange={cambiar("nombre")}
              autoComplete="off"
              aria-invalid={!!errores.nombre}
              aria-describedby={errores.nombre ? "error-nombre" : undefined}
              className={`${INPUT} ${borde("nombre")}`}
            />
          </Campo>

          <Campo id="categoria" etiqueta="Categoría" error={errores.categoria}>
            <select
              id="campo-categoria"
              value={borrador.categoria}
              onChange={cambiar("categoria")}
              className={`${INPUT} ${borde("categoria")}`}
            >
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Campo>

          <div className="grid grid-cols-2 gap-x-3">
            {NUMEROS.map(([campo, etiqueta]) => (
              <Campo key={campo} id={campo} etiqueta={etiqueta} error={errores[campo]}>
                <input
                  id={`campo-${campo}`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={borrador[campo]}
                  onChange={cambiar(campo)}
                  aria-invalid={!!errores[campo]}
                  aria-describedby={errores[campo] ? `error-${campo}` : undefined}
                  className={`${INPUT} tabular-nums ${borde(campo)}`}
                />
              </Campo>
            ))}
          </div>

          <label className="mt-4 flex min-h-13 cursor-pointer items-center gap-3 rounded-2xl bg-suave px-4 font-bold">
            <input
              type="checkbox"
              checked={borrador.visible}
              onChange={cambiar("visible")}
              className="size-6 accent-primario"
            />
            Visible en el mostrador
          </label>

          {falloGuardado && (
            <Aviso>No se pudo guardar en este navegador. Lo que escribiste sigue acá; probá de nuevo.</Aviso>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Boton variante="borde" onClick={onCancelar}>
              Cancelar
            </Boton>
            <Boton type="submit" variante="sombrilla">
              Guardar
            </Boton>
          </div>
        </form>
      </Tarjeta>
    </>
  );
}

function Campo({ id, etiqueta, error, children }) {
  return (
    <div className="mt-3">
      <label htmlFor={`campo-${id}`} className="block font-bold">
        {etiqueta}
      </label>
      {children}
      {error && (
        <p id={`error-${id}`} className="mt-1 text-sm font-bold">
          <span aria-hidden="true" className="mr-1.5 inline-block size-2.5 rounded-full bg-coral" />
          {error}
        </p>
      )}
    </div>
  );
}
