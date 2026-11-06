import { test } from '../../fixtures/test';
import { PRODUCTOS } from '../../data/products';
import { DATOS_CHECKOUT } from '../../data/users';

/**
 * Checkout — Confirmación final del pedido, siguiendo el flujo completo:
 * login -> Add to cart -> ícono del carrito -> Checkout -> llenar datos ->
 * Continue -> Finish -> Back Home.
 */
test.describe('Checkout · Confirmación del pedido', { tag: '@checkout' }, () => {
  test('CONF-01 Checkout - llenar datos, Continue, Finish y Back Home - confirma el pedido y vuelve al inventario', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    // El fixture `inventoryPage` ya hizo el login con standard_user / secret_sauce.

    await test.step('1. Agregar 2 productos con "Add to cart"', async () => {
      await inventoryPage.agregarVarios([PRODUCTOS.mochila.nombre, PRODUCTOS.luzBici.nombre]);
      await inventoryPage.header.expectContador(2);
    });

    await test.step('2. Clic en el ícono del carrito -> /cart.html', async () => {
      await inventoryPage.header.abrirCarrito();
      await cartPage.expectEstaAbierta();
    });

    await test.step('3. Clic en "Checkout" -> /checkout-step-one.html', async () => {
      await cartPage.irACheckout();
      await checkoutInfoPage.expectEstaAbierta();
    });

    await test.step('4. Llenar First Name, Last Name y Zip y clic en "Continue" -> /checkout-step-two.html', async () => {
      await checkoutInfoPage.completar(DATOS_CHECKOUT);
      await checkoutOverviewPage.expectEstaAbierta();
    });

    await test.step('5. Clic en "Finish" -> /checkout-complete.html', async () => {
      await checkoutOverviewPage.finalizar();
      await checkoutCompletePage.expectConfirmacion();
    });

    await test.step('6. Clic en "Back Home" -> /inventory.html con el carrito vacío', async () => {
      await checkoutCompletePage.volverAlInicio();
      await inventoryPage.expectEstaAbierta();
      await inventoryPage.header.expectContador(0);
    });
  });
});
