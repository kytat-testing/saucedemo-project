export interface Producto {
  nombre: string;
  precio: number;
}

/**
 * Catalogo esperado. Sirve de oraculo independiente: el carrito se compara
 * con lo que el inventario muestra Y con este catalogo, para que un precio
 * mal pintado en las dos pantallas no pase desapercibido.
 */
export const PRODUCTOS = {
  mochila: { nombre: 'Sauce Labs Backpack', precio: 29.99 },
  luzBici: { nombre: 'Sauce Labs Bike Light', precio: 9.99 },
  camiseta: { nombre: 'Sauce Labs Bolt T-Shirt', precio: 15.99 },
  chaqueta: { nombre: 'Sauce Labs Fleece Jacket', precio: 49.99 },
  body: { nombre: 'Sauce Labs Onesie', precio: 7.99 },
  camisetaRoja: { nombre: 'Test.allTheThings() T-Shirt (Red)', precio: 15.99 },
} satisfies Record<string, Producto>;

export const TODOS_LOS_PRODUCTOS: Producto[] = Object.values(PRODUCTOS);

/** Suma en centavos para no arrastrar errores de coma flotante. */
export function sumaPrecios(productos: Producto[]): number {
  return productos.reduce((acc, p) => acc + Math.round(p.precio * 100), 0) / 100;
}
