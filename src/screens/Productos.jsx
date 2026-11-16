import { useState } from "react";
import { formatoPrecio } from "../lib/whatsapp.js";
import { Boton, Etiqueta, Tarjeta, Titulo, Vacio } from "../components/ui.jsx";
import FormProducto from "./FormProducto.jsx";

export default function Productos({ productos, onGuardar, onBorrar }) {
  // null: listado · "nuevo": alta · id: edición
  const [editando, setEditando] = useState(null);

  if (editando) {
    const actual = editando === "nuevo" ? null : productos.find((p) => p.id === editando);
    return (
      <FormProducto
        key={editando}
        producto={actual}
        productos={productos}
        onCancelar={() => setEditando(null)}
        onGuardar={(datos) => {
          const ok = onGuardar(datos, actual?.id ?? null);
          if (ok) setEditando(null);
          return ok;
        }}
      />
    );
  }

  return (
    <>
      <Titulo titulo="Productos" bajada="Todo el catálogo, también lo que está oculto en el mostrador." />
      <Boton variante="sombrilla" tamano="xl" className="w-full" onClick={() => setEditando("nuevo")}>
        Nuevo producto
      </Boton>

      {productos.length === 0 ? (
        <Vacio titulo="Todavía no hay productos.">
          Tocá «Nuevo producto» para cargar el primero, o restaurá los de ejemplo desde el Panel.
        </Vacio>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {productos.map((p) => (
            <li key={p.id}>
              <Tarjeta>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold leading-snug">{p.nombre}</p>
                    <p className="text-sm text-tenue">
                      {p.categoria} · {formatoPrecio(p.precio)}
                    </p>
                  </div>
                  <div className="flex flex-none flex-col items-end gap-1.5">
                    <Etiqueta producto={p} />
                    {!p.visible && (
                      <span className="rounded-full bg-suave px-3 py-1 font-display text-sm font-bold">Oculto</span>
                    )}
                  </div>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <Dato etiqueta="Stock" valor={p.stock} />
                  <Dato etiqueta="Mínimo" valor={p.minimo} />
                  <Dato etiqueta="Ideal" valor={p.ideal} />
                </dl>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <Boton variante="borde" tamano="md" onClick={() => setEditando(p.id)} aria-label={`Editar ${p.nombre}`}>
                    Editar
                  </Boton>
                  <Boton variante="borde" tamano="md" onClick={() => onBorrar(p)} aria-label={`Borrar ${p.nombre}`}>
                    Borrar
                  </Boton>
                </div>
              </Tarjeta>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Dato({ etiqueta, valor }) {
  return (
    <div className="rounded-2xl bg-fondo py-1.5">
      <dt className="text-xs font-bold uppercase tracking-wide text-tenue">{etiqueta}</dt>
      <dd className="font-display text-xl font-bold tabular-nums">{valor}</dd>
    </div>
  );
}
