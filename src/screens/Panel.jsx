import { useState } from "react";
import { HORARIO } from "../config.js";
import { paraReponer, sugerencia } from "../lib/stock.js";
import { enlaceWhatsApp, mensajeReposicion } from "../lib/whatsapp.js";
import { Boton, Etiqueta, Tarjeta, Titulo, Vacio } from "../components/ui.jsx";

export default function Panel({ productos, onReponerTodo, onRestaurar, onSalir, avisar }) {
  const [verMensaje, setVerMensaje] = useState(false);
  const lista = paraReponer(productos);
  const mensaje = mensajeReposicion(productos);
  const agotados = lista.filter((p) => p.stock <= 0).length;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(mensaje);
      avisar("Lista copiada");
    } catch {
      setVerMensaje(true);
      avisar("No se pudo copiar. Seleccioná el texto a mano.", true);
    }
  }

  return (
    <>
      <Titulo
        titulo="Panel de compras"
        bajada={`Recepción ${HORARIO.recepcion}. Compras ${HORARIO.compras}.`}
      />

      {lista.length === 0 ? (
        <Vacio titulo="Todo en orden.">Ningún producto está en el mínimo ni por debajo.</Vacio>
      ) : (
        <>
          <Tarjeta>
            <p className="font-display text-lg font-bold">
              Hay que comprar {lista.length} {lista.length === 1 ? "producto" : "productos"}
              {agotados > 0 && ` (${agotados} ${agotados === 1 ? "agotado" : "agotados"})`}.
            </p>
            <div className="mt-3 grid gap-2.5">
              <Boton
                as="a"
                href={enlaceWhatsApp(mensaje)}
                target="_blank"
                rel="noopener noreferrer"
                variante="sombrilla"
                tamano="xl"
              >
                Compartir por WhatsApp
              </Boton>
              <div className="grid grid-cols-2 gap-2.5">
                <Boton variante="borde" tamano="md" onClick={copiar}>
                  Copiar lista
                </Boton>
                <Boton variante="borde" tamano="md" onClick={() => setVerMensaje((v) => !v)} aria-expanded={verMensaje}>
                  {verMensaje ? "Ocultar mensaje" : "Ver mensaje"}
                </Boton>
              </div>
            </div>
            {verMensaje && (
              <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-superficie p-3 font-sans text-sm">{mensaje}</pre>
            )}
          </Tarjeta>

          <h2 className="mt-6 mb-2 font-display text-xl font-bold">Para comprar</h2>
          <ul className="space-y-2.5">
            {lista.map((p) => (
              <li key={p.id}>
                <Tarjeta className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display font-bold leading-snug">{p.nombre}</p>
                    <p className="text-sm text-tenue">
                      Quedan {p.stock} · ideal {p.ideal}
                      {!p.visible && " · oculto en mostrador"}
                    </p>
                    <div className="mt-1.5">
                      <Etiqueta producto={p} />
                    </div>
                  </div>
                  <div className="flex-none rounded-2xl bg-primario px-3 py-2 text-center text-sobre-primario">
                    <p className="text-xs font-bold uppercase tracking-wide">Comprar</p>
                    <p className="font-display text-3xl font-bold tabular-nums leading-none">{sugerencia(p)}</p>
                  </div>
                </Tarjeta>
              </li>
            ))}
          </ul>

          <Boton variante="primario" tamano="lg" className="mt-4 w-full" onClick={onReponerTodo}>
            Reponer todo
          </Boton>
          <p className="mt-1.5 text-center text-sm text-tenue">
            Usalo cuando volvés de comprar: lleva cada producto de la lista a su cantidad ideal.
          </p>
        </>
      )}

      <h2 className="mt-8 mb-2 font-display text-xl font-bold">Más opciones</h2>
      <div className="grid grid-cols-2 gap-2.5">
        <Boton variante="borde" tamano="md" className="leading-tight" onClick={onRestaurar}>
          Restaurar datos de ejemplo
        </Boton>
        <Boton variante="borde" tamano="md" onClick={onSalir}>
          Cerrar panel
        </Boton>
      </div>
    </>
  );
}
