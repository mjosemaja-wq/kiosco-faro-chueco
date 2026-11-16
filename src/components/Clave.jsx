import { useState } from "react";
import { PANEL_KEY } from "../config.js";
import { Boton, Tarjeta, Titulo } from "./ui.jsx";

/* Barrera liviana con clave compartida, definida en src/config.js. */
export default function Clave({ titulo, onEntrar }) {
  const [valor, setValor] = useState("");
  const [error, setError] = useState(false);

  function enviar(e) {
    e.preventDefault();
    if (valor === PANEL_KEY) onEntrar();
    else setError(true);
  }

  return (
    <>
      <Titulo titulo={titulo} bajada="Esta parte es para quien maneja el stock y las compras." />
      <Tarjeta>
        <form onSubmit={enviar} noValidate>
          <label htmlFor="clave" className="block font-bold">
            Clave del panel
          </label>
          <input
            id="clave"
            type="password"
            autoComplete="off"
            value={valor}
            onChange={(e) => {
              setValor(e.target.value);
              setError(false);
            }}
            aria-invalid={error}
            aria-describedby={error ? "clave-error" : undefined}
            className="mt-1 min-h-13 w-full rounded-2xl border-2 border-borde bg-fondo px-4 text-lg"
          />
          {error && (
            <p id="clave-error" className="mt-2 font-bold">
              <span aria-hidden="true" className="mr-1.5 inline-block size-2.5 rounded-full bg-coral" />
              Esa no es la clave. Probá de nuevo.
            </p>
          )}
          <Boton type="submit" variante="sombrilla" tamano="xl" className="mt-4 w-full">
            Entrar
          </Boton>
        </form>
      </Tarjeta>
    </>
  );
}
