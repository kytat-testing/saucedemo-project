import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Checkout paso 1: "Checkout: Your Information". */
export class CheckoutInformationPage extends BasePage {
  protected readonly ruta = '/checkout-step-one.html';
  readonly nombre: Locator;
  readonly apellido: Locator;
  readonly codigoPostal: Locator;
  readonly botonContinuar: Locator;
  readonly botonCancelar: Locator;

  constructor(page: Page) {
    super(page);
    this.nombre = page.getByTestId('firstName');
    this.apellido = page.getByTestId('lastName');
    this.codigoPostal = page.getByTestId('postalCode');
    this.botonContinuar = page.getByTestId('continue');
    this.botonCancelar = page.getByTestId('cancel');
  }

  async expectEstaAbierta() {
    await super.expectEstaAbierta('Checkout: Your Information');
  }

  async completar(datos: { firstName: string; lastName: string; postalCode: string }) {
    await this.nombre.fill(datos.firstName);
    await this.apellido.fill(datos.lastName);
    await this.codigoPostal.fill(datos.postalCode);
    await this.botonContinuar.click();
  }

  async cancelar() {
    await this.botonCancelar.click();
  }
}
