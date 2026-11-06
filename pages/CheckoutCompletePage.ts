import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CONFIRMACION } from '../data/checkout';

/** Checkout paso final: "Checkout: Complete!". */
export class CheckoutCompletePage extends BasePage {
  protected readonly ruta = '/checkout-complete.html';
  readonly encabezado: Locator;
  readonly botonVolver: Locator;

  constructor(page: Page) {
    super(page);
    this.encabezado = page.getByTestId('complete-header');
    this.botonVolver = page.getByTestId('back-to-products');
  }

  async expectConfirmacion() {
    await this.expectEstaAbierta(CONFIRMACION.titulo);
    await expect(this.encabezado).toHaveText(CONFIRMACION.encabezado);
  }

  async volverAlInicio() {
    await this.botonVolver.click();
  }
}
