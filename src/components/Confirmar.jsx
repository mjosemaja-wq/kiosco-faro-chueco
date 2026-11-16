import { useEffect, useRef } from "react";
import { Boton } from "./ui.jsx";

/* Diálogo de confirmación con <dialog> nativo: atrapa el foco y se cierra con Escape. */
export default function Confirmar({ pedido, onCerrar }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (pedido && !d.open) d.showModal();
    if (!pedido && d.open) d.close();
  }, [pedido]);

  function confirmar() {
    const accion = pedido?.alConfirmar;
    onCerrar();
    accion?.();
  }

  return (
    <dialog
      ref={ref}
      onClose={onCerrar}
      onCancel={onCerrar}
      aria-labelledby="confirmar-titulo"
      className="m-auto w-[min(100%-2rem,26rem)] rounded-3xl border-2 border-borde bg-superficie p-5 text-tinta backdrop:bg-noche/70"
    >
      {pedido && (
        <>
          <h2 id="confirmar-titulo" className="font-display text-xl font-bold">
            {pedido.titulo}
          </h2>
          {pedido.texto && <p className="mt-2 text-tenue">{pedido.texto}</p>}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Boton variante="borde" onClick={onCerrar} autoFocus>
              Cancelar
            </Boton>
            <Boton variante={pedido.peligro ? "peligro" : "primario"} onClick={confirmar}>
              {pedido.confirmar}
            </Boton>
          </div>
        </>
      )}
    </dialog>
  );
}
