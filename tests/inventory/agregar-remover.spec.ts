import { test, expect } from '../../fixtures/test';
import { COPY, INVENTARIO, TODO_EL_INVENTARIO, precioEnPantalla } from '../../data/inventory';
import { leerCarrito } from '../../utils/carrito-storage';
import { evidencia } from '../../utils/evidencia';

/**
 * Inventory — Agregar y remover productos (individual y multiple).
 * Matriz: docs/inventario/PLAN.json (TC-01 a TC-07) · PRD: docs/inventario/PRD.md
 *
 * Cada TC lleva sus checks de profundidad como `test.step` con prefijo:
 * [NEG] negativo, [CTRL] control ejercido, [BORDE] limite, [COPY] textos.
 */
test.describe('Inventory · Agregar y remover productos', { tag: '@inventario' }, () => {
  // `inventoryPage` ya llega con sesion y contador en 0; se afirma ademas el resto
  // de la precondicion para que un arranque sucio no se confunda con un fallo del caso.
  test.beforeEach(async ({ page, inventoryPage }) => {
    await expect(inventoryPage.botonesRemover, 'precondicion: ningun producto en «Remove»').toHaveCount(0);
    await expect(inventoryPage.botonesAgregar, 'precondicion: los 6 en «Add to cart»').toHaveCount(6);
    expect((await leerCarrito(page)).ids, 'precondicion: cart-contents vacio').toEqual([]);
  });

  test('TC-01 Estado inicial: sin contador, 6 «Add to cart» y catalogo completo', async ({ page, inventoryPage }, testInfo) => {
    const { header } = inventoryPage;

    await test.step('[BORDE] 0 productos: el contador no existe en el DOM (no «0»)', async () => {
      await header.expectContador(0);
      expect(await header.contador()).toBe(0);
    });

    await test.step('[COPY] titulo, aria-label vacio y catalogo (nombre, precio, boton)', async () => {
      await expect(inventoryPage.titulo).toHaveText(COPY.tituloInventario);
      await header.expectAriaLabel(COPY.aria(0));
      await expect(inventoryPage.lista.getByTestId('inventory-item')).toHaveCount(TODO_EL_INVENTARIO.length);
      for (const p of TODO_EL_INVENTARIO) {
        const fila = inventoryPage.producto(p.nombre);
        await expect(fila.raiz, `tarjeta de «${p.nombre}»`).toHaveCount(1);
        await expect(fila.precio).toHaveText(precioEnPantalla(p));
        await expect(inventoryPage.btnAgregar(p)).toHaveText(COPY.agregar);
      }
    });

    await evidencia(page, testInfo, 'TC-01_estado_inicial');
  });

  test('TC-02 Agregar 1 producto: contador «1» y el boton pasa a «Remove»', async ({ page, inventoryPage }, testInfo) => {
    const p = INVENTARIO.mochila;

    await test.step('[CTRL] clic en «Add to cart» de Backpack', async () => {
      await inventoryPage.agregar(p.nombre);
    });

    await test.step('contador «1» y storage [4]', async () => {
      await inventoryPage.header.expectContador(1);
      expect((await leerCarrito(page)).ids).toEqual([p.itemId]);
    });

    await test.step('[NEG] solo ese producto cambio: los otros 5 siguen en «Add to cart»', async () => {
      await expect(inventoryPage.botonesRemover).toHaveCount(1);
      for (const otro of TODO_EL_INVENTARIO.filter((x) => x !== p)) await inventoryPage.expectFueraDelCarrito(otro);
    });

    await test.step('[COPY] el boton dice exactamente «Remove»', async () => {
      await expect(inventoryPage.btnRemover(p)).toHaveText(COPY.remover);
    });

    await evidencia(page, testInfo, 'TC-02_agregar_1');
  });

  test('TC-03 Agregar 2 productos (incluye el slug con «.» y «()»): contador «2»', async ({ page, inventoryPage }, testInfo) => {
    const a = INVENTARIO.luzBici;
    const b = INVENTARIO.camisetaRoja; // slug test.allthethings()-t-shirt-(red)

    await test.step('[CTRL] agregar Bike Light → contador «1»', async () => {
      await inventoryPage.agregar(a.nombre);
      await inventoryPage.header.expectContador(1);
    });

    await test.step('[BORDE] agregar la camiseta roja (slug con caracteres especiales) → contador «2»', async () => {
      await inventoryPage.agregar(b.nombre);
      await inventoryPage.header.expectContador(2);
      await inventoryPage.expectEnCarrito(b);
    });

    await test.step('[NEG] storage en orden de insercion y sin duplicados; los otros 4 intactos', async () => {
      expect((await leerCarrito(page)).ids).toEqual([a.itemId, b.itemId]);
      await expect(inventoryPage.botonesRemover).toHaveCount(2);
      await expect(inventoryPage.botonesAgregar).toHaveCount(4);
    });

    await evidencia(page, testInfo, 'TC-03_agregar_2');
  });

  test('TC-04 Agregar los 6: el contador sube de a uno hasta «6»', async ({ page, inventoryPage }, testInfo) => {
    await test.step('[CTRL] agregar los 6, uno por uno, verificando el contador en cada paso', async () => {
      for (const [i, p] of TODO_EL_INVENTARIO.entries()) {
        await inventoryPage.agregar(p.nombre);
        await inventoryPage.header.expectContador(i + 1);
      }
    });

    await test.step('[BORDE] tope: 6 en «Remove», 0 en «Add to cart», contador «6»', async () => {
      await inventoryPage.header.expectContador(6);
      await expect(inventoryPage.botonesRemover).toHaveCount(6);
      await expect(inventoryPage.botonesAgregar).toHaveCount(0);
    });

    await test.step('[NEG] storage con los 6 itemId, sin duplicados', async () => {
      const { ids } = await leerCarrito(page);
      expect(ids).toHaveLength(6);
      expect(new Set(ids).size).toBe(6);
      expect([...ids].sort()).toEqual(TODO_EL_INVENTARIO.map((p) => p.itemId).sort());
    });

    await test.step('[COPY] los 6 botones dicen «Remove»', async () => {
      for (const p of TODO_EL_INVENTARIO) await expect(inventoryPage.btnRemover(p)).toHaveText(COPY.remover);
    });

    await evidencia(page, testInfo, 'TC-04_agregar_6');
  });

  test('TC-05 Remover 1 de varios: contador N-1 y el boton vuelve a «Add to cart»', async ({ page, inventoryPage }, testInfo) => {
    const quedan = [INVENTARIO.mochila, INVENTARIO.chaqueta];
    const sale = INVENTARIO.body;

    await test.step('precondicion: 3 productos en el carrito (contador «3»)', async () => {
      await inventoryPage.agregarVarios([...quedan, sale].map((p) => p.nombre));
      await inventoryPage.header.expectContador(3);
    });

    await test.step('[CTRL] clic en «Remove» de Onesie → contador «2»', async () => {
      await inventoryPage.quitar(sale.nombre);
      await inventoryPage.header.expectContador(2);
    });

    await test.step('[COPY] Onesie vuelve a «Add to cart» (data-test add-to-cart-<slug>)', async () => {
      await expect(inventoryPage.btnAgregar(sale)).toHaveText(COPY.agregar);
    });

    await test.step('[NEG] los que quedan siguen en «Remove» y el storage ya no tiene el id 2', async () => {
      for (const p of quedan) await inventoryPage.expectEnCarrito(p);
      expect((await leerCarrito(page)).ids).toEqual(quedan.map((p) => p.itemId));
    });

    await evidencia(page, testInfo, 'TC-05_remover_1_de_3');
  });

  test('TC-06 Remover todos: el contador desaparece del DOM (no queda «0»)', async ({ page, inventoryPage }, testInfo) => {
    const items = [INVENTARIO.camiseta, INVENTARIO.luzBici, INVENTARIO.camisetaRoja];

    await test.step('precondicion: 3 productos (contador «3»)', async () => {
      await inventoryPage.agregarVarios(items.map((p) => p.nombre));
      await inventoryPage.header.expectContador(3);
    });

    await test.step('[CTRL] remover de a uno: 2 → 1 → sin contador', async () => {
      for (const [i, p] of items.entries()) {
        await inventoryPage.quitar(p.nombre);
        await inventoryPage.header.expectContador(items.length - i - 1);
      }
    });

    await test.step('[BORDE] con 0 el contador no existe y el enlace queda «Cart, empty»', async () => {
      await inventoryPage.header.expectContador(0);
      await inventoryPage.header.expectAriaLabel(COPY.aria(0));
    });

    await test.step('[NEG] storage vacio (acepta "[]" o null) y los 6 en «Add to cart»', async () => {
      const { crudo, ids } = await leerCarrito(page);
      expect(ids).toEqual([]);
      expect([null, '[]']).toContain(crudo);
      await expect(inventoryPage.botonesAgregar).toHaveCount(6);
      await expect(inventoryPage.botonesRemover).toHaveCount(0);
    });

    await evidencia(page, testInfo, 'TC-06_remover_todos');
  });

  test('TC-07 Clics rapidos repetidos alternan el estado y no duplican el conteo', async ({ page, inventoryPage }, testInfo) => {
    const p = INVENTARIO.camiseta;

    await test.step('[NEG] 2 clics seguidos: agrega y quita → sin contador, storage vacio', async () => {
      await inventoryPage.clicsSeguidos(p.nombre, 2);
      await inventoryPage.header.expectContador(0);
      await inventoryPage.expectFueraDelCarrito(p);
      expect((await leerCarrito(page)).ids).toEqual([]);
    });

    await test.step('[NEG] 3 clics seguidos → contador «1», storage [1] (sin ids repetidos)', async () => {
      await inventoryPage.clicsSeguidos(p.nombre, 3);
      await inventoryPage.header.expectContador(1);
      await inventoryPage.expectEnCarrito(p);
      expect((await leerCarrito(page)).ids).toEqual([p.itemId]);
    });

    await test.step('[BORDE] doble clic nativo: dos alternancias → sigue en «1», sin duplicar', async () => {
      await inventoryPage.dobleClic(p.nombre);
      await inventoryPage.header.expectContador(1);
      await inventoryPage.expectEnCarrito(p);
      expect((await leerCarrito(page)).ids).toEqual([p.itemId]);
    });

    await evidencia(page, testInfo, 'TC-07_clics_rapidos');
  });
});
