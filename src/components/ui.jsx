import { ESTADOS, estado } from "../lib/stock.js";

const VARIANTES = {
  // Acción principal del mostrador: amarillo sombrilla
  sombrilla: "bg-sombrilla text-noche hover:brightness-105 active:brightness-95",
  primario: "bg-primario text-sobre-primario hover:brightness-110 active:brightness-95",
  borde: "bg-transparent text-tinta border-2 border-borde hover:bg-suave active:bg-suave",
  // Texto blanco en negrita a 19 px: texto grande, contraste suficiente sobre coral
  peligro: "bg-coral text-white text-[19px] hover:brightness-105 active:brightness-95",
};

const TAMANOS = {
  xl: "min-h-16 px-5 text-xl",
  lg: "min-h-14 px-5 text-lg",
  md: "min-h-12 px-4 text-base",
};

export function Boton({ variante = "primario", tamano = "lg", className = "", as: Tag = "button", ...props }) {
  const base =
    "inline-flex select-none items-center justify-center gap-2 rounded-2xl font-display font-bold " +
    "transition disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100 touch-manipulation";
  const extra = Tag === "button" && !props.type ? { type: "button" } : {};
  return <Tag className={`${base} ${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`} {...extra} {...props} />;
}

const ESTILO_ESTADO = {
  [ESTADOS.DISPONIBLE]: "bg-agua text-noche",
  [ESTADOS.REPONER]: "bg-sombrilla text-noche",
  [ESTADOS.AGOTADO]: "bg-noche text-espuma ring-2 ring-coral dark:bg-coral dark:text-white dark:ring-0",
};

export function Etiqueta({ producto }) {
  const e = estado(producto);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 font-display text-sm font-bold ${ESTILO_ESTADO[e]}`}
    >
      {e === ESTADOS.AGOTADO && <span aria-hidden="true" className="size-2 rounded-full bg-coral dark:bg-white" />}
      {e}
    </span>
  );
}

export function Chip({ activo, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      className={
        "min-h-11 flex-none rounded-full border-2 px-4 font-display text-[15px] font-bold transition " +
        (activo ? "border-primario bg-primario text-sobre-primario" : "border-borde bg-transparent text-tinta")
      }
      {...props}
    >
      {children}
    </button>
  );
}

export function Vacio({ titulo, children, accion }) {
  return (
    <div className="my-4 rounded-3xl border-2 border-dashed border-borde px-5 py-8 text-center">
      <p className="font-display text-lg font-bold">{titulo}</p>
      {children && <p className="mt-1 text-tenue">{children}</p>}
      {accion && <div className="mt-4 flex justify-center">{accion}</div>}
    </div>
  );
}

export function Tarjeta({ className = "", ...props }) {
  return <div className={`rounded-3xl border-2 border-borde bg-superficie p-4 ${className}`} {...props} />;
}

export function Titulo({ titulo, bajada }) {
  return (
    <header className="mb-3">
      <h1 className="font-display text-[28px] font-bold leading-tight">{titulo}</h1>
      {bajada && <p className="mt-1 text-tenue">{bajada}</p>}
    </header>
  );
}

export function Aviso({ children }) {
  return (
    <div role="alert" className="my-3 rounded-2xl border-2 border-coral bg-superficie px-4 py-3 font-semibold">
      {children}
    </div>
  );
}
