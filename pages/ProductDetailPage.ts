import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import type { ProductoInventario } from '../data/inventory';

/**
 * Detalle del producto (`/inventory-item.html?id=N`).
 *
 * Aqui los botones son GENERICOS (`add-to-cart` / `remove`, sin slug), distintos
 * de los del inventario (`add-to-cart-<slug>`): no se reutilizan esos locators.
 */
export class ProductDetailPage extends BasePage {
  protected readonly ruta = '/inventory-item.html';
  readonly nombre: Locator;
  readonly precio: Locator;
  readonly botonAgregar: Locator;
  readonly botonRemover: Locator;
  readonly botonVolver: Locator;

  constructor(page: Page) {
    super(page);
    this.nombre = page.getByTestId('inventory-item-name');
    this.precio = page.getByTestId('inventory-item-price');
    this.botonAgregar = page.getByTestId('add-to-cart');
    this.botonRemover = page.getByTestId('remove');
    this.botonVolver = page.getByTestId('back-to-products');
  }

  /** La URL lleva `?id=N`, asi que no sirve la comparacion exacta de BasePage. */
  async expectEstaAbierta() {
    await expect(this.page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
    await expect(this.botonVolver).toBeVisible();
  }

  /** Botones con slug del inventario: en el detalle NO deben existir. */
  botonesConSlug(p: ProductoInventario): Locator {
    return this.page.locator(`[data-test="add-to-cart-${p.slug}"], [data-test="remove-${p.slug}"]`);
  }

  async volverAlInventario() {
    await this.botonVolver.click();
    await this.page.waitForURL('**/inventory.html');
  }
}
