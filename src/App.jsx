import { NOMBRE_NEGOCIO } from "./config.js";

export default function App() {
  return (
    <div className="min-h-dvh bg-fondo">
      <main className="mx-auto max-w-xl px-4 py-6">
        <h1 className="text-2xl font-bold">{NOMBRE_NEGOCIO}</h1>
        <p className="text-tenue">Armando el mostrador…</p>
      </main>
    </div>
  );
}
