import { test } from "node:test";
import assert from "node:assert/strict";

import { crearSemilla } from "../src/lib/seed.js";
import { cargarProductos, guardarProductos } from "../src/lib/storage.js";
import {
  estado,
  sugerencia,
  vender,
  devolver,
  paraReponer,
  reponerTodo,
  puedeVender,
} from "../src/lib/stock.js";
import { validarProducto } from "../src/lib/validate.js";
import { mensajeReposicion } from "../src/lib/whatsapp.js";
import { STORAGE_KEY } from "../src/config.js";

function memoria(inicial = {}) {
  const datos = { ...inicial };
  return {
    datos,
    getItem: (k) => (k in datos ? datos[k] : null),
    setItem: (k, v) => {
      datos[k] = String(v);
    },
  };
}

const base = { id: "x", nombre: "Prueba", categoria: "Viaje", precio: 100, visible: true };

test("caso de aceptación: ideal 12 y stock 3 sugiere 9", () => {
  assert.equal(sugerencia({ ...base, stock: 3, minimo: 4, ideal: 12 }), 9);
});

test("la sugerencia nunca es negativa si el stock supera el ideal", () => {
  assert.equal(sugerencia({ ...base, stock: 20, minimo: 4, ideal: 12 }), 0);
});

test("etiquetas: Disponible, Reponer y Agotado (Agotado prevalece)", () => {
  assert.equal(estado({ ...base, stock: 5, minimo: 4, ideal: 12 }), "Disponible");
  assert.equal(estado({ ...base, stock: 4, minimo: 4, ideal: 12 }), "Reponer");
  assert.equal(estado({ ...base, stock: 1, minimo: 4, ideal: 12 }), "Reponer");
  assert.equal(estado({ ...base, stock: 0, minimo: 0, ideal: 12 }), "Agotado");
  assert.equal(estado({ ...base, stock: 0, minimo: 4, ideal: 12 }), "Agotado");
});

test("Vendí 1 resta uno y no baja de cero", () => {
  const lista = [{ ...base, stock: 1, minimo: 0, ideal: 5 }];
  const una = vender(lista, "x");
  assert.equal(una[0].stock, 0);
  assert.equal(puedeVender(una[0]), false);
  assert.equal(vender(una, "x")[0].stock, 0);
});

test("Devolvieron 1 suma uno sin pasar ideal + 10", () => {
  let lista = [{ ...base, stock: 14, minimo: 2, ideal: 5 }];
  lista = devolver(lista, "x");
  assert.equal(lista[0].stock, 15);
  lista = devolver(lista, "x");
  assert.equal(lista[0].stock, 15);
});

test("escenario del briefing: dos cervezas y un protector solar", () => {
  let p = crearSemilla();
  const cerveza = p.find((x) => x.nombre.startsWith("Cerveza"));
  const protector = p.find((x) => x.nombre.startsWith("Protector"));
  p = vender(vender(p, cerveza.id), cerveza.id);
  p = vender(p, protector.id);
  assert.equal(p.find((x) => x.id === cerveza.id).stock, 1);
  assert.equal(p.find((x) => x.id === protector.id).stock, 1);
  const nombres = paraReponer(p).map((x) => x.nombre);
  assert.ok(nombres.includes("Cerveza en lata 473 ml"));
  assert.ok(nombres.includes("Yerba 500 g"));
});

test("panel con la semilla: agotados primero y mensaje con cantidades", () => {
  const p = crearSemilla();
  const lista = paraReponer(p);
  assert.deepEqual(
    lista.map((x) => x.nombre),
    [
      "Adaptador de enchufe",
      "Yerba 500 g",
      "Cerveza en lata 473 ml",
      "Fideos 500 g",
      "Protector solar FPS 50",
    ]
  );
  const texto = mensajeReposicion(p, new Date(2026, 0, 12));
  assert.match(texto, /• Cerveza en lata 473 ml: 27/);
  assert.match(texto, /• Yerba 500 g: 6/);
  assert.match(texto, /• Adaptador de enchufe: 5/);
  assert.match(texto, /• Fideos 500 g: 6/);
  assert.match(texto, /• Protector solar FPS 50: 6/);
});

test("Reponer todo lleva solo los de la lista a su ideal", () => {
  const p = reponerTodo(crearSemilla());
  assert.equal(p.find((x) => x.nombre === "Yerba 500 g").stock, 6);
  assert.equal(p.find((x) => x.nombre === "Agua mineral 500 ml").stock, 18);
  assert.equal(paraReponer(p).length, 0);
});

test("validación: nombre repetido (sin importar mayúsculas ni tildes) e ideal <= mínimo", () => {
  const p = crearSemilla();
  const borrador = { nombre: "yerba 500 G", categoria: "Almacén", precio: "1", stock: "1", minimo: "2", ideal: "5", visible: true };
  assert.equal(validarProducto(borrador, p).errores.nombre, "Ya hay un producto con ese nombre.");
  const yerba = p.find((x) => x.nombre === "Yerba 500 g");
  assert.equal(validarProducto(borrador, p, yerba.id).ok, true);
  assert.ok(validarProducto({ ...borrador, nombre: "Mate", ideal: "2" }, p).errores.ideal);
  assert.ok(validarProducto({ ...borrador, nombre: "Mate", ideal: "1" }, p).errores.ideal);
  assert.ok(validarProducto({ ...borrador, nombre: "Mate", precio: "-3" }, p).errores.precio);
  assert.equal(validarProducto({ ...borrador, nombre: "Mate" }, p).ok, true);
});

test("primera visita carga la semilla; lista vacía guardada no se pisa", () => {
  const vacio = memoria();
  const r1 = cargarProductos(vacio);
  assert.equal(r1.productos.length, 12);
  assert.ok(vacio.datos[STORAGE_KEY]);

  const conListaVacia = memoria({ [STORAGE_KEY]: "[]" });
  const r2 = cargarProductos(conListaVacia);
  assert.equal(r2.productos.length, 0);
  assert.equal(conListaVacia.datos[STORAGE_KEY], "[]");
});

test("si localStorage falla, guardar devuelve false y no cambia nada", () => {
  const roto = { getItem: () => null, setItem: () => { throw new Error("QuotaExceeded"); } };
  assert.equal(guardarProductos(crearSemilla(), roto), false);
  const r = cargarProductos(roto);
  assert.equal(r.puedeGuardar, false);
  assert.equal(r.productos.length, 12);
});

test("datos dañados no se pisan", () => {
  const danado = memoria({ [STORAGE_KEY]: "{esto no es json" });
  const r = cargarProductos(danado);
  assert.equal(r.productos.length, 0);
  assert.ok(r.aviso);
  assert.equal(danado.datos[STORAGE_KEY], "{esto no es json");
});
