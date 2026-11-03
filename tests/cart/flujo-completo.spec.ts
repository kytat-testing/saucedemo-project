import { test, expect } from '../../fixtures/test';
import { PRODUCTOS, sumaPrecios } from '../../data/products';
import { USUARIOS } from '../../data/users';
import { InventoryPage } from '../../pages/InventoryPage';

/**
 * Cart — Flujo completo de punta a punta, con UN solo login.
 *
 * Complementa los casos independientes (CART-xx / NAV-xx): aqui se recorre la
 * plataforma como lo haria un usuario y se termina al llegar a
 * "Checkout: Your Information", sin llenar el formulario.
 */
test.describe('Cart · Flujo completo', { tag: '@e2e' }, () => {
  test('E2E-01 login, carrito, Continue Shopping y Checkout en un solo recorrido', async ({
    page,
    loginPage,
    cartPage,
    checkoutInfoPage,
  }) => {
    const inventoryPage = new InventoryPage(page);
    const primeros = [PRODUCTOS.mochila, PRODUCTOS.luzBici];
    const todos = [...primeros, PRODUCTOS.chaqueta];

    await test.step('1. Login', async () => {
      await loginPage.login(USUARIOS.estandar);
      await inventoryPage.expectEstaAbierta();
      await inventoryPage.header.expectContador(0);
    });

    const agregados = await test.step('2. Agregar productos y verificar el contador', async () => {
      const datos = await inventoryPage.agregarVarios(primeros.map((p) => p.nombre));
      await inventoryPage.header.expectContador(primeros.length);
      return datos;
    });

    await test.step('3. Abrir el carrito y verificar productos, cantidades y precios', async () => {
      await inventoryPage.header.abrirCarrito();
      await cartPage.expectEstaAbierta();

      const items = await cartPage.leerItems();
      expect(items).toEqual(agregados.map((a) => ({ ...a, cantidad: 1 })));
      expect(items.map((i) => i.precio)).toEqual(primeros.map((p) => p.precio));
      expect(sumaPrecios(items)).toBe(sumaPrecios(primeros));
    });

    const otro = await test.step('4. Continue Shopping y agregar otro producto', async () => {
      await cartPage.continuarComprando();
      await inventoryPage.expectEstaAbierta();
      await inventoryPage.header.expectContador(primeros.length);

      const datos = await inventoryPage.agregar(PRODUCTOS.chaqueta.nombre);
      await inventoryPage.header.expectContador(todos.length);
      return datos;
    });

    await test.step('5. Volver al carrito y verificar el total actualizado', async () => {
      await inventoryPage.header.abrirCarrito();
      await cartPage.expectEstaAbierta();

      const items = await cartPage.leerItems();
      expect(items).toEqual([...agregados, otro].map((a) => ({ ...a, cantidad: 1 })));
      expect(sumaPrecios(items)).toBe(sumaPrecios(todos));
    });

    await test.step('6. Checkout lleva a "Checkout: Your Information"', async () => {
      await cartPage.irACheckout();
      await checkoutInfoPage.expectEstaAbierta();
      // Solo se llega a la vista; el formulario se deja sin llenar.
      await expect(checkoutInfoPage.nombre).toBeEmpty();
      await expect(checkoutInfoPage.apellido).toBeEmpty();
      await expect(checkoutInfoPage.codigoPostal).toBeEmpty();
    });
  });
});
