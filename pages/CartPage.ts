import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { DatosItem, ItemRow, filaPorNombre, leerTodas } from './components/ItemRow';

export class CartPage extends BasePage {
  protected readonly ruta = '/cart.html';
  readonly lista: Locator;
  readonly items: Locator;
  readonly botonContinuarComprando: Locator;
  readonly botonCheckout: Locator;

  constructor(page: Page) {
    super(page);
    this.lista = page.getByTestId('cart-list');
    this.items = this.lista.getByTestId('inventory-item');
    this.botonContinuarComprando = page.getByTestId('continue-shopping');
    this.botonCheckout = page.getByTestId('checkout');
  }

  async expectEstaAbierta() {
    await super.expectEstaAbierta('Your Cart');
  }

  item(nombre: string): ItemRow {
    return filaPorNombre(this.lista, nombre);
  }

  async leerItems(): Promise<DatosItem[]> {
    return leerTodas(this.lista);
  }

  async quitar(nombre: string) {
    await this.item(nombre).boton('Remove').click();
  }

  async continuarComprando() {
    await this.botonContinuarComprando.click();
  }

  async irACheckout() {
    await this.botonCheckout.click();
  }

  async expectCantidadDeItems(n: number) {
    await expect(this.items).toHaveCount(n);
  }

  /** Encabezados de la lista («QTY» / «Description»). */
  get etiquetaCantidad(): Locator {
    return this.page.getByTestId('cart-quantity-label');
  }

  get etiquetaDescripcion(): Locator {
    return this.page.getByTestId('cart-desc-label');
  }
}
