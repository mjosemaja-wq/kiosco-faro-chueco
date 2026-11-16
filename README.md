# Kiosco del Faro Chueco

Control de productos del kiosco de la recepción del Hostel Faro Chueco (Uruguay). Mantiene el catálogo, baja el stock con un toque y arma la lista de reposición para compartir por WhatsApp.

Pensada para un celular apoyado en el mostrador (se usa bien desde 360 px de ancho). No hay login ni servidor: todo queda en `localStorage` del navegador. **No usa Supabase ni ninguna base de datos externa.**

## Cómo correrla

Es un único archivo estático, `index.html`, sin instalación ni build.

1. Descargá o cloná el repositorio.
2. Abrí `index.html` en el navegador (doble clic), o serví la carpeta con cualquier servidor estático:
   ```
   npx serve .
   ```
3. Para el celular, desplegá el repo en Vercel o en GitHub Pages y abrí la URL.

### Desplegar en Vercel

1. Entrá en vercel.com con tu cuenta y elegí **Add New, Project**.
2. Importá este repositorio.
3. Dejá Framework Preset en *Other* y sin comando de build.
4. Tocá **Deploy**. Cada `git push` a `main` vuelve a desplegar.

## Pantallas

- **Mostrador:** productos visibles, filtro por categoría, **Vendí 1** (sin confirmación) y **Devolvieron 1**. Con stock 0 el botón de venta queda desactivado y la etiqueta dice «Agotado».
- **Panel de compras** (con clave): productos en el mínimo o por debajo, cantidad a comprar, **Compartir por WhatsApp**, **Reponer todo** (con confirmación) y **Restaurar datos de ejemplo**.
- **Productos** (con clave): alta, edición y borrado (con confirmación) del catálogo.

## Reglas de stock

- Etiqueta: **Disponible** si el stock es mayor que el mínimo; **Reponer** si es igual o menor; **Agotado** si es 0 (prevalece sobre Reponer).
- Cantidad sugerida = ideal menos stock actual, nunca negativa. Ejemplo: ideal 12 y stock 3 dan 9.
- «Devolvieron 1» no pasa de la cantidad ideal más 10.
- No se acepta un nombre repetido ni una cantidad ideal igual o menor al mínimo.
- Un producto no visible desaparece del mostrador pero sigue en el listado de Productos.

## Datos sintéticos

Los 12 productos de ejemplo (precios en pesos uruguayos, stock, mínimo e ideal) están en la constante `SEED` al inicio del `<script>` de `index.html`. Son datos de prueba, sin información personal de terceros.

- **Primera visita:** si la clave `faro-chueco-kiosco-v1` no existe en `localStorage`, se carga la semilla. Una lista guardada vacía no cuenta como primera visita y no se pisa.
- **Restaurar:** en el Panel, **Restaurar datos de ejemplo** (con confirmación) repone solo los datos de este proyecto.
- **Reiniciar a mano:** en las herramientas del navegador, borrá la clave `faro-chueco-kiosco-v1`.
- Se guarda primero y recién después se muestra el éxito. Si `localStorage` falla, no se altera ningún código, cantidad ni estado, y el formulario conserva lo escrito.

## Cómo cambiar la clave del panel

La clave se define en el código, en la constante `PANEL_KEY` al inicio del `<script>` de `index.html`:

```js
const PANEL_KEY = "faro2026";
```

Cambiá el valor, guardá y volvé a desplegar. Clave de prueba actual: `faro2026`.

El acceso se controla en el navegador con una clave compartida, sin cuentas individuales ni validación de identidad, y sin recuperación de acceso. **Es una barrera liviana:** la clave es visible en el código de la página, así que no sirve para proteger información sensible.

## Stack

HTML, CSS y JavaScript sin dependencias. Tipografías: Rubik (títulos) y Nunito Sans (texto), desde Google Fonts. Paleta: #14505C, #EBDDBF, #FFFCF5, #1B2B30, #F2B632, #D2513F y #58A4A6.

## Dudas de alcance

Escribir a partners@kodarvia.com (nunca al cliente).
