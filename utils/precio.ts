/** "$29.99" o "Item total: $29.99" -> 29.99 */
export function parsePrecio(texto: string): number {
  const m = texto.match(/\$\s*([\d.,]+)/);
  if (!m) throw new Error(`No se encontro un precio en "${texto}"`);
  return Number(m[1].replace(/,/g, ''));
}
