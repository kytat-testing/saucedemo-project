import { test, expect } from '../../fixtures/test';
import { COPY, INVENTARIO, precioEnPantalla } from '../../data/inventory';
import { leerCarrito } from '../../utils/carrito-storage';
import { evidencia } from '../../utils/evidencia';

/**
 * Inventory — Contador del carrito (icono superior derecho): persistencia y coherencia.
 * Matriz: docs/inventario/PLAN.json (TC-08 a TC-13) · PRD: docs/inventario/PRD.md
 *
 * `/cart.html` y el detalle se usan SOLO para contrastar el contador.
 * TC-12 y TC-13 llevan @defecto-conocido: esperan el comportamiento correcto
 * y por eso FALLAN mientras el defecto exista (no se usa test.fail()).
 */
test.describe('Inventory · Contador del carrito', { tag: '@inventario' }, () => {
  test.beforeEach(async ({ page, inventoryPage }) => {
    await expect(inventoryPage.botonesAgregar, 'precondicion: los 6 en «Add to cart»').toHaveCount(6);
    expect((await leerCarrito(page)).ids, 'precondicion: cart-contents vacio').toEqual([]);
  });

  test('TC-08 El contador persiste tras page.reload() y al volver a entrar', async ({ page, inventoryPage }, testInfo) => {
    const enCarrito = [INVENTARIO.luzBici, INVENTARIO.camisetaRoja];

    await test.step('precondicion: 2 productos (contador «2»)', async () => {
      await inventoryPage.agregarVarios(enCarrito.map((p) => p.nombre));
      await inventoryPage.header.expectContador(2);
    });

    await test.step('[CTRL] page.reload() real → contador «2» y los mismos 2 en «Remove»', async () => {
      await inventoryPage.recargar();
      await inventoryPage.header.expectContador(2);
      for (const p of enCarrito) await inventoryPage.expectEnCarrito(p);
    });

    await test.step('[NEG] la recarga no agrega ni revive otros productos', async () => {
      await expect(inventoryPage.botonesRemover).toHaveCount(2);
      expect((await leerCarrito(page)).crudo).toBe(JSON.stringify(enCarrito.map((p) => p.itemId)));
    });

    await test.step('[CTRL] volver a navegar a /inventory.html conserva el estado', async () => {
      await inventoryPage.abrir();
      await inventoryPage.expectEstaAbierta();
      await inventoryPage.header.expectContador(2);
      await expect(inventoryPage.botonesRemover).toHaveCount(2);
    });

    await evidencia(page, testInfo, 'TC-08_persistencia_reload');
  });

  test('TC-09 Coherencia: el contador es igual a las filas de /cart.html y se conserva al volver', async ({ page, inventoryPage, cartPage }, testInfo) => {
    const enCarrito = [INVENTARIO.luzBici, INVENTARIO.camisetaRoja];

    await test.step('precondicion: 2 productos (contador «2»)', async () => {
      await inventoryPage.agregarVarios(enCarrito.map((p) => p.nombre));
      await inventoryPage.header.expectContador(2);
    });

    await test.step('[CTRL] clic fisico en el icono del carrito → /cart.html en la misma pestana', async () => {
      await inventoryPage.header.abrirCarrito();
      await cartPage.expectEstaAbierta();
    });

    await test.step('filas = contador = 2, con nombre, precio y QTY «1»', async () => {
      await cartPage.expectCantidadDeItems(2);
      await cartPage.header.expectContador(2);
      for (const p of enCarrito) {
        const fila = cartPage.item(p.nombre);
        await expect(fila.raiz).toHaveCount(1);
        await expect(fila.precio).toHaveText(precioEnPantalla(p));
        await expect(fila.cantidad).toHaveText('1');
      }
    });

    await test.step('[NEG] no aparecen productos que no se agregaron', async () => {
      const nombres = (await cartPage.leerItems()).map((i) => i.nombre);
      expect(nombres.sort()).toEqual(enCarrito.map((p) => p.nombre).sort());
    });

    await test.step('[COPY] encabezados «QTY» y «Description»', async () => {
      await expect(cartPage.etiquetaCantidad).toHaveText(COPY.cartQty);
      await expect(cartPage.etiquetaDescripcion).toHaveText(COPY.cartDesc);
    });

    await evidencia(page, testInfo, 'TC-09_cart_2_filas');

    await test.step('[CTRL] «Continue Shopping» → inventario con contador «2» y los mismos «Remove»', async () => {
      await cartPage.continuarComprando();
      await inventoryPage.expectEstaAbierta();
      await inventoryPage.header.expectContador(2);
      for (const p of enCarrito) await inventoryPage.expectEnCarrito(p);
      await expect(inventoryPage.botonesRemover).toHaveCount(2);
    });

    await evidencia(page, testInfo, 'TC-09_continue_shopping');
  });

  test('TC-10 Remover desde /cart.html baja el contador y se refleja en el inventario', async ({ page, inventoryPage, cartPage }, testInfo) => {
    const sale = INVENTARIO.luzBici;
    const queda = INVENTARIO.camisetaRoja;

    await test.step('precondicion: 2 productos y entrar al carrito', async () => {
      await inventoryPage.agregarVarios([sale.nombre, queda.nombre]);
      await inventoryPage.header.abrirCarrito();
      await cartPage.expectEstaAbierta();
      await cartPage.expectCantidadDeItems(2);
    });

    await test.step('[CTRL] «Remove» de Bike Light en el carrito → 1 fila, contador «1», storage [3]', async () => {
      await cartPage.quitar(sale.nombre);
      // La fila removida deja un div.removed_cart_item vacio y sin data-test: no cuenta.
      await cartPage.expectCantidadDeItems(1);
      await cartPage.header.expectContador(1);
      expect((await leerCarrito(page)).ids).toEqual([queda.itemId]);
    });

    await test.step('volver: Bike Light en «Add to cart», la camiseta roja sigue en «Remove»', async () => {
      await cartPage.continuarComprando();
      await inventoryPage.expectFueraDelCarrito(sale);
      await inventoryPage.expectEnCarrito(queda);
      await inventoryPage.header.expectContador(1);
    });

    await evidencia(page, testInfo, 'TC-10_remove_desde_cart');

    await test.step('[BORDE] remover la ultima fila → 0 filas y sin contador', async () => {
      await inventoryPage.header.abrirCarrito();
      await cartPage.quitar(queda.nombre);
      await cartPage.expectCantidadDeItems(0);
      await cartPage.header.expectContador(0);
    });

    await test.step('[NEG] al volver, los 6 en «Add to cart» (ninguno queda desfasado)', async () => {
      await cartPage.continuarComprando();
      await expect(inventoryPage.botonesAgregar).toHaveCount(6);
      await expect(inventoryPage.botonesRemover).toHaveCount(0);
      await inventoryPage.header.expectContador(0);
    });

    await evidencia(page, testInfo, 'TC-10_cart_vacio');
  });

  test('TC-11 Agregar/remover desde el detalle mueve el mismo contador', async ({ page, inventoryPage, productDetailPage: detalle }, testInfo) => {
    const previo = INVENTARIO.camisetaRoja;
    const nuevo = INVENTARIO.mochila;

    await test.step('precondicion: la camiseta roja en el carrito (contador «1»)', async () => {
      await inventoryPage.agregar(previo.nombre);
      await inventoryPage.header.expectContador(1);
    });

    await test.step('[CTRL] entrar al detalle de Backpack por el titulo', async () => {
      await inventoryPage.abrirDetalle(nuevo);
      await detalle.expectEstaAbierta();
      await expect(detalle.nombre).toHaveText(nuevo.nombre);
      await expect(detalle.precio).toHaveText(precioEnPantalla(nuevo));
    });

    await test.step('[NEG] en el detalle NO existen los botones con slug del inventario', async () => {
      await expect(detalle.botonesConSlug(nuevo)).toHaveCount(0);
      await expect(detalle.botonRemover).toHaveCount(0);
    });

    await test.step('[CTRL][COPY] «Add to cart» del detalle → contador «2», boton «Remove»', async () => {
      await expect(detalle.botonAgregar).toHaveText(COPY.agregar);
      await detalle.botonAgregar.click();
      await detalle.header.expectContador(2);
      await expect(detalle.botonRemover).toHaveText(COPY.remover);
      await expect(detalle.botonAgregar).toHaveCount(0);
      expect((await leerCarrito(page)).ids).toEqual([previo.itemId, nuevo.itemId]);
    });

    await test.step('volver: Backpack en «Remove» y contador «2» en el inventario', async () => {
      await detalle.volverAlInventario();
      await inventoryPage.expectEnCarrito(nuevo);
      await inventoryPage.header.expectContador(2);
    });

    await evidencia(page, testInfo, 'TC-11_detalle_add');

    await test.step('[CTRL] detalle de la camiseta roja (ya en el carrito) abre con «Remove»; clic → contador «1»', async () => {
      await inventoryPage.abrirDetalle(previo);
      await detalle.expectEstaAbierta();
      await expect(detalle.botonRemover).toHaveText(COPY.remover);
      await detalle.botonRemover.click();
      await detalle.header.expectContador(1);
      await expect(detalle.botonAgregar).toHaveText(COPY.agregar);
    });

    await test.step('volver: camiseta roja en «Add to cart», Backpack sigue en «Remove»', async () => {
      await detalle.volverAlInventario();
      await inventoryPage.expectFueraDelCarrito(previo);
      await inventoryPage.expectEnCarrito(nuevo);
      await inventoryPage.header.expectContador(1);
      expect((await leerCarrito(page)).ids).toEqual([nuevo.itemId]);
    });

    await evidencia(page, testInfo, 'TC-11_detalle_remove');
  });

  test('TC-12 @defecto-conocido aria-label del icono: «Cart, empty» / «Cart, N items» / «Cart, 1 item»', async ({ page, inventoryPage }, testInfo) => {
    const { header } = inventoryPage;
    testInfo.annotations.push({
      type: 'defecto-conocido',
      description: 'Con 1 producto la app dice «Cart, 1 items». Severidad baja (copy/accesibilidad). Este TC espera «Cart, 1 item» y FALLA mientras el defecto exista.',
    });

    await test.step('[COPY] vacio → «Cart, empty»', async () => {
      await header.expectAriaLabel(COPY.aria(0));
    });

    await test.step('[COPY] 2 productos → «Cart, 2 items»', async () => {
      await inventoryPage.agregarVarios([INVENTARIO.body.nombre, INVENTARIO.chaqueta.nombre]);
      await header.expectContador(2);
      await header.expectAriaLabel(COPY.aria(2));
    });

    await test.step('[BORDE][COPY] 1 producto → singular «Cart, 1 item»', async () => {
      await inventoryPage.quitar(INVENTARIO.chaqueta.nombre);
      await header.expectContador(1);
      await evidencia(page, testInfo, 'TC-12_aria_1_producto');
      testInfo.annotations.push({ type: 'aria-label-observado', description: String(await header.ariaLabel()) });
      await header.expectAriaLabel(COPY.aria(1));
    });
  });

  test('TC-13 @defecto-conocido El icono del carrito muestra cursor pointer (Guia GDD-DDS-G-03)', async ({ page, inventoryPage, cartPage }, testInfo) => {
    const { header } = inventoryPage;
    testInfo.annotations.push({
      type: 'defecto-conocido',
      description: 'a.shopping_cart_link tiene cursor:auto. Severidad baja. Este TC espera "pointer" y FALLA mientras el defecto exista.',
    });

    // El enlace NO trae atributo tabindex ni href: no entra al orden de tabulacion (fuera de alcance).
    await test.step('[CTRL] el icono es accionable: role="button" y el clic lleva a /cart.html', async () => {
      await expect(header.enlaceCarrito).toHaveAttribute('role', 'button');
      await header.abrirCarrito();
      await cartPage.expectEstaAbierta();
      await cartPage.continuarComprando();
      await inventoryPage.expectEstaAbierta();
    });

    await test.step('[NEG] cursor computado del enlace debe ser «pointer»', async () => {
      await header.enlaceCarrito.hover();
      await evidencia(page, testInfo, 'TC-13_cursor_icono');
      const cursor = await header.cursor();
      testInfo.annotations.push({ type: 'cursor-observado', description: cursor });
      expect(cursor, 'Guia GDD-DDS-G-03: todo elemento clickeable debe tener cursor: pointer').toBe('pointer');
    });
  });
});
