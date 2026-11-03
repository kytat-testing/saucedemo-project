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
}
