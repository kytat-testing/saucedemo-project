import { Locator, Page, expect } from '@playwright/test';

/** Cabecera comun a todas las pantallas internas (icono y contador del carrito). */
export class HeaderComponent {
  readonly enlaceCarrito: Locator;
  readonly contadorCarrito: Locator;

  constructor(page: Page) {
    this.enlaceCarrito = page.getByTestId('shopping-cart-link');
    this.contadorCarrito = page.getByTestId('shopping-cart-badge');
  }

  async abrirCarrito() {
    await this.enlaceCarrito.click();
  }

  /** Con 0 productos SauceDemo no pinta el contador: se exige que no exista. */
  async expectContador(cantidad: number) {
    if (cantidad === 0) {
      await expect(this.contadorCarrito).toHaveCount(0);
    } else {
      await expect(this.contadorCarrito).toHaveText(String(cantidad));
    }
  }

  /** Lectura del contador (0 si no existe). */
  async contador(): Promise<number> {
    if ((await this.contadorCarrito.count()) === 0) return 0;
    return Number((await this.contadorCarrito.innerText()).trim());
  }

  /**
   * aria-label del enlace: «Cart, empty» / «Cart, N items». El enlace no tiene
   * texto, id ni href y su rol es "button": solo se encuentra por data-test.
   */
  async ariaLabel(): Promise<string | null> {
    return this.enlaceCarrito.getAttribute('aria-label');
  }

  async expectAriaLabel(texto: string) {
    await expect(this.enlaceCarrito).toHaveAttribute('aria-label', texto);
  }

  /** `cursor` computado del enlace (hoy devuelve "auto"; la guia pide "pointer"). */
  async cursor(): Promise<string> {
    return this.enlaceCarrito.evaluate((el) => getComputedStyle(el).cursor);
  }
}
