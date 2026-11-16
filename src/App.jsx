import { useCallback, useEffect, useRef, useState } from "react";
import { NOMBRE_NEGOCIO } from "./config.js";
import { crearSemilla } from "./lib/seed.js";
import { cargarProductos, crearId, guardarProductos } from "./lib/storage.js";
import { devolver, paraReponer, reponerTodo, vender } from "./lib/stock.js";
import { Aviso } from "./components/ui.jsx";
import Clave from "./components/Clave.jsx";
import Confirmar from "./components/Confirmar.jsx";
import Mostrador from "./screens/Mostrador.jsx";
import Panel from "./screens/Panel.jsx";
import Productos from "./screens/Productos.jsx";

const PANTALLAS = ["mostrador", "panel", "productos"];

function pantallaDesdeHash() {
  const h = window.location.hash.replace(/^#\/?/, "");
  return PANTALLAS.includes(h) ? h : "mostrador";
}

export default function App() {
  const [inicio] = useState(() => cargarProductos());
  const [productos, setProductos] = useState(inicio.productos);
  const [aviso, setAviso] = useState(inicio.aviso);
  const [pantalla, setPantalla] = useState(pantallaDesdeHash);
  const [desbloqueado, setDesbloqueado] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [toast, setToast] = useState(null);

  // Referencia siempre al día, para que dos toques rápidos no pisen el stock.
  const actual = useRef(productos);
  const timer = useRef();

  useEffect(() => {
    const alCambiar = () => setPantalla(pantallaDesdeHash());
    window.addEventListener("hashchange", alCambiar);
    return () => window.removeEventListener("hashchange", alCambiar);
  }, []);

  const avisar = useCallback((texto, error = false) => {
    clearTimeout(timer.current);
    setToast({ texto, error, n: Date.now() });
    timer.current = setTimeout(() => setToast(null), error ? 4500 : 2200);
  }, []);

  /* Guarda primero; solo si localStorage acepta, actualiza la pantalla y muestra el éxito. */
  const aplicar = useCallback(
    (siguiente, mensaje) => {
      if (!guardarProductos(siguiente)) {
        avisar("No se pudo guardar en este navegador. No se cambió nada.", true);
        return false;
      }
      actual.current = siguiente;
      setProductos(siguiente);
      setAviso(null);
      if (mensaje) avisar(mensaje);
      return true;
    },
    [avisar]
  );

  function ir(destino) {
    window.location.hash = destino === "mostrador" ? "" : destino;
    setPantalla(destino);
    window.scrollTo({ top: 0 });
  }

  const nombreDe = (id) => actual.current.find((p) => p.id === id);

  function alVender(id) {
    const antes = nombreDe(id);
    if (!antes || antes.stock <= 0) return;
    aplicar(vender(actual.current, id), `Vendiste 1 · ${antes.nombre} (quedan ${antes.stock - 1})`);
  }

  function alDevolver(id) {
    const antes = nombreDe(id);
    if (!antes) return;
    const siguiente = devolver(actual.current, id);
    if (siguiente.find((p) => p.id === id).stock === antes.stock) return;
    aplicar(siguiente, `Devuelto 1 · ${antes.nombre} (quedan ${antes.stock + 1})`);
  }

  function alGuardarProducto(datos, id) {
    const lista = actual.current;
    const siguiente = id
      ? lista.map((p) => (p.id === id ? { ...p, ...datos } : p))
      : [...lista, { id: crearId(), ...datos }];
    return aplicar(siguiente, id ? "Cambios guardados" : "Producto agregado");
  }

  function alBorrar(producto) {
    setPedido({
      titulo: `¿Borrar «${producto.nombre}»?`,
      texto: "Sale del mostrador, del panel y del catálogo. No se puede deshacer.",
      confirmar: "Borrar",
      peligro: true,
      alConfirmar: () =>
        aplicar(
          actual.current.filter((p) => p.id !== producto.id),
          "Producto borrado"
        ),
    });
  }

  function alReponerTodo() {
    const n = paraReponer(actual.current).length;
    setPedido({
      titulo: "¿Reponer todo?",
      texto: `Los ${n} productos de la lista quedan en su cantidad ideal. Hacelo cuando ya volviste con la compra.`,
      confirmar: "Reponer todo",
      alConfirmar: () => aplicar(reponerTodo(actual.current), "Stock repuesto"),
    });
  }

  function alRestaurar() {
    setPedido({
      titulo: "¿Restaurar datos de ejemplo?",
      texto:
        "Vuelven los 12 productos de ejemplo del kiosco y se pierden tus cambios. Solo toca los datos de esta app.",
      confirmar: "Restaurar",
      peligro: true,
      alConfirmar: () => aplicar(crearSemilla(), "Datos de ejemplo restaurados"),
    });
  }

  const pendientes = paraReponer(productos).length;
  const protegida = pantalla !== "mostrador" && !desbloqueado;

  return (
    <div className="min-h-dvh bg-fondo pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <div className="bg-primario text-sobre-primario">
        <div className="mx-auto flex max-w-xl items-center gap-2.5 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3">
          <img src="/favicon.svg" alt="" className="size-8 rounded-lg" />
          <p className="font-display text-lg font-bold">{NOMBRE_NEGOCIO}</p>
        </div>
      </div>

      <main className="mx-auto max-w-xl px-4 pt-5">
        {aviso && <Aviso>{aviso}</Aviso>}

        {pantalla === "mostrador" && (
          <Mostrador
            productos={productos}
            onVender={alVender}
            onDevolver={alDevolver}
            irAProductos={() => ir("productos")}
          />
        )}
        {protegida && (
          <Clave
            titulo={pantalla === "panel" ? "Panel de compras" : "Productos"}
            onEntrar={() => setDesbloqueado(true)}
          />
        )}
        {pantalla === "panel" && !protegida && (
          <Panel
            productos={productos}
            onReponerTodo={alReponerTodo}
            onRestaurar={alRestaurar}
            onSalir={() => {
              setDesbloqueado(false);
              ir("mostrador");
            }}
            avisar={avisar}
          />
        )}
        {pantalla === "productos" && !protegida && (
          <Productos productos={productos} onGuardar={alGuardarProducto} onBorrar={alBorrar} />
        )}
      </main>

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-20 mx-auto max-w-[34rem]"
      >
        {toast && (
          <p
            key={toast.n}
            className={
              "rounded-2xl px-4 py-3 font-bold shadow-lg " +
              (toast.error ? "border-2 border-coral bg-noche text-espuma" : "bg-tinta text-fondo")
            }
          >
            {toast.texto}
          </p>
        )}
      </div>

      <nav
        aria-label="Pantallas"
        className="fixed inset-x-0 bottom-0 z-10 bg-primario pb-[env(safe-area-inset-bottom)] text-sobre-primario"
      >
        <div className="mx-auto grid max-w-xl grid-cols-3">
          {[
            ["mostrador", "Mostrador"],
            ["panel", "Panel"],
            ["productos", "Productos"],
          ].map(([id, texto]) => {
            const activa = pantalla === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => ir(id)}
                aria-current={activa ? "page" : undefined}
                className={
                  "relative min-h-16 font-display text-base transition " +
                  (activa ? "font-bold" : "font-medium opacity-80")
                }
              >
                {texto}
                {id === "panel" && pendientes > 0 && (
                  <span className="ml-1.5 inline-flex min-w-6 items-center justify-center rounded-full bg-sombrilla px-1.5 text-sm font-bold text-noche">
                    {pendientes}
                    <span className="sr-only"> para reponer</span>
                  </span>
                )}
                {activa && <span aria-hidden="true" className="absolute inset-x-6 bottom-1.5 h-1 rounded-full bg-sombrilla" />}
              </button>
            );
          })}
        </div>
      </nav>

      <Confirmar pedido={pedido} onCerrar={() => setPedido(null)} />
    </div>
  );
}
