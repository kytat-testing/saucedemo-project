import type { Page } from '@playwright/test';

/**
 * El carrito de SauceDemo vive en `localStorage['cart-contents']` (PRD P-5):
 * string JSON con un array de itemId NUMERICOS en orden de insercion, p. ej. "[0,3]".
 *
 * Trampa 11 (PRD §10): «vacio» tiene DOS representaciones:
 *   - `null`  → sesion nueva o tras Reset App State
 *   - `"[]"`  → tras remover todo a mano
 * `leerCarrito` normaliza ambas a `ids: []` y conserva el crudo para la evidencia.
 */
export const CLAVE_CARRITO = 'cart-contents';

export interface EstadoStorage {
  crudo: string | null;
  ids: number[];
}

export async function leerCarrito(page: Page): Promise<EstadoStorage> {
  const crudo = await page.evaluate((k) => localStorage.getItem(k), CLAVE_CARRITO);
  const ids = crudo ? (JSON.parse(crudo) as number[]) : [];
  return { crudo, ids };
}

/**
 * Aislamiento (trampa 7): se borra la clave ANTES de recargar. NO se usa
 * Reset App State: borra la clave pero deja los botones en «Remove» hasta
 * el siguiente render (PRD P-R), y el test arrancaria desfasado.
 */
export async function vaciarCarritoStorage(page: Page): Promise<void> {
  await page.evaluate((k) => localStorage.removeItem(k), CLAVE_CARRITO);
}

