import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { DatosItem, leerTodas } from './components/ItemRow';
import { parsePrecio } from '../utils/precio';

/** Checkout paso 2: "Checkout: Overview". */
export class CheckoutOverviewPage extends BasePage {
  protected readonly ruta = '/checkout-step-two.html';
  readonly lista: Locator;
  readonly subtotal: Locator;
  readonly impuesto: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    super(page);
    this.lista = page.getByTestId('cart-list');
    this.subtotal = page.getByTestId('subtotal-label');
    this.impuesto = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
  }

  async expectEstaAbierta() {
    await super.expectEstaAbierta('Checkout: Overview');
  }

  async leerItems(): Promise<DatosItem[]> {
    return leerTodas(this.lista);
  }

  async leerTotales() {
    return {
      subtotal: parsePrecio(await this.subtotal.innerText()),
      impuesto: parsePrecio(await this.impuesto.innerText()),
      total: parsePrecio(await this.total.innerText()),
    };
  }
}
