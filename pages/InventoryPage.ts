import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { DatosItem, ItemRow, filaPorNombre, leerTodas } from './components/ItemRow';
import type { ProductoInventario } from '../data/inventory';

export class InventoryPage extends BasePage {
  protected readonly ruta = '/inventory.html';
  readonly lista: Locator;

  constructor(page: Page) {
    super(page);
    this.lista = page.getByTestId('inventory-list');
  }

  async expectEstaAbierta() {
    await super.expectEstaAbierta('Products');
  }

  producto(nombre: string): ItemRow {
    return filaPorNombre(this.lista, nombre);
  }

  /** Agrega y devuelve lo que el inventario mostraba, para compararlo luego en el carrito. */
  async agregar(nombre: string): Promise<DatosItem> {
    const fila = this.producto(nombre);
    const datos = await fila.leer();
    await fila.boton('Add to cart').click();
    await expect(fila.boton('Remove')).toBeVisible();
    return datos;
  }

  async agregarVarios(nombres: string[]): Promise<DatosItem[]> {
    const agregados: DatosItem[] = [];
    for (const n of nombres) agregados.push(await this.agregar(n));
    return agregados;
  }

  async leerProductos(): Promise<DatosItem[]> {
    return leerTodas(this.lista);
  }

  // ── Agregar / remover por data-test (pruebas de inventario) ──────────────
  // El data-test del boton CAMBIA al agregar (add-to-cart-<slug> -> remove-<slug>):
  // un locator guardado antes del clic deja de resolver. Para clics repetidos se
  // usa el boton de la fila (`producto(nombre)`), que no depende del data-test.

  /** Todos los botones del inventario en estado «Add to cart» / «Remove». */
  get botonesAgregar(): Locator {
    return this.lista.locator('[data-test^="add-to-cart-"]');
  }

  get botonesRemover(): Locator {
    return this.lista.locator('[data-test^="remove-"]');
  }

  btnAgregar(p: ProductoInventario): Locator {
    return this.lista.locator(`[data-test="add-to-cart-${p.slug}"]`);
  }

  btnRemover(p: ProductoInventario): Locator {
    return this.lista.locator(`[data-test="remove-${p.slug}"]`);
  }

  async quitar(nombre: string) {
    const fila = this.producto(nombre);
    await fila.boton('Remove').click();
    await expect(fila.boton('Add to cart')).toBeVisible();
  }

  /** Agregado: remove-<slug> visible y add-to-cart-<slug> inexistente. */
  async expectEnCarrito(p: ProductoInventario) {
    await expect(this.btnRemover(p), `«${p.nombre}» debe quedar en «Remove»`).toHaveText('Remove');
    await expect(this.btnAgregar(p)).toHaveCount(0);
  }

  async expectFueraDelCarrito(p: ProductoInventario) {
    await expect(this.btnAgregar(p), `«${p.nombre}» debe quedar en «Add to cart»`).toHaveText('Add to cart');
    await expect(this.btnRemover(p)).toHaveCount(0);
  }

  /**
   * n clics fisicos seguidos, sin esperar el cambio de estado entre uno y otro.
   * Va por la etiqueta `button`: los enlaces de imagen y titulo de la tarjeta
   * tambien tienen role="button" y `getByRole('button')` resuelve a 3 elementos.
   */
  async clicsSeguidos(nombre: string, n: number) {
    const boton = this.producto(nombre).raiz.locator('button');
    for (let i = 0; i < n; i++) await boton.click();
  }

  async dobleClic(nombre: string) {
    await this.producto(nombre).raiz.locator('button').dblclick();
  }

  /** Entra al detalle por el enlace del titulo (data-test con GUIONES: item-<id>-title-link). */
  async abrirDetalle(p: ProductoInventario) {
    await this.lista.getByTestId(`item-${p.itemId}-title-link`).click();
    await this.page.waitForURL(`**/inventory-item.html?id=${p.itemId}`);
  }

  /** Recarga real (page.reload); un F5 por teclado no recarga la SPA. */
  async recargar() {
    await this.page.reload();
    await expect(this.lista).toBeVisible();
  }
}
