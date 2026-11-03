import { Locator } from '@playwright/test';
import { parsePrecio } from '../../utils/precio';

export interface DatosItem {
  nombre: string;
  descripcion: string;
  precio: number;
  /** Solo existe en carrito y resumen de checkout. */
  cantidad?: number;
}

/**
 * Tarjeta/fila de producto. El inventario, el carrito y el resumen del
 * checkout usan los mismos data-test, asi que se comparte la lectura.
 */
export class ItemRow {
  readonly nombre: Locator;
  readonly descripcion: Locator;
  readonly precio: Locator;
  readonly cantidad: Locator;

  constructor(readonly raiz: Locator) {
    this.nombre = raiz.getByTestId('inventory-item-name');
    this.descripcion = raiz.getByTestId('inventory-item-desc');
    this.precio = raiz.getByTestId('inventory-item-price');
    this.cantidad = raiz.getByTestId('item-quantity');
  }

  /** Boton "Add to cart" / "Remove" de la propia fila. */
  boton(texto: 'Add to cart' | 'Remove'): Locator {
    return this.raiz.getByRole('button', { name: texto });
  }

  async leer(): Promise<DatosItem> {
    const datos: DatosItem = {
      nombre: (await this.nombre.innerText()).trim(),
      descripcion: (await this.descripcion.innerText()).trim(),
      precio: parsePrecio(await this.precio.innerText()),
    };
    if (await this.cantidad.count()) {
      datos.cantidad = Number((await this.cantidad.innerText()).trim());
    }
    return datos;
  }
}

/** Fila cuyo nombre coincide EXACTAMENTE (hasText haria coincidencia parcial). */
export function filaPorNombre(contenedor: Locator, nombre: string): ItemRow {
  const raiz = contenedor
    .getByTestId('inventory-item')
    .filter({ has: contenedor.page().getByTestId('inventory-item-name').getByText(nombre, { exact: true }) });
  return new ItemRow(raiz);
}

export async function leerTodas(contenedor: Locator): Promise<DatosItem[]> {
  const filas = await contenedor.getByTestId('inventory-item').all();
  return Promise.all(filas.map((f) => new ItemRow(f).leer()));
}
