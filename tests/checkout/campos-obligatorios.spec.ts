import { test } from '../../fixtures/test';
import { PRODUCTOS } from '../../data/products';
import { CASOS_OBLIGATORIOS } from '../../data/checkout';

/**
 * Checkout — Validación de campos obligatorios (First Name, Last Name, Zip/Postal Code).
 * Precondición: login con standard_user, 1 producto agregado, ícono del carrito
 * (/cart.html) y Checkout (/checkout-step-one.html).
 */
test.describe('Checkout · Campos obligatorios', { tag: '@checkout' }, () => {
  test.beforeEach(async ({ inventoryPage, cartPage, checkoutInfoPage }) => {
    await inventoryPage.agregar(PRODUCTOS.mochila.nombre);
    await inventoryPage.header.abrirCarrito();
    await cartPage.expectEstaAbierta();
    await cartPage.irACheckout();
    await checkoutInfoPage.expectEstaAbierta();
  });

  for (const caso of CASOS_OBLIGATORIOS) {
    test(`${caso.id} Checkout - ${caso.escenario} - muestra «${caso.mensaje}» y no avanza`, async ({
      checkoutInfoPage,
    }) => {
      await checkoutInfoPage.completar(caso.datos);

      await checkoutInfoPage.expectError(caso.mensaje);
      await checkoutInfoPage.expectEstaAbierta();
    });
  }
});
