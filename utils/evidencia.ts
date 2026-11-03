import type { Page, TestInfo } from '@playwright/test';
import { leerCarrito } from './carrito-storage';

/**
 * Adjunta al reporte una captura de la pagina y el estado de
 * `localStorage['cart-contents']` en ese punto. El veredicto sale de los
 * `expect`; esto es la evidencia que lee el Reporter.
 */
export async function evidencia(page: Page, testInfo: TestInfo, nombre: string): Promise<void> {
  await testInfo.attach(`${nombre}.png`, {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
  const storage = await leerCarrito(page).catch(() => null);
  await testInfo.attach(`${nombre}.cart-contents.json`, {
    body: JSON.stringify({ url: page.url(), storage }, null, 2),
    contentType: 'application/json',
  });
}
