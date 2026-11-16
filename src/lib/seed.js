/*
  Datos sintéticos de prueba: los 12 productos del encargo.
  Precios en pesos uruguayos. Sin información personal de terceros.
  Formato: [nombre, categoría, precio, stock, mínimo, ideal]
*/
const FILAS = [
  ["Agua mineral 500 ml", "Bebidas", 60, 18, 6, 24],
  ["Cerveza en lata 473 ml", "Bebidas", 120, 3, 6, 30],
  ["Refresco de pomelo 500 ml", "Bebidas", 90, 10, 4, 16],
  ["Yerba 500 g", "Almacén", 180, 0, 2, 6],
  ["Alfajor de dulce de leche", "Almacén", 55, 14, 5, 20],
  ["Fideos 500 g", "Almacén", 95, 4, 4, 10],
  ["Protector solar FPS 50", "Viaje", 590, 2, 3, 8],
  ["Candado para locker", "Viaje", 350, 7, 3, 10],
  ["Adaptador de enchufe", "Viaje", 290, 0, 2, 5],
  ["Postal del faro", "Viaje", 70, 25, 5, 30],
  ["Toalla de alquiler, por estadía", "Alquiler", 150, 12, 4, 20],
  ["Sombrilla de alquiler, por día", "Alquiler", 220, 5, 2, 6],
];

/* Devuelve una copia nueva cada vez, para que nadie modifique la semilla original. */
export function crearSemilla() {
  return FILAS.map(([nombre, categoria, precio, stock, minimo, ideal], i) => ({
    id: "p" + (i + 1),
    nombre,
    categoria,
    precio,
    stock,
    minimo,
    ideal,
    visible: true,
  }));
}
