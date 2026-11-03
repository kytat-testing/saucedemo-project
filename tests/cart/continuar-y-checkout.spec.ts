import { test, expect } from '../../fixtures/test';
import { PRODUCTOS, sumaPrecios } from '../../data/products';
import { DATOS_CHECKOUT } from '../../data/users';

/** Cart — Continue Shopping / Checkout. */
test.describe('Cart · Continue Shopping / Checkout', { tag: '@navegacion' }, () => {
  test('NAV-01 Continue Shopping vuelve al inventario conservando el carrito', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.agregarVarios([PRODUCTOS.mochila.nombre, PRODUCTOS.luzBici.nombre]);
    await inventoryPage.header.abrirCarrito();

    await cartPage.continuarComprando();

    await inventoryPage.expectEstaAbierta();
    await inventoryPage.header.expectContador(2);
    // Los productos del carrito siguen marcados como agregados.
    await expect(inventoryPage.producto(PRODUCTOS.mochila.nombre).boton('Remove')).toBeVisible();
    await expect(inventoryPage.producto(PRODUCTOS.luzBici.nombre).boton('Remove')).toBeVisible();
    await expect(inventoryPage.producto(PRODUCTOS.chaqueta.nombre).boton('Add to cart')).toBeVisible();
  });

  test('NAV-02 Continue Shopping con el carrito vacio vuelve al inventario', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.header.abrirCarrito();

    await cartPage.continuarComprando();

    await inventoryPage.expectEstaAbierta();
    await inventoryPage.header.expectContador(0);
  });

  test('NAV-03 seguir comprando y agregar otro producto suma al carrito existente', async ({
    inventoryPage,
    cartPage,
  }) => {
    const primero = await inventoryPage.agregar(PRODUCTOS.chaqueta.nombre);
    await inventoryPage.header.abrirCarrito();
    await cartPage.continuarComprando();

    const segundo = await inventoryPage.agregar(PRODUCTOS.body.nombre);
    await inventoryPage.header.expectContador(2);
    await inventoryPage.header.abrirCarrito();

    expect(await cartPage.leerItems()).toEqual([
      { ...primero, cantidad: 1 },
      { ...segundo, cantidad: 1 },
    ]);
  });

  test('NAV-04 Checkout lleva a "Checkout: Your Information"', async ({ inventoryPage, cartPage, checkoutInfoPage }) => {
    await inventoryPage.agregar(PRODUCTOS.mochila.nombre);
    await inventoryPage.header.abrirCarrito();

    await cartPage.irACheckout();

    await checkoutInfoPage.expectEstaAbierta();
    await expect(checkoutInfoPage.nombre).toBeVisible();
    await expect(checkoutInfoPage.apellido).toBeVisible();
    await expect(checkoutInfoPage.codigoPostal).toBeVisible();
  });

  test('NAV-05 Cancel en el checkout regresa al carrito sin perder productos', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
  }) => {
    const agregados = await inventoryPage.agregarVarios([PRODUCTOS.camiseta.nombre, PRODUCTOS.body.nombre]);
    await inventoryPage.header.abrirCarrito();
    await cartPage.irACheckout();

    await checkoutInfoPage.cancelar();

    await cartPage.expectEstaAbierta();
    expect(await cartPage.leerItems()).toEqual(agregados.map((a) => ({ ...a, cantidad: 1 })));
  });

  test('NAV-06 el resumen del checkout muestra los mismos productos, cantidades y el total correcto', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
  }) => {
    const seleccion = [PRODUCTOS.mochila, PRODUCTOS.chaqueta, PRODUCTOS.luzBici];
    await inventoryPage.agregarVarios(seleccion.map((p) => p.nombre));
    await inventoryPage.header.abrirCarrito();
    const enCarrito = await cartPage.leerItems();

    await cartPage.irACheckout();
    await checkoutInfoPage.completar(DATOS_CHECKOUT);

    await checkoutOverviewPage.expectEstaAbierta();
    expect(await checkoutOverviewPage.leerItems()).toEqual(enCarrito);

    const { subtotal, impuesto, total } = await checkoutOverviewPage.leerTotales();
    expect(subtotal).toBe(sumaPrecios(seleccion));
    expect(Math.round((subtotal + impuesto) * 100) / 100).toBe(total);
  });

  test('NAV-07 Checkout con el carrito vacio (comportamiento actual)', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
  }) => {
    test.info().annotations.push({
      type: 'observacion',
      description:
        'SauceDemo permite iniciar el checkout sin productos. Se fija el comportamiento actual; ' +
        'si el sitio empieza a bloquearlo, esta prueba fallara y avisara del cambio.',
    });
    await inventoryPage.header.abrirCarrito();
    await cartPage.expectCantidadDeItems(0);

    await cartPage.irACheckout();

    await checkoutInfoPage.expectEstaAbierta();
  });
});
