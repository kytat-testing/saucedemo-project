import { PRODUCTOS, type Producto } from './products';

/**
 * Datos propios de las pruebas de inventario, sobre el catalogo de products.ts.
 *
 * - `itemId`: el de la URL del detalle (`inventory-item.html?id=N`) y el que
 *   se guarda en `localStorage['cart-contents']`. NO es el orden en pantalla.
 * - `slug`: sufijo del data-test del boton (`add-to-cart-<slug>` / `remove-<slug>`).
 *   El de la camiseta roja lleva '.' y '()': solo sirve en `[data-test="..."]`,
 *   nunca como `#id`.
 */
export interface ProductoInventario extends Producto {
  itemId: number;
  slug: string;
}

export const INVENTARIO = {
  mochila: { ...PRODUCTOS.mochila, itemId: 4, slug: 'sauce-labs-backpack' },
  luzBici: { ...PRODUCTOS.luzBici, itemId: 0, slug: 'sauce-labs-bike-light' },
  camiseta: { ...PRODUCTOS.camiseta, itemId: 1, slug: 'sauce-labs-bolt-t-shirt' },
  chaqueta: { ...PRODUCTOS.chaqueta, itemId: 5, slug: 'sauce-labs-fleece-jacket' },
  body: { ...PRODUCTOS.body, itemId: 2, slug: 'sauce-labs-onesie' },
  camisetaRoja: { ...PRODUCTOS.camisetaRoja, itemId: 3, slug: 'test.allthethings()-t-shirt-(red)' },
} satisfies Record<keyof typeof PRODUCTOS, ProductoInventario>;

export const TODO_EL_INVENTARIO: ProductoInventario[] = Object.values(INVENTARIO);

/** Precio como lo pinta la app: 29.99 -> "$29.99". */
export const precioEnPantalla = (p: Producto) => `$${p.precio.toFixed(2)}`;

/** Textos esperados en inventario y en el icono del carrito. */
export const COPY = {
  agregar: 'Add to cart',
  remover: 'Remove',
  tituloInventario: 'Products',
  cartQty: 'QTY',
  cartDesc: 'Description',
  /** Gramatica correcta: «1 item» en singular. Hoy la app dice «1 items» (TC-12). */
  aria: (n: number) => (n === 0 ? 'Cart, empty' : n === 1 ? 'Cart, 1 item' : `Cart, ${n} items`),
};
