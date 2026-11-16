import { useState } from "react";
import { CATEGORIAS } from "../config.js";
import { puedeDevolver, puedeVender } from "../lib/stock.js";
import { formatoPrecio } from "../lib/whatsapp.js";
import { Boton, Chip, Etiqueta, Titulo, Vacio } from "../components/ui.jsx";

export default function Mostrador({ productos, onVender, onDevolver, irAProductos }) {
  const [categoria, setCategoria] = useState("Todas");

  const visibles = productos.filter((p) => p.visible);
  const lista = visibles.filter((p) => categoria === "Todas" || p.categoria === categoria);

  return (
    <>
      <Titulo titulo="Mostrador" bajada="Tocá «Vendí 1» y el stock baja al toque." />

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2" role="group" aria-label="Filtrar por categoría">
        {["Todas", ...CATEGORIAS].map((c) => (
          <Chip key={c} activo={categoria === c} onClick={() => setCategoria(c)}>
            {c}
          </Chip>
        ))}
      </div>

      {visibles.length === 0 ? (
        <Vacio
          titulo="No hay nada en el mostrador."
          accion={
            <Boton variante="primario" tamano="md" onClick={irAProductos}>
              Ir a Productos
            </Boton>
          }
        >
          Cargá un producto o marcalo como visible en Productos.
        </Vacio>
      ) : lista.length === 0 ? (
        <Vacio titulo={`No hay nada de ${categoria} en el mostrador.`}>Probá con otra categoría.</Vacio>
      ) : (
        <ul className="mt-2 space-y-3">
          {lista.map((p) => (
            <li key={p.id}>
              <TarjetaProducto producto={p} onVender={onVender} onDevolver={onDevolver} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function TarjetaProducto({ producto: p, onVender, onDevolver }) {
  const vendible = puedeVender(p);
  return (
    <article className="rounded-3xl border-2 border-borde bg-superficie p-4" aria-label={p.nombre}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold leading-snug">{p.nombre}</h2>
          <p className="text-sm text-tenue">{p.categoria}</p>
        </div>
        {/* El cartelito de precio, como el de arriba de la heladera */}
        <span className="flex-none -rotate-2 rounded-lg bg-arena px-2.5 py-1 font-display text-lg font-bold text-noche shadow-[2px_2px_0_var(--color-borde)]">
          {formatoPrecio(p.precio)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p>
          <span className="font-display text-4xl font-bold tabular-nums">{p.stock}</span>
          <span className="ml-1.5 text-tenue">en stock</span>
        </p>
        <Etiqueta producto={p} />
      </div>

      <div className="mt-3 grid grid-cols-[2fr_1fr] gap-2.5">
        <Boton
          variante="sombrilla"
          tamano="xl"
          disabled={!vendible}
          onClick={() => onVender(p.id)}
          aria-label={`Vendí 1 ${p.nombre}`}
        >
          Vendí 1
        </Boton>
        <Boton
          variante="borde"
          tamano="xl"
          className="!px-2 !text-[15px] leading-tight"
          disabled={!puedeDevolver(p)}
          onClick={() => onDevolver(p.id)}
          aria-label={`Devolvieron 1 ${p.nombre}`}
        >
          Devolvieron 1
        </Boton>
      </div>
    </article>
  );
}
