import { test } from '../../fixtures/test';
import { CASOS_CAMPOS_VACIOS, CASOS_CREDENCIALES_INVALIDAS } from '../../data/login';

/**
 * Login — Validación de campos vacíos y contenedor de error.
 * Cada error debe verse en `.error-message-container` > `[data-test="error"]`
 * y desaparecer al pulsar `[data-test="error-button"]`.
 */
test.describe('Login · Campos vacíos y contenedor de error', { tag: '@login' }, () => {
  for (const caso of CASOS_CAMPOS_VACIOS) {
    test(`${caso.id} Login - ${caso.escenario} - muestra «${caso.mensaje}» y no ingresa`, async ({ loginPage }) => {
      await loginPage.login(caso.credenciales);

      await loginPage.expectError(caso.mensaje);
      await loginPage.expectEstaAbierta();
    });
  }

  test('LOG-08 Login - cerrar el contenedor de error - el mensaje deja de mostrarse', async ({ loginPage }) => {
    const caso = CASOS_CREDENCIALES_INVALIDAS[0];

    await test.step('precondición: login fallido muestra el error', async () => {
      await loginPage.login(caso.credenciales);
      await loginPage.expectError(caso.mensaje);
    });

    await test.step('clic en la X del contenedor → el error ya no se muestra', async () => {
      await loginPage.cerrarError();
      await loginPage.expectSinError();
      await loginPage.expectEstaAbierta();
    });
  });
});
