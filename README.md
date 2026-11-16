# Kiosco del Faro Chueco

Control de productos del kiosco de la recepción del Hostel Faro Chueco (Uruguay). Mantiene el catálogo, baja el stock con un toque y arma la lista de reposición para compartir por WhatsApp.

Está pensada para un celular apoyado en el mostrador y se usa bien desde 360 px de ancho. No hay login ni servidor: todo queda en `localStorage` del navegador. **No usa Supabase ni ninguna base de datos externa.**

- **Stack:** React 19, Vite 7, Tailwind CSS 4 y `localStorage`.
- **Despliegue:** Vercel, ya configurado en `vercel.json`.

## Cómo correrla

Requisito: Node.js 20.19 o superior.

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm test          # tests de las reglas de stock (node:test, sin dependencias)
npm run build     # build de producción en dist/
npm run preview   # sirve el build en http://localhost:4173
```

Para probarla en el celular durante el desarrollo, usá `npm run dev -- --host` y abrí la IP de tu compu desde el teléfono, conectado a la misma red Wi-Fi.

## Desplegar en Vercel

El repositorio ya incluye `vercel.json` (framework Vite, `npm run build` y salida en `dist/`), así que no hay que configurar nada a mano.

1. En [vercel.com](https://vercel.com) elegí **Add New → Project**.
2. Importá el repositorio `kiosco-faro-chueco`.
3. Vercel detecta **Vite**. Dejá todo como viene: sin variables de entorno ni base de datos.
4. Tocá **Deploy**. Vas a recibir la URL de producción (`https://<proyecto>.vercel.app`).
5. Cada push a `main` vuelve a desplegar. Cada rama o pull request genera una **URL de previsualización** propia.

La navegación usa el hash de la URL (`#panel`, `#productos`), así que no hacen falta reglas de rewrite.

## Pantallas

| Pantalla | Acceso | Qué hace |
|---|---|---|
| **Mostrador** | Libre | Productos visibles, filtro por categoría, **Vendí 1** (sin confirmación) y **Devolvieron 1** para corregir un toque equivocado. |
| **Panel de compras** | Con clave | Productos en el mínimo o por debajo con la cantidad a comprar, **Compartir por WhatsApp**, copiar la lista, **Reponer todo** y **Restaurar datos de ejemplo** (los dos con confirmación). |
| **Productos** | Con clave | Alta, edición, ocultar del mostrador y borrado (con confirmación) del catálogo. |

Cada pantalla tiene su estado vacío: mostrador sin productos visibles, categoría sin productos, panel sin nada para reponer y catálogo vacío.

## Reglas de stock

- **Etiqueta:** «Disponible» si el stock es mayor que el mínimo, «Reponer» si es igual o menor, y «Agotado» si es 0. Agotado prevalece sobre Reponer.
- **Stock en 0:** el botón «Vendí 1» queda desactivado.
- **Cantidad sugerida:** ideal menos stock actual, nunca negativa. Ejemplo: ideal 12 y stock 3 dan **9**.
- **Devoluciones:** «Devolvieron 1» suma uno, sin pasar la cantidad ideal más 10.
- **Validación:** no se acepta un nombre repetido (sin importar mayúsculas, tildes ni espacios) ni una cantidad ideal igual o menor al mínimo.
- **Ocultos:** un producto no visible desaparece del mostrador, pero sigue en Productos y, si le falta stock, en el Panel con la nota «oculto en mostrador».
- **Ventas:** no se registra un historial ni se cobra nada. «Vendí 1» solo mueve el stock.

Las reglas están en `src/lib/stock.js` y `src/lib/validate.js`, y se prueban en `tests/reglas.test.js`.

## Datos sintéticos

Los 12 productos de ejemplo (precios en pesos uruguayos, stock, mínimo e ideal) están en `src/lib/seed.js`. Son datos de prueba, sin información personal de terceros.

