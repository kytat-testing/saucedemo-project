import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { DatosItem, ItemRow, filaPorNombre, leerTodas } from './components/ItemRow';

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
}
