import { test, expect } from '../../fixtures/test';
import { PRODUCTOS, TODOS_LOS_PRODUCTOS, sumaPrecios } from '../../data/products';

/**
 * Cart — Verificacion de productos, cantidades y precios.
 *
 * Cada prueba compara el carrito contra dos oraculos: lo que el inventario
 * mostraba al agregar (captura en vivo) y el catalogo de data/products.ts.
 */
test.describe('Cart · Verificacion de productos, cantidades y precios', { tag: '@carrito' }, () => {
  test('CART-01 carrito vacio: sin productos y sin contador', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.header.abrirCarrito();

    await cartPage.expectEstaAbierta();
    await cartPage.expectCantidadDeItems(0);
    await cartPage.header.expectContador(0);
  });

  test('CART-02 un producto: nombre, descripcion, precio y cantidad 1', async ({ inventoryPage, cartPage }) => {
    const agregado = await inventoryPage.agregar(PRODUCTOS.mochila.nombre);
    await inventoryPage.header.expectContador(1);
    await inventoryPage.header.abrirCarrito();

    await cartPage.expectEstaAbierta();
    const items = await cartPage.leerItems();
    expect(items).toEqual([{ ...agregado, cantidad: 1 }]);
    expect(items[0].precio).toBe(PRODUCTOS.mochila.precio);
  });

  test('CART-03 varios productos: lista, precios y cantidades coinciden', async ({ inventoryPage, cartPage }) => {
    const seleccion = [PRODUCTOS.luzBici, PRODUCTOS.chaqueta, PRODUCTOS.camisetaRoja];
    const agregados = await inventoryPage.agregarVarios(seleccion.map((p) => p.nombre));
    await inventoryPage.header.expectContador(seleccion.length);
    await inventoryPage.header.abrirCarrito();

    const items = await cartPage.leerItems();
    // Mismo orden en que se agregaron.
    expect(items).toEqual(agregados.map((a) => ({ ...a, cantidad: 1 })));
    expect(items.map((i) => i.precio)).toEqual(seleccion.map((p) => p.precio));
    await cartPage.header.expectContador(seleccion.length);
  });

  test('CART-04 los 6 productos: el contador coincide con la suma de cantidades y el total con el catalogo', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.agregarVarios(TODOS_LOS_PRODUCTOS.map((p) => p.nombre));
    await inventoryPage.header.abrirCarrito();

    const items = await cartPage.leerItems();
    const sumaCantidades = items.reduce((acc, i) => acc + (i.cantidad ?? 0), 0);
    await cartPage.header.expectContador(sumaCantidades);
    expect(sumaCantidades).toBe(TODOS_LOS_PRODUCTOS.length);
    expect(sumaPrecios(items.map((i) => ({ nombre: i.nombre, precio: i.precio })))).toBe(
      sumaPrecios(TODOS_LOS_PRODUCTOS),
    );
  });

  test('CART-05 los precios del inventario coinciden con el catalogo esperado', async ({ inventoryPage }) => {
    const enPantalla = await inventoryPage.leerProductos();
    const mapa = Object.fromEntries(enPantalla.map((p) => [p.nombre, p.precio]));

    for (const p of TODOS_LOS_PRODUCTOS) {
      expect.soft(mapa[p.nombre], p.nombre).toBe(p.precio);
    }
  });

  test('CART-06 quitar un producto actualiza la lista y el contador', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.agregarVarios([PRODUCTOS.mochila.nombre, PRODUCTOS.body.nombre]);
    await inventoryPage.header.abrirCarrito();
    await cartPage.expectCantidadDeItems(2);

    await cartPage.quitar(PRODUCTOS.mochila.nombre);

    await cartPage.expectCantidadDeItems(1);
    await cartPage.header.expectContador(1);
    const items = await cartPage.leerItems();
    expect(items.map((i) => i.nombre)).toEqual([PRODUCTOS.body.nombre]);
  });

  test('CART-07 quitar todos deja el carrito vacio y sin contador', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.agregar(PRODUCTOS.camiseta.nombre);
    await inventoryPage.header.abrirCarrito();

    await cartPage.quitar(PRODUCTOS.camiseta.nombre);

    await cartPage.expectCantidadDeItems(0);
    await cartPage.header.expectContador(0);
  });

  test('CART-08 el carrito se conserva al recargar la pagina', async ({ inventoryPage, cartPage, page }) => {
    const agregados = await inventoryPage.agregarVarios([PRODUCTOS.luzBici.nombre, PRODUCTOS.body.nombre]);
    await inventoryPage.header.abrirCarrito();

    await page.reload();

    await cartPage.expectEstaAbierta();
    expect(await cartPage.leerItems()).toEqual(agregados.map((a) => ({ ...a, cantidad: 1 })));
    await cartPage.header.expectContador(2);
  });
});