- **Primera visita:** si la clave `faro-chueco-kiosco-v1` no existe en `localStorage`, se carga la semilla y se guarda.
- **Lista vacía:** una lista guardada vacía **no** cuenta como primera visita y no se pisa.
- **Datos dañados:** si lo guardado está dañado, no se sobrescribe. La app avisa y ofrece restaurar desde el Panel.
- **Restaurar:** en el Panel, **Restaurar datos de ejemplo** pide confirmación y repone solo la clave de esta app.
- **Reiniciar a mano:** en las herramientas del navegador (Aplicación → Local Storage), borrá la clave `faro-chueco-kiosco-v1` y recargá la página.
- **Guardar primero:** la app guarda y recién después muestra el éxito. Si `localStorage` falla, no cambia ningún stock ni estado, avisa en pantalla, y el formulario conserva lo escrito.

Para cambiar los datos de ejemplo, editá las filas de `src/lib/seed.js` con el formato `[nombre, categoría, precio, stock, mínimo, ideal]`. Las categorías válidas son las cuatro fijas de `src/config.js`: Bebidas, Almacén, Viaje y Alquiler.

### Reproducir el caso del briefing

1. Desde la semilla, en el Mostrador tocá «Vendí 1» dos veces en *Cerveza en lata* y una vez en *Protector solar*.
2. Entrá al Panel con la clave. Están *Cerveza* y *Yerba* (Agotado), cada uno con su cantidad. «Compartir por WhatsApp» abre el mensaje con la lista.
3. **Caso de aceptación:** en Productos, cargá un producto con mínimo 4, ideal 12 y stock 3. En el Panel aparece con **Comprar 9**.

## Cómo cambiar la clave del panel

La clave se define en el código, en `src/config.js`:

```js
export const PANEL_KEY = "faro2026";
```

Cambiá el valor, hacé commit y push: Vercel vuelve a desplegar solo. **Clave de prueba actual: `faro2026`.**

Es una clave compartida que se controla en el navegador: no hay cuentas individuales, alta de usuarios ni recuperación de acceso. Al recargar la página, el panel vuelve a pedir la clave. Es una barrera liviana: la clave queda visible en el código que descarga el navegador, así que no sirve para proteger información sensible.

## Identidad visual

- **Paleta:** petróleo `#14505C`, arena `#EBDDBF`, espuma `#FFFCF5`, noche `#1B2B30`, sombrilla `#F2B632`, coral `#D2513F` y agua `#58A4A6`. Está definida en `src/index.css` como colores de Tailwind (`bg-petroleo`, `bg-sombrilla`, etc.).
- **Tipografía:** Rubik para títulos y botones, Nunito Sans para el texto, desde Google Fonts.
- **Mostrador:** botones de 64 px de alto para acertar con el pulgar, «Vendí 1» en amarillo sombrilla y el precio como un cartelito de kiosco.
- **Contraste:** alto, pensado para la luz baja de la recepción. El coral nunca lleva texto chico encima: «Agotado» va en noche con borde coral.
- **Modo oscuro:** se activa solo según la preferencia del sistema.

## Estructura

```
index.html            entrada de Vite
vercel.json           configuración de despliegue
public/favicon.svg
src/
  config.js           clave del panel, clave de localStorage, categorías y horarios
  index.css           Tailwind + paleta + modo oscuro
  App.jsx             estado, guardado, navegación, avisos y confirmaciones
  lib/                seed, storage, stock, validate, whatsapp (JS puro, testeable)
  components/         ui (botones, etiquetas), Clave, Confirmar
  screens/            Mostrador, Panel, Productos, FormProducto
tests/reglas.test.js  reglas, caso de aceptación y localStorage
```

## Fases del desarrollo

1. **Base:** Vite + React + Tailwind, tema con la paleta y tipografías, `vercel.json`.
2. **Datos y reglas:** semilla, `localStorage` (guardar antes de mostrar el éxito), etiquetas, sugerencia, validación y mensaje de WhatsApp, con tests.
3. **Pantallas:** Mostrador, Panel y Productos, clave, confirmaciones y estados vacíos.
4. **Entrega:** este README, verificación a 360 px contra los criterios de aceptación y despliegue en Vercel.

## Dudas de alcance

Escribir a partners@kodarvia.com (nunca al cliente).
