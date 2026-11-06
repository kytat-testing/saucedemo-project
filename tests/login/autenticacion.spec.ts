import { test } from '../../fixtures/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { USUARIOS } from '../../data/users';
import { CASOS_CREDENCIALES_INVALIDAS, MENSAJES_LOGIN } from '../../data/login';

/**
 * Login — Autenticación válida, inválida y usuario bloqueado.
 * Se usa el fixture `loginPage` (no `inventoryPage`) porque el login es lo que se prueba.
 */
test.describe('Login · Autenticación', { tag: '@login' }, () => {
  test('LOG-01 Login - standard_user con secret_sauce - ingresa al inventario (Products)', async ({ page, loginPage }) => {
    await loginPage.login(USUARIOS.estandar);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.expectEstaAbierta();
  });

  for (const caso of CASOS_CREDENCIALES_INVALIDAS) {
    test(`${caso.id} Login - ${caso.escenario} - muestra «${caso.mensaje}» y no ingresa`, async ({ loginPage }) => {
      await loginPage.login(caso.credenciales);

      await loginPage.expectError(caso.mensaje);
      await loginPage.expectEstaAbierta();
    });
  }

  test(`LOG-04 Login - locked_out_user con secret_sauce - muestra «${MENSAJES_LOGIN.usuarioBloqueado}» y no ingresa`, async ({
    loginPage,
  }) => {
    await loginPage.login(USUARIOS.bloqueado);

    await loginPage.expectError(MENSAJES_LOGIN.usuarioBloqueado);
    await loginPage.expectEstaAbierta();
  });
});
