import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import type { DatosCheckout } from '../data/checkout';

/** Checkout paso 1: "Checkout: Your Information". */
export class CheckoutInformationPage extends BasePage {
  protected readonly ruta = '/checkout-step-one.html';
  readonly nombre: Locator;
  readonly apellido: Locator;
  readonly codigoPostal: Locator;
  readonly botonContinuar: Locator;
  readonly botonCancelar: Locator;
  readonly mensajeError: Locator;

  constructor(page: Page) {
    super(page);
    this.nombre = page.getByTestId('firstName');
    this.apellido = page.getByTestId('lastName');
    this.codigoPostal = page.getByTestId('postalCode');
    this.botonContinuar = page.getByTestId('continue');
    this.botonCancelar = page.getByTestId('cancel');
    this.mensajeError = page.getByTestId('error');
  }

  async expectEstaAbierta() {
    await super.expectEstaAbierta('Checkout: Your Information');
  }

  async completar(datos: DatosCheckout) {
    await this.nombre.fill(datos.firstName);
    await this.apellido.fill(datos.lastName);
    await this.codigoPostal.fill(datos.postalCode);
    await this.botonContinuar.click();
  }

  async cancelar() {
    await this.botonCancelar.click();
  }

  async expectError(mensaje: string) {
    await expect(this.mensajeError).toHaveText(mensaje);
  }
}
